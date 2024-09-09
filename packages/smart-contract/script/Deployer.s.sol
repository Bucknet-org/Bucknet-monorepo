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

        manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba); // slot 0 address
        manager.grantRole(manager.DEFAULT_ADMIN_ROLE(), 0x68693cd615D5F6515aCa7574105b30e6aDeD8dcF);
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0x68693cd615D5F6515aCa7574105b30e6aDeD8dcF); // slot 1 address
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xeaB6e3625Bf1c78d926cD82a243492c51BE1A7d7); // slot 2 address
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xbE723471706377eF24ca37654147aBC2d14cC54e); // slot 3 address
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0xA0b6bcE5f1e0BB75a0EEe2073905e5291f97A404); // slot 4 address
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, 0x75Eae71D84F32FE3cf5DCfD0D47eCDD88eF391A4); // slot 5 address

        address[] memory members = new address[](6);
        members[0] = 0xeaB6e3625Bf1c78d926cD82a243492c51BE1A7d7;
        members[1] = 0x68693cd615D5F6515aCa7574105b30e6aDeD8dcF;
        members[2] = 0xB18922995ddE6C185430EfC9DCb79ba86D888Dba;
        members[3] = 0xbE723471706377eF24ca37654147aBC2d14cC54e;
        members[4] = 0xA0b6bcE5f1e0BB75a0EEe2073905e5291f97A404;
        members[5] = 0x75Eae71D84F32FE3cf5DCfD0D47eCDD88eF391A4;

        deployContract('Contributor.sol:Contributor', abi.encode(address(manager), members));
    }
}
