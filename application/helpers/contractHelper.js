'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

const { PHARMA_NETWORK, CREDENTIALS } = require('../constants');

const UTF_8 = 'utf-8';

let gateway;

async function getContractInstance(contractType, organizationRole) {

    gateway = new Gateway();

    let profile = getProfileByContractType(contractType);

    let walletCreds = getWalletCredsByOrganizationRole(organizationRole)

    let connectionObject = {
        wallet : walletCreds.wallet,
        identity : walletCreds.userName,
        discovery : {
            enabled : false,
            asLocalhost: true
        }
    };

    console.log('Connecting to network...');
    await gateway.connect(profile.connectionProfile, connectionObject);
    console.log('Connected to network');

    console.log('Connecting to channel: ${PHARMA_NETWORK.CHANNEL}');
    const channel = await gateway.getNetwork(PHARMA_NETWORK.CHANNEL);
    console.log('Connected to channel');

    console.log('Connecting to smart contract: ${smartContractName}');
    return channel.getContract('pharmanet', profile.smartContractName);

}

async function disconnect() {
    console.log('Disconnecting from network...');
    if(typeof gateway !== 'undefined') {
        gateway.disconnect();
    }
}

function getProfileByContractType(contractType) {
    let result;

    switch(contractType) {
        case PHARMA_NETWORK.CONTRACTS.COMMON_CONTRACT.TYPE : result = {
            smartContractName : PHARMA_NETWORK.CONTRACTS.COMMON_CONTRACT.NAME,
            connectionProfileFile : fs.readFileSync('../' + PHARMA_NETWORK.CONTRACTS.COMMON_CONTRACT.CONNECTION_PROFILE_PATH, UTF_8),
            connectionProfile : yaml.safeLoad(connectionProfileFile)
        }; break;
        case PHARMA_NETWORK.CONTRACTS.MANUFACTURER_CONTRACT.TYPE : result = {
            smartContractName : PHARMA_NETWORK.CONTRACTS.MANUFACTURER_CONTRACT.NAME,
            connectionProfileFile : fs.readFileSync('../' + PHARMA_NETWORK.CONTRACTS.MANUFACTURER_CONTRACT.CONNECTION_PROFILE_PATH, UTF_8),
            connectionProfile : yaml.safeLoad(connectionProfileFile),
        }; break;
        case PHARMA_NETWORK.CONTRACTS.RETAILER_CONTRACT.TYPE : result = {
            smartContractName : PHARMA_NETWORK.CONTRACTS.RETAILER_CONTRACT.NAME,
            connectionProfileFile : fs.readFileSync('../' + PHARMA_NETWORK.CONTRACTS.RETAILER_CONTRACT.CONNECTION_PROFILE_PATH, UTF_8),
            connectionProfile : yaml.safeLoad(connectionProfileFile),
        }; break;
        case PHARMA_NETWORK.CONTRACTS.TRANSPORTER_CONTRACT.TYPE : result = {
            smartContractName : PHARMA_NETWORK.CONTRACTS.TRANSPORTER_CONTRACT.NAME,
            connectionProfileFile : fs.readFileSync('../' + PHARMA_NETWORK.CONTRACTS.TRANSPORTER_CONTRACT.CONNECTION_PROFILE_PATH, UTF_8),
            connectionProfile : yaml.safeLoad(connectionProfileFile),
        }; break;
        default : {
            throw new Error('Invalid contract type provided');
        }
    }

    return result;
}

function getWalletCredsByOrganizationRole(organizationRole) {
    let result;

    switch(organizationRole) {
        case CREDENTIALS.MANUFACTURER.ROLE : result = {
            wallet : new FileSystemWallet('../' + CREDENTIALS.MANUFACTURER.WALLET_PATH),
            userName : CREDENTIALS.MANUFACTURER.ADMIN.IDENTITY_LABEL
        }; break;
        case CREDENTIALS.DISTRIBUTOR.ROLE : result = {
            wallet : new FileSystemWallet('../' + CREDENTIALS.DISTRIBUTOR.WALLET_PATH),
            userName : CREDENTIALS.DISTRIBUTOR.ADMIN.IDENTITY_LABEL
        }; break;
        case CREDENTIALS.RETAILER.ROLE : result = {
            wallet : new FileSystemWallet('../' + CREDENTIALS.RETAILER.WALLET_PATH),
            userName : CREDENTIALS.RETAILER.ADMIN.IDENTITY_LABEL
        }; break;
        case CREDENTIALS.CONSUMER.ROLE : result = {
            wallet : new FileSystemWallet('../' + CREDENTIALS.CONSUMER.WALLET_PATH),
            userName : CREDENTIALS.CONSUMER.ADMIN.IDENTITY_LABEL
        }; break;
        case CREDENTIALS.TRANSPORTER.ROLE : result = {
            wallet : new FileSystemWallet('../' + CREDENTIALS.TRANSPORTER.WALLET_PATH),
            userName : CREDENTIALS.TRANSPORTER.ADMIN.IDENTITY_LABEL
        }; break;
        default : {
            throw new Error('Invalid organization role provided');
        }
    }

    return result;
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;