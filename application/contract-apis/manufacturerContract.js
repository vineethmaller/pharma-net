'use strict';

const contractHelper = require('../helpers/contractHelper');

const FUNCTIONS = {
    ADD_DRUG : 'addDrug'
};

const CONTRACT_TYPE = 'manufacturer';

async function addDrug(drugName, serialNo, manufacturedDate, expiryDate, companyCRN, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for adding drug to the inventory');
        const drugObjectBuffer = await contract.submitTransaction(FUNCTIONS.ADD_DRUG, drugName, serialNo, manufacturedDate, expiryDate, companyCRN);

        comnsole.log('Response received from network. Parsing...');
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