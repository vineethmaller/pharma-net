'use strict';

const fs = require('fs');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CommonHelper } = require('../helpers/commonHelper');
const { CREDENTIALS } = require('../constants');

const wallet = new FileSystemWallet(CREDENTIALS.MANUFACTURER.WALLET_PATH);

async function main(certPath, privateKeyDirPath) {
    try {
        const privateKeyPath = CommonHelper.getPrivateKeyFullPathFromDir(privateKeyDirPath);

        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privateKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(CREDENTIALS.MANUFACTURER.MSP_ID, certificate, privateKey);
        
        await wallet.import(CREDENTIALS.MANUFACTURER.ADMIN.IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding manufacturer creds to wallet. Error: ' + error.toString());
        throw new Error(error);
    }
}



main(CREDENTIALS.MANUFACTURER.ADMIN.CERTIFICATE, CREDENTIALS.MANUFACTURER.ADMIN.PRIVATE_KEY)
.then(() => { console.log("Manufacturer credentials is successfully added to wallet"); });

module.exports.execute = main;