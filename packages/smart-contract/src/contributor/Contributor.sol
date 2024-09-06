// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Roles} from "../libraries/Roles.sol";
import {Context} from "../utils/Context.sol";
import {AccessManagerV2} from "../access/AccessManagerV2.sol";
import {EnumerableSet} from "../utils/structs/EnumerableSet.sol";

contract Contributor is Context {
    using EnumerableSet for *;
    
    struct Evaluation {
        bytes32 poe;
        uint128 openAt;
        uint128 closeAt;
        EnumerableSet.AddressSet evaluators;
        mapping(uint256 slot => uint256) score;
        mapping(uint256 slot => uint256) numOfWorks;
    }

    event EvalSessionOpened(uint256 indexed epoch);
    event EvalSessionClosed(uint256 indexed epoch);
    event Evaluated(address indexed evaluator, uint256 indexed epoch);
    event MemberSlotUpdated(address indexed by, uint256 indexed slot);

    uint256 constant public MAX_DECIMAL_PTS = 5;
    uint256 constant public DENOMINATOR = 10_000; 
    uint256 constant public PENALTY_POINTS = 50_000; 

    uint256 public epoch;
    AccessManagerV2 public manager;
    
    mapping(address => uint256) private penalty;
    mapping(address => uint256) private contribPts;
    mapping(uint256 => address) private memberOfSlot;
    mapping(uint256 => Evaluation) private evaluations;
    mapping(address => mapping(uint256 => uint256)) private avgPoints;

    constructor(address manager_, address[] memory members_) {
        manager = AccessManagerV2(manager_);

        for (uint256 i; i < members_.length; ++i) {
            memberOfSlot[i] = members_[i];
        }
    }

    modifier onlyRole(bytes32 role) {
        require(manager.hasRole(role, _msgSender()));
        _;
    }

    function getPoints() external view returns (uint256) {
        return contribPts[_msgSender()];
    }

    function getPenaltyPoints() external view returns (uint256) {
        return penalty[_msgSender()];
    }

    function getEpochPoints(uint256 epoch_) external view returns (uint256) {
        return avgPoints[_msgSender()][epoch_];
    }

    function updateMemberSlot(uint256 slot_, address newMember_) external onlyRole(manager.DEFAULT_ADMIN_ROLE()) {
        delete memberOfSlot[slot_];
        memberOfSlot[slot_] = newMember_;
        emit MemberSlotUpdated(_msgSender(), slot_);
    }

    function openEvalSession(bytes32 poe_, uint256[] calldata slots_, uint256[] calldata numOfWorks_) external onlyRole(manager.DEFAULT_ADMIN_ROLE()) {
        require(slots_.length == numOfWorks_.length, "length mismatch");
        
        if (epoch != 0) {
            _closeEvalSession(epoch);
        }

        epoch += 1;
        Evaluation storage eval = evaluations[epoch];
        eval.poe = poe_;
        eval.openAt = uint128(block.timestamp);

        for (uint256 i; i < slots_.length; ++i) {
            eval.numOfWorks[slots_[i]] = numOfWorks_[i];
        }

        emit EvalSessionOpened(epoch);
    }

    function evaluate(uint256[] calldata slots_, uint256[] calldata points_) external onlyRole(Roles.CONTRIBUTOR_ROLE) {
        uint256 len = points_.length;
        address sender = _msgSender();
        require(len == slots_.length, "length mismatch");
        require(len == manager.getRoleMemberCount(Roles.CONTRIBUTOR_ROLE), "must evaluate all");

        Evaluation storage eval = evaluations[epoch];

        require(!eval.evaluators.contains(sender), "already evaluated");

        uint256 slot;
        uint256 point;
        uint256 limitPoints;

        for (uint256 i; i < len; ++i) {
            slot = slots_[i];
            point = points_[i];a
            limitPoints = eval.numOfWorks[slot] * MAX_DECIMAL_PTS;
            
            require(point <= limitPoints, "invalid points");
            eval.score[slot] += point;
        }
        eval.evaluators.add(sender);

        emit Evaluated(sender, epoch);
    }

    function _closeEvalSession(uint256 epoch_) internal {
        address[] memory evaluators = manager.getAllRoleMember(Roles.CONTRIBUTOR_ROLE);
        Evaluation storage eval = evaluations[epoch_];

        address evaluator;
        
        for (uint256 i; i < evaluators.length; ++i) {
            evaluator = evaluators[i];
            if (!eval.evaluators.contains(evaluator)) {
                penalty[evaluator] += PENALTY_POINTS;
            }
        }

        for (uint256 i; i < evaluators.length; ++i) {
            evaluator = evaluators[i];
            uint256 finalizePts;
            uint256 avgPts = (eval.score[i] * DENOMINATOR / eval.evaluators.length());
            if (avgPts > penalty[evaluator]) {
                finalizePts = avgPts - penalty[evaluator];
                penalty[evaluator] = 0;
            }
            else {
                finalizePts = 0;
                penalty[evaluator] -= avgPts;
            }
            contribPts[memberOfSlot[i]] += finalizePts;
            avgPoints[evaluator][epoch_] = finalizePts;
        }

        eval.closeAt = uint128(block.timestamp);

        emit EvalSessionClosed(epoch_);
    }
}
