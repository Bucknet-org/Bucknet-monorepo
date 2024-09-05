// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "./Migrate.s.sol";

import {Roles} from "../src/libraries/Roles.sol";
import {Contributor} from "../src/contributor/Contributor.sol";
import {AccessManagerV2} from "../src/access/AccessManagerV2.sol";

contract Deployer is BaseMigrate {
    function run() external {
        deploy();
    }

    function deploy() public broadcast {
        AccessManagerV2 manager = AccessManagerV2(deployContract('AccessManagerV2.sol:AccessManagerV2', abi.encode()));
        // manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 0 address
        // manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 1 address
        // manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 2 address
        // manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 3 address
        // manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 4 address
        // manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 5 address
        // manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 6 address

        deployContract('Contributor.sol:Contributor', abi.encode(address(manager)));
    }
}
