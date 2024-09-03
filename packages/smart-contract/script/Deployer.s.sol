// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./Migrate.s.sol";

import {Roles} from "../src/libraries/Roles.sol";
import {AccessManager} from "../src/access/AccessManager.sol";
import {AccessManagerV2} from "../src/access/AccessManagerV2.sol";

contract Deployer is BaseMigrate {
    function run() external {
        deploySingleNodeLoyaltyFeed();
    }

    function deploySingleNodeLoyaltyFeed() public broadcast {
        address amv1 = deployContract('AccessManager.sol:AccessManager', abi.encode());
        AccessManager(amv1).grantRole(Roles.OPERATOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba);
    }
}
