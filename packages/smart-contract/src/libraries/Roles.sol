// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Roles {
    /*
     * @dev Equal to keccak256("VOTER_ROLE")
     */
    bytes32 public constant VOTER_ROLE = 0x72c3eec1760bf69946625c2d4fb8e44e2c806345041960b434674fb9ab3976cf;
    /*
     * @dev Equal to keccak256("SIGNER_ROLE")
     */
    bytes32 public constant SIGNER_ROLE = 0xe2f4eaae4a9751e85a3e4a7b9587827a877f29914755229b07a7b2da98285f70;
    /*
     * @dev Equal to keccak256("OPERATOR_ROLE")
     */
    bytes32 public constant OPERATOR_ROLE = 0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929;
    /*
     * @dev Equal to keccak256("CONTRIBUTOR_ROLE")
     */
    bytes32 public constant CONTRIBUTOR_ROLE = 0xe2889e7308860b3fe8df0daa86fccfea4d71e43776719a57be28cf90b6db81e9;
    /*
     * @dev Equal to keccak256("TRANSMITTER_ROLE")
     */
    bytes32 public constant TRANSMITTER_ROLE = 0xd6a0f92c822ccba0fa91b30f08f085e68bc8eb3bb140aa16f8dc33ea47eb6cf2;
    /*
     * @dev Equal to keccak256("PROPOSAL_SYSTEM_ROLE")
     */
    bytes32 public constant PROPOSAL_SYSTEM_ROLE = 0x577bac641776d3a58673647a9d8079be4bcaf3312695d531c9bbc64155e5a35d;
}
