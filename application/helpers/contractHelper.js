'use strict';

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

const { PHARMA_NETWORK, CREDENTIALS } = require('../constants');

const UTF_8 = 'utf-8';

let gateway;

async function getContractInstance(contractType, organizationRole) {

    gateway = new Gateway();

    let smartContractName = await getContractName(contractType);

    let connectionOptions = await getConnectionByOrganizationRole(organizationRole)

    console.log(connectionOptions.wallet);
    console.log(connectionOptions.userName);
    let connectionObject = {
        wallet : connectionOptions.wallet,
        identity : connectionOptions.userName,
        discovery : {
            enabled : false,
            asLocalhost: true
        }
    };

    console.log('Connecting to network...');
    await gateway.connect(connectionOptions.connectionProfile, connectionObject);
    console.log('Connected to network');

    console.log('Connecting to channel: ${PHARMA_NETWORK.CHANNEL}');
    const channel = await gateway.getNetwork(PHARMA_NETWORK.CHANNEL);
    console.log('Connected to channel');

    console.log('Connecting to smart contract: ' + smartContractName);
    return channel.getContract('pharmanet', smartContractName);

}

async function disconnect() {
    console.log('Disconnecting from network...');
    if(typeof gateway !== 'undefined') {
        gateway.disconnect();
    }
}

async function getContractName(contractType) {

    if(contractType === PHARMA_NETWORK.CONTRACTS.COMMON_CONTRACT.TYPE) {
        return PHARMA_NETWORK.CONTRACTS.COMMON_CONTRACT.NAME;
    } else if(contractType === PHARMA_NETWORK.CONTRACTS.MANUFACTURER_CONTRACT.TYPE) {
        return PHARMA_NETWORK.CONTRACTS.MANUFACTURER_CONTRACT.NAME;
    } else if(contractType === PHARMA_NETWORK.CONTRACTS.RETAILER_CONTRACT.TYPE) {
        return PHARMA_NETWORK.CONTRACTS.RETAILER_CONTRACT.NAME;
    } else if(contractType === PHARMA_NETWORK.CONTRACTS.TRANSPORTER_CONTRACT.TYPE) {
        return PHARMA_NETWORK.CONTRACTS.TRANSPORTER_CONTRACT.NAME;
    } else {
        throw new Error('Invalid contract type provided');
    }
}

async function getConnectionByOrganizationRole(organizationRole) {
    let result = {};

    if(organizationRole === CREDENTIALS.MANUFACTURER.ROLE) {
        result.connectionProfileFile = fs.readFileSync(CREDENTIALS.MANUFACTURER.CONNECTION_PROFILE_PATH, UTF_8);
        result.connectionProfile = yaml.load(result.connectionProfileFile);
        result.wallet = new FileSystemWallet(CREDENTIALS.MANUFACTURER.WALLET_PATH);
        result.userName = CREDENTIALS.MANUFACTURER.ADMIN.IDENTITY_LABEL;
    } else if (organizationRole === CREDENTIALS.DISTRIBUTOR.ROLE) {
        result.connectionProfileFile = fs.readFileSync(CREDENTIALS.DISTRIBUTOR.CONNECTION_PROFILE_PATH, UTF_8);
        result.connectionProfile = yaml.load(result.connectionProfileFile);
        result.wallet = new FileSystemWallet(CREDENTIALS.DISTRIBUTOR.WALLET_PATH);
        result.userName = CREDENTIALS.DISTRIBUTOR.ADMIN.IDENTITY_LABEL;
    } else if(organizationRole === CREDENTIALS.RETAILER.ROLE) {
        result.connectionProfileFile = fs.readFileSync(CREDENTIALS.RETAILER.CONNECTION_PROFILE_PATH, UTF_8);
        result.connectionProfile = yaml.load(result.connectionProfileFile);
        result.wallet = new FileSystemWallet(CREDENTIALS.RETAILER.WALLET_PATH);
        result.userName = CREDENTIALS.RETAILER.ADMIN.IDENTITY_LABEL;
    } else if(organizationRole === CREDENTIALS.CONSUMER.ROLE) {
        result.connectionProfileFile = fs.readFileSync(CREDENTIALS.CONSUMER.CONNECTION_PROFILE_PATH, UTF_8);
        result.connectionProfile = yaml.load(result.connectionProfileFile);
        result.wallet = new FileSystemWallet(CREDENTIALS.CONSUMER.WALLET_PATH);
        result.userName = CREDENTIALS.CONSUMER.ADMIN.IDENTITY_LABEL;
    } else if(organizationRole === CREDENTIALS.TRANSPORTER.ROLE) {
        result.connectionProfileFile = fs.readFileSync(CREDENTIALS.TRANSPORTER.CONNECTION_PROFILE_PATH, UTF_8);
        result.connectionProfile = yaml.load(result.connectionProfileFile);
        result.wallet = new FileSystemWallet(CREDENTIALS.TRANSPORTER.WALLET_PATH);
        result.userName = CREDENTIALS.TRANSPORTER.ADMIN.IDENTITY_LABEL;
    } else {
        throw new Error('Invalid organization role provided');
    }

    return result;
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;