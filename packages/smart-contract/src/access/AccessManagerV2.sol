// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Roles} from "../libraries/Roles.sol";
import {AccessControlEnumerable} from "./AccessControlEnumerable.sol";

contract AccessManagerV2 is AccessControlEnumerable {
    constructor() {
        _setRoleAdmin(Roles.SIGNER_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(Roles.OPERATOR_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(Roles.TRANSMITTER_ROLE, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }
}
