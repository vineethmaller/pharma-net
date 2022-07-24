'use strict';

const fs = require('fs');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CREDENTIALS } = require('../constants');

const wallet = new FileSystemWallet('./identity/transporter');

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(CREDENTIALS.TRANSPORTER.MSP_ID, certificate, privateKey);
        
        await wallet.import(CREDENTIALS.TRANSPORTER.ADMIN.IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding transporter creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(CREDENTIALS.TRANSPORTER.ADMIN.CERTIFICATE, CREDENTIALS.TRANSPORTER.ADMIN.PRIVATE_KEY)
.then(() => { console.log("Transporter credentials is successfully added to wallet"); });

module.exports.execute = main;