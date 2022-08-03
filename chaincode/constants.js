'use strict';

const SHIPMENT_STATUS = {
    IN_TRANSIT : 'in-transit',
    DELIVERED : 'delivered'
}

const HIERARCHY_LEVELS = {
    LEVEL_1 : 1,
    LEVEL_2 : 2,
    LEVEL_3 : 3,
    LEVEL_4 : 4
}

const ROLES = {
    MANUFACTURER : { mspID : "manufacturerMSP", hierarchy : HIERARCHY_LEVELS.LEVEL_1 },
    DISTRIBUTOR : { mspID : "distributorMSP", hierarchy : HIERARCHY_LEVELS.LEVEL_2 },
    RETAILER : { mspID : "retailerMSP", hierarchy : HIERARCHY_LEVELS.LEVEL_3 },
    CONSUMER : { mspID : "consumerMSP", hierarchy : HIERARCHY_LEVELS.LEVEL_4 },
    TRANSPORTER : { mspID : "transporterMSP" }
};

const ERRORS = {
    ROLE_AUTHORIZATION_ERROR : 'You do not have the authorization to perform this operation',
    USER_VALIDATION_ERROR : 'User ID mismatch',
    ORGANIZATION_ROLE_NOT_FOUND : 'Organization role provided is not found',
    ORGANIZATION_ROLE_DOES_NOT_MATCH_MSP_ID : 'Organization role provided does not match the entity\'s network role',
    COMPANY_ALREADY_REGISTERED : 'The company is already registered in the network',
    COMPANY_IS_NOT_REGISTERED : 'The company is not registered in the network',
    BUYER_IS_NOT_REGISTERED : 'The buyer is not registered in the network',
    SELLER_IS_NOT_REGISTERED : 'The seller is not registered in the network',
    TRANSPORTER_IS_NOT_REGISTERED : 'The transporter is not registered in the network',
    RETAILER_IS_NOT_REGISTERED : 'The retailer is not registered in the network',
    SERIAL_NO_IS_ALREADY_USED : 'The serial number provided is already associated with another drug',
    PRODUCT_ALREADY_ADDED : 'The drug is already added to the inventory',
    INVALID_PURCHASE_ORDER : 'The purchase order is invalid',
    PRODUCT_NOT_FOUND : 'The drug is not found in the inventory',
    INVALID_MANUFACTURED_DATE : 'Manufactured date of drug is invalid',
    INVALID_EXPIRY_DATE : 'Expiry date of drug is invalid',
    DRUG_NOT_FOUND : 'The provided drug does not exist in the inventory',
    PURCHASE_ORDER_NOT_FOUND : 'Purchase order not found for this shipment',
    SHIPMENT_NOT_FOUND : 'Shipment is not found in the database',
    TRANSPORTER_DOES_NOT_MATCH : 'This transporter not assigned to the shipment',
    RETAILER_DOES_NOT_MATCH : 'This retailer does not own the product',
    INCORRECT_ITEM_COUNT_IN_SHIPMENT : 'The quantity requested in purchase order does not match the count of items being shipped',
    DRUG_HAS_EXPIRED : 'The drug has expired and cannot be sold to the consumer'
};

const COMPOSITE_KEY_PREFIXES = {
    COMPANY : 'org.pharma-network.pharmanet.company',
    PRODUCT : 'org.pharma-network.pharmanet.product',
    PURCHASE_ORDER : 'org.pharma-network.pharmanet.purchaseorder',
    SHIPMENT : 'org.pharma-network.pharmanet.shipment'
};

module.exports = {
    SHIPMENT_STATUS, 
    HIERARCHY_LEVELS,
    ROLES,
    ERRORS,
    COMPOSITE_KEY_PREFIXES
};