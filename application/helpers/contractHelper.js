'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');

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

    console.log('Connecting to channel: pharmachannel');
    const channel = await gateway.getNetwork('pharmachannel');
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
        case 'common' : result = {
            smartContractName : 'pharmanet.commoncontract',
            connectionProfileFile : fs.readFileSync('../connection-profiles/common.yml', 'utf-8'),
            connectionProfile : yaml.safeLoad(connectionProfileFile)
        }; break;
        case 'manufacturer' : result = {
            smartContractName : 'pharmanet.manufacturercontract',
            connectionProfileFile : fs.readFileSync('../connection-profiles/manufacturer.yml', 'utf-8'),
            connectionProfile : yaml.safeLoad(connectionProfileFile),
        }; break;
        case 'retailer' : result = {
            smartContractName : 'pharmanet.retailercontract',
            connectionProfileFile : fs.readFileSync('../connection-profiles/retailer.yml', 'utf-8'),
            connectionProfile : yaml.safeLoad(connectionProfileFile),
        }; break;
        case 'transporter' : result = {
            smartContractName : 'pharmanet.transportercontract',
            connectionProfileFile : fs.readFileSync('../connection-profiles/transporter.yml', 'utf-8'),
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
        case 'manufacturer' : result = {
            wallet : new FileSystemWallet('../wallets/identity/manufacturer'),
            userName : 'MANUFACTURER_ADMIN'
        }; break;
        case 'distributor' : result = {
            wallet : new FileSystemWallet('../wallets/identity/distributor'),
            userName : 'DISTRIBUTOR_ADMIN'
        }; break;
        case 'retailer' : result = {
            wallet : new FileSystemWallet('../wallets/identity/retailer'),
            userName : 'RETAILER_ADMIN'
        }; break;
        case 'consumer' : result = {
            wallet : new FileSystemWallet('../wallets/identity/consumer'),
            userName : 'CONSUMER_ADMIN'
        }; break;
        case 'transporter' : result = {
            wallet : new FileSystemWallet('../wallets/identity/transporter'),
            userName : 'TRANSPORTER_ADMIN'
        }; break;
        default : {
            throw new Error('Invalid organization role provided');
        }
    }

    return result;
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;