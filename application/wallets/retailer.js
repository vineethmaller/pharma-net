'use strict';

const fs = require('fs');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CREDENTIALS } = require('../constants');

const wallet = new FileSystemWallet('./identity/retailer');

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(CREDENTIALS.RETAILER.MSP_ID, certificate, privateKey);
        
        await wallet.import(CREDENTIALS.RETAILER.ADMIN.IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding retailer creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(CREDENTIALS.RETAILER.ADMIN.CERTIFICATE, CREDENTIALS.RETAILER.ADMIN.PRIVATE_KEY)
.then(() => { console.log("Retailer credentials is successfully added to wallet"); });

module.exports.execute = main;