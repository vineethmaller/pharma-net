'use strict';

const fs = require('fs');
const path = require('path');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const CRYPTO_MATERIALS_PATH = path.resolve('../../network/crypto-config');
const wallet = new FileSystemWallet('./identity/consumer');

const IDENTITY_LABEL = "CONSUMER_ADMIN";
const CONSUMER_MSP_ID = "consumerMSP";

const CONSUMER_CERTIFICATE_PATH = CRYPTO_MATERIALS_PATH + '/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem';
const CONSUMER_PREVIATE_KEY = CRYPTO_MATERIALS_PATH + '/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/*_sk';

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(CONSUMER_MSP_ID, certificate, privateKey);
        
        await wallet.import(IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding consumer creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(CONSUMER_CERTIFICATE_PATH, CONSUMER_PREVIATE_KEY)
.then(() => { console.log("Consumer credentials is successfully added to wallet"); });

module.exports.execute = main;