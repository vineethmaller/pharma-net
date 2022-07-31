'use strict';

const fs = require('fs');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CommonHelper } = require('../helpers/commonHelper');
const { CREDENTIALS } = require('../constants');

const wallet = new FileSystemWallet(CREDENTIALS.TRANSPORTER.WALLET_PATH);

async function main(certPath, privateKeyDirPath) {
    try {
        const privateKeyPath = CommonHelper.getPrivateKeyFullPathFromDir(privateKeyDirPath);

        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privateKeyPath).toString();

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