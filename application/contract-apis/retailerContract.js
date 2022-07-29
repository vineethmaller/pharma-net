'use strict';

const contractHelper = require('../helpers/contractHelper');
const { PHARMA_NETWORK } = require('../constants');

const CONTRACT = PHARMA_NETWORK.CONTRACTS.RETAILER_CONTRACT;

async function retailDrug(drugName, serialNo, retailerCRN, customerAadhar, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT.TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for registering retail of drug in the network');
        const drugObjectBuffer = await contract.submitTransaction(CONTRACT.FUNCTIONS.RETAIL_DRUG, drugName, serialNo, retailerCRN, customerAadhar);

        console.log('Response received from network. Parsing...');
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