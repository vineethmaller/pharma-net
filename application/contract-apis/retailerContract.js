'use strict';

const contractHelper = require('../helpers/contractHelper');

const FUNCTIONS = {
    RETAIL_DRUG : 'retailDrug'
};

const CONTRACT_TYPE = 'retailer';

async function retailDrug(drugName, serialNo, retailerCRN, customerAadhar, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for registering retail of drug in the network');
        const drugObjectBuffer = await contract.submitTransaction(FUNCTIONS.RETAIL_DRUG, drugName, serialNo, retailerCRN, customerAadhar);

        comnsole.log('Response received from network. Parsing...');
        let drugObject = JSON.parse(drugObjectBuffer.toString());
        
        console.log('Drug state is updated as sold by retailer');
        return drugObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

module.exports.retailDrug = retailDrug;