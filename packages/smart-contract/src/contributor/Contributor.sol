// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {AccessManagerV2} from "./access/AccessManagerV2.sol";

contract Contributor {
    struct WVS {
        bytes32 poe;
        uint256 epoch;
        uint64 updatedAt;
    }

    mapping(address => uint256) public conPts;

    constructor(address manager_) {
        manager = AccessManagerV2(manager_);
    }

    modifier onlyRole(bytes32 role) {
        require(manager.hasRole(role, _msgSender()));
        _;
    }
}
