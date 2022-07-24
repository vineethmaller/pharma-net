'use strict';

const contractHelper = require('../helpers/contractHelper');

const FUNCTIONS = {
    REGISTER_COMPANY : 'registerCompany',
    CREATE_PURCHASE_ORDER : 'createPO',
    CREATE_SHIPMENT : 'createShipment',
    VIEW_HISTORY : 'viewHistory',
    VIEW_DRUG_STATE : 'viewDrugCurrentState'
};

const CONTRACT_TYPE = 'common';

async function registerCompany(companyCRN, companyName, location, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for registering company in network');
        const companyObjectBuffer = await contract.submitTransaction(FUNCTIONS.REGISTER_COMPANY, companyCRN, companyName, location, organizationRole);

        comnsole.log('Response received from network. Parsing...');
        let companyObject = JSON.parse(companyObjectBuffer.toString());
        
        console.log('Company is registered in network');
        return companyObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

async function createPurchaseOrder(buyerCRN, sellerCRN, drugName, quantity, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for creating purchase order');
        const purchaseOrderObjectBuffer = await contract.submitTransaction(FUNCTIONS.CREATE_PURCHASE_ORDER, buyerCRN, sellerCRN, drugName, quantity);

        comnsole.log('Response received from network. Parsing...');
        let purchaseOrderObject = JSON.parse(purchaseOrderObjectBuffer.toString());
        
        console.log('Purchase order is created');
        return purchaseOrderObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

async function createShipment(buyerCRN, drugName, listOfAssets, transporterCRN, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for creating shipment');
        const shipmentObjectBuffer = await contract.submitTransaction(FUNCTIONS.CREATE_SHIPMENT, buyerCRN, drugName, listOfAssets, transporterCRN);

        comnsole.log('Response received from network. Parsing...');
        let shipmentObject = JSON.parse(shipmentObjectBuffer.toString());
        
        console.log('Shipment is created');
        return shipmentObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

async function viewHistory(drugName, serialNo, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for retrieving history of drug');
        const drugHistoryObjectBuffer = await contract.submitTransaction(FUNCTIONS.VIEW_HISTORY, drugName, serialNo);

        comnsole.log('Response received from network. Parsing...');
        let drugHistoryObject = JSON.parse(drugHistoryObjectBuffer.toString());
        
        console.log('Drug history is retrieved');
        return drugHistoryObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

async function viewDrugState(drugName, serialNo, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for retrieving current state of drug');
        const drugHistoryObjectBuffer = await contract.submitTransaction(FUNCTIONS.VIEW_DRUG_STATE, drugName, serialNo);

        comnsole.log('Response received from network. Parsing...');
        let drugHistoryObject = JSON.parse(drugHistoryObjectBuffer.toString());
        
        console.log('Current state of drug is retrieved');
        return drugHistoryObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

module.exports.registerCompany = registerCompany;
module.exports.createPurchaseOrder = createPurchaseOrder;
module.exports.createShipment = createShipment;
module.exports.viewHistory = viewHistory;
module.exports.viewDrugState = viewDrugState;