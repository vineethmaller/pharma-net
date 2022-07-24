'use strict';

const fs = require('fs');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CREDENTIALS } = require('../constants'); 

const wallet = new FileSystemWallet('./identity/distributor');

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(CREDENTIALS.DISTRIBUTOR.MSP_ID, certificate, privateKey);
        
        await wallet.import(CREDENTIALS.DISTRIBUTOR.ADMIN.IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding distributor creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(CREDENTIALS.DISTRIBUTOR.ADMIN.CERTIFICATE, CREDENTIALS.DISTRIBUTOR.ADMIN.PRIVATE_KEY)
.then(() => { console.log("Distributor credentials is successfully added to wallet"); });

module.exports.execute = main;