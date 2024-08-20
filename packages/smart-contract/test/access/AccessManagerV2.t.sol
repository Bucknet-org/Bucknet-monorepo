// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test} from "@forge-std-1.9.1/src/Test.sol";
import {Roles} from "../../src/libraries/Roles.sol";
import {AccessManagerV2} from "../../src/access/AccessManagerV2.sol";
import {IAccessControl} from "../../src/access/IAccessControl.sol";

contract AccessManagerTest is Test {
    AccessManagerV2 manager;
    address noRole;
    address admin;
    address operator;
    address signer;
    address transmitter;

    function setUp() public {
        admin = vm.addr(1);
        operator = vm.addr(2);
        noRole = vm.addr(3);
        signer = vm.addr(4);
        transmitter = vm.addr(5);

        vm.prank(admin);
        manager = new AccessManagerV2();
    }

    function testConcreteGrantRoleSuccess() public {
        vm.expectEmit();
        emit IAccessControl.RoleGranted(Roles.OPERATOR_ROLE, operator, admin);
        emit IAccessControl.RoleGranted(Roles.SIGNER_ROLE, signer, admin);
        emit IAccessControl.RoleGranted(Roles.TRANSMITTER_ROLE, transmitter, admin);

        vm.startPrank(admin);
        manager.grantRole(Roles.OPERATOR_ROLE, operator);
        manager.grantRole(Roles.SIGNER_ROLE, signer);
        manager.grantRole(Roles.TRANSMITTER_ROLE, transmitter);
        vm.stopPrank();
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
        emit IAccessControl.RoleRevoked(Roles.SIGNER_ROLE, signer, admin);
        emit IAccessControl.RoleRevoked(Roles.TRANSMITTER_ROLE, transmitter, admin);

        vm.startPrank(admin);
        manager.revokeRole(Roles.OPERATOR_ROLE, operator);
        manager.revokeRole(Roles.SIGNER_ROLE, signer);
        manager.revokeRole(Roles.TRANSMITTER_ROLE, transmitter);
        vm.stopPrank();
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
