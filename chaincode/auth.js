'use strict';

const { USER_ROLE, REGISTRAR_ROLE, ROLE_AUTHORIZATION_ERROR, USER_VALIDATION_ERROR } = require('./constants');

class Auth {

    authorizeRole(ctx, _role) {
        if(ctx.clientIdentity.mspId != _role) {
            throw new Error(ROLE_AUTHORIZATION_ERROR);
        }
    } 

    authorizeUserRole(ctx) {
        this.authorizeRole(ctx, USER_ROLE);
    }

    authorizeRegistrarRole(ctx) {
        this.authorizeRole(ctx, REGISTRAR_ROLE);
    }

    validateUser(ctx, userID) {
        this.authorizeUserRole(ctx);
        if(ctx.clientIdentity.getID() != userID) {
            throw new Error(USER_VALIDATION_ERROR);
        }
    }
}

module.exports = { Auth };