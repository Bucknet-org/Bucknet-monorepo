// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {ErrorHandler} from "../libraries/ErrorHandler.sol";
import {EnumerableSet} from "../utils/structs/EnumerableSet.sol";

contract ProposalSystem {
    using ErrorHandler for *;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct Config {
        bool autoExecute;
        uint256 approvalsNeeded;
    }

    struct Transaction {
        address target;
        uint256 value;
        bytes data;
    }

    struct Proposal {
        bool executed;
        address proposer;
        uint256 createdAt;
        uint256 approvals;
        Transaction transaction;
    }

    event ProposalSubmitted(uint256 indexed proposalId, address indexed by);
    event ProposalApproved(uint256 indexed proposalId, address indexed by);
    event ApprovalRevoked(uint256 indexed proposalId, address indexed by);
    event ProposalExecuted(uint256 indexed proposalId, address indexed by, Transaction transaction);

    event VoterAdded(address indexed voter);
    event VoterKicked(address indexed voter);
    event VoterReplaced(address indexed oldVoter, address indexed newVoter);

    Config private __config;
    EnumerableSet.UintSet private __proposalIds;
    EnumerableSet.AddressSet private __voters;
    mapping(uint256 => Proposal) public proposalDetails;
    mapping(uint256 => mapping(address => bool)) public isConfirmed;

    modifier onlyVoter() {
        require(__voters.contains(msg.sender), "only voter can vote");
        _;
    }

    modifier notProxy(address addr) {
        require(addr.code.length == 0, "not proxy");
        _;
    }

    modifier requireProposal() {
        require(msg.sender == address(this), "require proposal");
        _;
    }

    modifier proposalExists(uint256 proposalId) {
        require(__proposalIds.contains(proposalId), "proposal not exists");
        _;
    }

    modifier proposalNotExists(uint256 proposalId) {
        require(!__proposalIds.contains(proposalId), "proposal already existed");
        _;
    }

    modifier notConfirmed(uint256 proposalId) {
        require(!isConfirmed[proposalId][msg.sender], "already confirmed");
        _;
    }

    modifier notExecuted(uint256 proposalId) {
        require(!proposalDetails[proposalId].executed, "already executed");
        _;
    }

    constructor(uint256 approvalsNeeded, address[] memory voters) {
        __config = Config(true, approvalsNeeded);
        for (uint256 i; i < voters.length; ++i) {
            __voters.add(voters[i]);
        }
    }

    function addVoter(address voter) external requireProposal notProxy(voter) {
        require(voter != address(0), "invalid voter");
        require(!__voters.contains(voter), "voter already existed");
        __voters.add(voter);
        emit VoterAdded(voter);
    }

    function kickVoter(address voter) external requireProposal {
        require(voter != address(0), "invalid voter");
        require(__voters.contains(voter), "voter not exists");
        __voters.remove(voter);
        emit VoterKicked(voter);
    }

    function replaceVoter(address oldVoter, address newVoter)
        external
        requireProposal
        notProxy(oldVoter)
        notProxy(newVoter)
    {
        require(oldVoter != address(0) && newVoter != address(0), "invalid voter");
        require(__voters.contains(oldVoter), "voter not exists");
        require(!__voters.contains(newVoter), "voter already existed");
        __voters.remove(oldVoter);
        __voters.add(newVoter);
        emit VoterReplaced(oldVoter, newVoter);
    }

    function createProposal(Transaction calldata transaction) external onlyVoter {
        uint256 proposalId = uint256(keccak256(abi.encode(msg.sender, block.timestamp, transaction)));

        Proposal memory proposal;
        proposal.proposer = msg.sender;
        proposal.createdAt = block.timestamp;
        proposal.approvals = 1;

        proposalDetails[proposalId] = proposal;

        emit ProposalSubmitted(proposalId, msg.sender);
    }

    function approveProposal(uint256 proposalId)
        external
        onlyVoter
        proposalExists(proposalId)
        notConfirmed(proposalId)
        notExecuted(proposalId)
    {
        isConfirmed[proposalId][msg.sender] = true;
        Proposal storage proposal = proposalDetails[proposalId];
        proposal.approvals += 1;

        emit ProposalApproved(proposalId, msg.sender);

        if (__config.autoExecute && proposal.approvals >= __config.approvalsNeeded) {
            _execute(proposal.transaction.target, proposal.transaction.value, proposal.transaction.data);
            proposal.executed = true;
        }
    }

    function revokeApproval(uint256 proposalId) external onlyVoter proposalExists(proposalId) notExecuted(proposalId) {
        require(isConfirmed[proposalId][msg.sender], "not confirmed");

        isConfirmed[proposalId][msg.sender] = false;
        proposalDetails[proposalId].approvals -= 1;

        emit ApprovalRevoked(proposalId, msg.sender);
    }

    function executeProposal(uint256 proposalId)
        external
        onlyVoter
        proposalExists(proposalId)
        notExecuted(proposalId)
    {
        Proposal storage proposal = proposalDetails[proposalId];
        Transaction memory transaction = proposal.transaction;

        require(proposal.approvals >= __config.approvalsNeeded, "lack of approvals");

        _execute(transaction.target, transaction.value, transaction.data);
        proposal.executed = true;

        emit ProposalExecuted(proposalId, msg.sender, transaction);
    }

    function _execute(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory retData) = target.call{value: value}(data);
        bytes4 callSig;
        assembly {
            if or(gt(mload(data), 4), eq(mload(data), 4)) { callSig := mload(add(data, 32)) }
        }
        success.handleRevert(callSig, retData);
    }
}
