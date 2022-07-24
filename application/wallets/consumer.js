'use strict';

const fs = require('fs');
const path = require('path');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CREDENTIALS } = require('../constants');

const CRYPTO_MATERIALS_PATH = path.resolve('../../network/crypto-config');
const wallet = new FileSystemWallet('./identity/consumer');

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(CREDENTIALS.CONSUMER.MSP_ID, certificate, privateKey);
        
        await wallet.import(CREDENTIALS.CONSUMER.ADMIN.IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding consumer creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(CREDENTIALS.CONSUMER.ADMIN.CERTIFICATE, CREDENTIALS.CONSUMER.ADMIN.PRIVATE_KEY)
.then(() => { console.log("Consumer credentials is successfully added to wallet"); });

module.exports.execute = main;