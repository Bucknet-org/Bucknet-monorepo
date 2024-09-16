// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test, console, StdStyle} from "@forge-std-1.9.1/src/Test.sol";
import {Roles} from "../../src/libraries/Roles.sol";
import {Contributor} from "../../src/contributor/Contributor.sol"; 
import {AccessManagerV2} from "../../src/access/AccessManagerV2.sol";
import {IAccessControl} from "../../src/access/IAccessControl.sol";

contract ContributorTest is Test {
    using StdStyle for *;

    AccessManagerV2 manager;
    Contributor contributor;
    address admin;
    address contributor_A;
    address contributor_B;
    address contributor_C;
    address contributor_D;

    function setUp() public {
        admin = vm.addr(1);
        contributor_A = vm.addr(2);
        contributor_B = vm.addr(3);
        contributor_C = vm.addr(4);
        contributor_D = vm.addr(5);

        vm.startPrank(admin);
        manager = new AccessManagerV2();
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, contributor_A);
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, contributor_B);
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, contributor_C);
        manager.grantRole(Roles.CONTRIBUTOR_ROLE, contributor_D);

        address[] memory members = new address[](4);
        members[0] = contributor_A;
        members[1] = contributor_B;
        members[2] = contributor_C;
        members[3] = contributor_D;

        contributor = new Contributor(address(manager), members);
        vm.stopPrank();
    }

    function testConcreteEvaluationSuccess() public {
        console.log("Example".blue());
        console.log("A evaluation is [15, 20, 30, 15]".blue());
        console.log("B evaluation is [20, 30, 15, 15]".blue());
        console.log("C evaluation is [15, 25, 10, 15]".blue());
        console.log("================================".magenta());
        console.log("Expectation:".yellow());
        console.log("A: 16.66 pts".yellow());
        console.log("B: 25 pts".yellow());
        console.log("C: 18.33 pts".yellow());
        console.log("D: 10 pts".yellow(), "= (45/3) - 5 (penalty)".yellow());
        console.log("================================".magenta());

        vm.prank(admin);
        uint256[] memory slots = new uint256[](4);
        slots[0] = 0;
        slots[1] = 1;
        slots[2] = 2;
        slots[3] = 3;

        uint256[] memory numOfWorks = new uint256[](4);
        numOfWorks[0] = 4;
        numOfWorks[1] = 6;
        numOfWorks[2] = 6;
        numOfWorks[3] = 3;

        contributor.openEvalSession(bytes32(0), slots, numOfWorks);

        uint256[] memory A_points = new uint256[](4);
        A_points[0] = 15; // A
        A_points[1] = 20; // B
        A_points[2] = 30; // C
        A_points[3] = 15; // D

        uint256[] memory B_points = new uint256[](4);
        B_points[0] = 20; // A
        B_points[1] = 30; // B
        B_points[2] = 15; // C
        B_points[3] = 15; // D

        uint256[] memory C_points = new uint256[](4);
        C_points[0] = 15; // A
        C_points[1] = 25; // B
        C_points[2] = 10; // C
        C_points[3] = 15; // D

        vm.prank(contributor_A);
        contributor.evaluate(slots, A_points);

        vm.prank(contributor_B);
        contributor.evaluate(slots, B_points);

        vm.prank(contributor_C);
        contributor.evaluate(slots, C_points);

        vm.prank(admin);
        contributor.openEvalSession(bytes32(0), slots, numOfWorks);

        console.log("Test Result".green());
        vm.prank(contributor_A);
        (, uint256 A_pts) = contributor.getPointsHistory(contributor_A, 1);
        assertEq(A_pts, 166666);
        console.log("A: ", A_pts, "pts /", contributor.DENOMINATOR());

        vm.prank(contributor_B);
        (, uint256 B_pts) = contributor.getPointsHistory(contributor_B, 1);
        assertEq(B_pts, 250000);
        console.log("B: ", B_pts, "pts /", contributor.DENOMINATOR());

        vm.prank(contributor_C);
        (, uint256 C_pts) = contributor.getPointsHistory(contributor_C, 1);
        assertEq(C_pts, 183333);
        console.log("C: ", C_pts, "pts /", contributor.DENOMINATOR());

        vm.prank(contributor_D);
        (, uint256 D_pts) = contributor.getPointsHistory(contributor_D, 1);
        assertEq(D_pts, 100000);
        console.log("D: ", D_pts, "pts /", contributor.DENOMINATOR());
    }
}
