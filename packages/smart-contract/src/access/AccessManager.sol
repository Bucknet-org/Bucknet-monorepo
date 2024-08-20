// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Roles} from "../libraries/Roles.sol";
import {AccessControl} from "./AccessControl.sol";

contract AccessManager is AccessControl {
    constructor() {
        _setRoleAdmin(Roles.OPERATOR_ROLE, DEFAULT_ADMIN_ROLE);
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }
}
