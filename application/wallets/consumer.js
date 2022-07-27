'use strict';

const fs = require('fs');
const path = require('path');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CommonHelper } = require('../helpers/commonHelper');
const { CREDENTIALS } = require('../constants');

const wallet = new FileSystemWallet(CREDENTIALS.CONSUMER.WALLET_PATH);

async function main(certPath, privateKeyDirPath) {
    try {
        const privateKeyPath = CommonHelper.getPrivateKeyFullPathFromDir(privateKeyDirPath);

        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privateKeyPath).toString();

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