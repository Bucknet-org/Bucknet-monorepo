// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./Migrate.s.sol";

import {Roles} from "../src/libraries/Roles.sol";
import {AccessManager} from "../src/access/AccessManager.sol";
import {SingleNodeLoyaltyFeed} from "../src/SingleNodeLoyaltyFeed.sol";

import {AccessManagerV2} from "../src/access/AccessManagerV2.sol";
import {ConsensusLoyaltyFeed} from "../src/ConsensusLoyaltyFeed.sol";

contract Deployer is BaseMigrate {
    function run() external {
        deploySingleNodeLoyaltyFeed();
    }

    function deploySingleNodeLoyaltyFeed() public broadcast {
        // address amv1 = deployContract('AccessManager.sol:AccessManager', abi.encode());
        // AccessManager(amv1).grantRole(Roles.OPERATOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba);
        deployContract(
            "SingleNodeLoyaltyFeed.sol:SingleNodeLoyaltyFeed", abi.encode(0xf664A9131b083c20DC3971551D27cB41Afe26f11)
        );
    }

    // function deployMSLoyaltyFeed() public broadcast {
    //     address amv2 = deployContract('AccessManagerV2.sol:AccessManagerV2', abi.encode());
    //     deployContract('ConsensusLoyaltyFeed.sol:ConsensusLoyaltyFeed', abi.encode(amv2));
    // }
}
