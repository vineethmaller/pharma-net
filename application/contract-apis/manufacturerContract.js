'use strict';

const contractHelper = require('../helpers/contractHelper');
const { PHARMA_NETWORK } = require('../constants');

const CONTRACT = PHARMA_NETWORK.CONTRACTS.MANUFACTURER_CONTRACT;

async function addDrug(drugName, serialNo, manufacturedDate, expiryDate, companyCRN, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT.TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for adding drug to the inventory');
        const drugObjectBuffer = await contract.submitTransaction(CONTRACT.FUNCTIONS.ADD_DRUG, drugName, serialNo, manufacturedDate, expiryDate, companyCRN);

        console.log('Response received from network. Parsing...');
        let drugObject = JSON.parse(drugObjectBuffer.toString());
        
        console.log('Drug is added to the inventory');
        return drugObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

module.exports.addDrug = addDrug;