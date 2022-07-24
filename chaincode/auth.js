'use strict';

const { ROLES, ERRORS } = require('./constants');

class Auth {

    static authorizeRole(ctx, _role) {
        if(ctx.clientIdentity.mspId != _role) {
            throw new Error(ERRORS.ROLE_AUTHORIZATION_ERROR);
        }
    }
    
    static authorizeRole(ctx, ...roles) {
        for(let role in roles) {
            if(ctx.clientIdentity.mspId === role.mspID) {
                return true;
            }
        }
        return false;
    }

    static authorizeManufacturerRole(ctx) {
        authorizeRole(ctx, ROLES.MANUFACTURER);
    }

    static authorizeDistributorRole(ctx) {
        authorizeRole(ctx, ROLES.DISTRIBUTOR);
    }

    static authorizeRetailerRole(ctx) {
        authorizeRole(ctx, ROLES.RETAILER);
    }

    static authorizeConsumerRole(ctx) {
        authorizeRole(ctx, ROLES.CONSUMER);
    }

    static authorizeTransporterRole(ctx) {
        authorizeRole(ctx, ROLES.TRANSPORTER);
    }

    static roleExists(_role) {
        return Object.values(ROLES)
            .filter(role => role.mspID === _role)
            .length === 1;
    }

    static organizationRoleExists(organizationRole) {
		return Object.keys(ROLES).indexOf(organizationRole.toUpperCase()) > -1;
	}

	static getRoleHierarchy(organizationRole) {
		if(organizationRoleExists(organizationRole)) {
			return ROLES[organizationRole.toUpperCase()].hierarchy;
		}
		return undefined;
	}

    static doesOrganizationRoleMatchMSPID(ctx, organizationRole) {
        if(this.organizationRoleExists(organizationRole)) {
            return ROLES[organizationRole.toUpperCase()].mspID === ctx.mspId;
        }
        throw new Error(ERRORS.ORGANIZATION_ROLE_NOT_FOUND);
    }

    validateUser(ctx, userID) {
        this.authorizeUserRole(ctx);
        if(ctx.clientIdentity.getID() != userID) {
            throw new Error(ERRORS.USER_VALIDATION_ERROR);
        }
    }
}

module.exports = { Auth };