'use strict';

const contractHelper = require('../helpers/contractHelper');

const FUNCTIONS = {
    UPDATE_SHIPMENT : 'updateShipment'
};

const CONTRACT_TYPE = 'transporter';

async function updateShipment(buyerCRN, drugName, transporterCRN, organizationRole) {
    try {
        const contract = await contractHelper.getContractInstance(CONTRACT_TYPE, organizationRole);
        console.log('Connected to smart contract');

        console.log('Submitting transaction for updating shipment status');
        const shipmentObjectBuffer = await contract.submitTransaction(FUNCTIONS.UPDATE_SHIPMENT, buyerCRN, drugName, transporterCRN);

        comnsole.log('Response received from network. Parsing...');
        let shipmentObject = JSON.parse(shipmentObjectBuffer.toString());
        
        console.log('Shipment status is updated');
        return shipmentObject;
    } catch(error) {
        console.log('Error: ${error}');
        throw new Error(error);
    } finally {
        contractHelper.disconnect();
        console.log('Disconnected from network');
    }
}

module.exports.updateShipment = updateShipment;