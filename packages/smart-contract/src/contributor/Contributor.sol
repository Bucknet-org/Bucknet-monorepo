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
        uint256 closeAt;
        EnumerableSet.AddressSet evaluators;
        mapping(uint256 slot => uint256) score;
    }

    event EvalSessionOpened(uint256 epoch);
    event EvalSessionClosed(uint256 epoch);
    event Evaluated(address evaluator, uint256 epoch);

    uint256 constant public DENOMINATOR = 10_000;
    uint256 constant public PENALTY_POINTS = 10_000;
    

    uint256 public epoch;
    AccessManagerV2 public manager;
    mapping(address => uint256) private penalty;
    mapping(address => uint256) private contribPts;
    mapping(uint256 => Evaluation) private evaluations;

    constructor(address manager_) {
        manager = AccessManagerV2(manager_);
    }

    modifier onlyRole(bytes32 role) {
        require(manager.hasRole(role, _msgSender()));
        _;
    }

    function openEvalSession(bytes32 poe_) external onlyRole(manager.DEFAULT_ADMIN_ROLE()) {
        if (epoch != 0) {
            _closeEvalSession(epoch);
        }
        epoch += 1;
        Evaluation storage eval = evaluations[epoch];
        eval.poe = poe_;
        eval.openAt = uint128(block.timestamp);

        emit EvalSessionOpened(epoch);
    }

    function evaluate(uint256[] calldata slot_, uint256[] calldata points_) external onlyRole(Roles.CONTRIBUTOR_ROLE) {
        uint256 len = slot_.length;
        require(len == points_.length, "length mismatch");
        // consider
        require(len == manager.getRoleMemberCount(Roles.CONTRIBUTOR_ROLE), "must evaluate all");

        Evaluation storage eval = evaluations[epoch];

        require(block.timestamp > eval.closeAt, "session closed");
        require(!eval.evaluators.contains(_msgSender()), "already evaluated");

        for (uint256 i; i < len; ++i) {
            eval.score[slot_[i]] += points_[i];
        }
        eval.evaluators.add(_msgSender());

        emit Evaluated(_msgSender(), epoch);
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
            contribPts[manager.getRoleMember(Roles.CONTRIBUTOR_ROLE, i)] += finalizePts;
        }

        emit EvalSessionClosed(epoch_);
    }
}
