// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "@forge-std-1.9.1/src/Test.sol";
import {Roles} from "../../src/libraries/Roles.sol";
import {AccessManager} from "../../src/access/AccessManager.sol";
import {IAccessControl} from "../../src/access/IAccessControl.sol";

contract AccessManagerTest is Test {
    AccessManager manager;
    address noRole;
    address admin;
    address operator;

    function setUp() public {
        admin = vm.addr(1);
        operator = vm.addr(2);
        noRole = vm.addr(3);

        vm.prank(admin);
        manager = new AccessManager();
    }

    function testConcreteGrantRoleSuccess() public {
        vm.expectEmit();
        emit IAccessControl.RoleGranted(Roles.OPERATOR_ROLE, operator, admin);
        vm.prank(admin);
        manager.grantRole(Roles.OPERATOR_ROLE, operator);
    }

    function testConcreteGrantRoleUnauthorizedFailed() public {
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, noRole, bytes32(0))
        );
        vm.prank(noRole);
        manager.grantRole(Roles.OPERATOR_ROLE, noRole);
    }

    function testConcreteRevokeRoleSuccess() public {
        testConcreteGrantRoleSuccess();
        vm.expectEmit();
        emit IAccessControl.RoleRevoked(Roles.OPERATOR_ROLE, operator, admin);
        vm.prank(admin);
        manager.revokeRole(Roles.OPERATOR_ROLE, operator);
    }

    function testConcreteRevokeRoleUnauthorizedFailed() public {
        testConcreteGrantRoleSuccess();
        vm.expectRevert(
            abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, noRole, bytes32(0))
        );
        vm.prank(noRole);
        manager.revokeRole(Roles.OPERATOR_ROLE, operator);
    }
}
