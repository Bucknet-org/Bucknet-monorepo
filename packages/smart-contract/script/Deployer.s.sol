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
        address[] memory members = new address[](6);
        members[0] = 0xeaB6e3625Bf1c78d926cD82a243492c51BE1A7d7;
        members[1] = 0x6116B23352b28841257B00F855918C4f83CbD494;
        members[2] = 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba;
        members[3] = 0xAF18C800883D1c3808295E962852d49eA2bFC03F;
        members[4] = 0xEE1f6b3f5f554238f8bea531f23A432Fb85b4FA3;
        members[5] = 0x75Eae71D84F32FE3cf5DCfD0D47eCDD88eF391A4;

        AccessManagerV2 manager = AccessManagerV2(deployContract('AccessManagerV2.sol:AccessManagerV2', abi.encode()));
        
        for (uint256 i = 0; i < members.length; i++) {
            manager.grantRole(Roles.CONTRIBUTOR_ROLE, members[i]); // slot i address
        }

        deployContract('Contributor.sol:Contributor', abi.encode(address(manager), members));
    }
}
