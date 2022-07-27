'use strict';

const fs = require('fs');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const { CommonHelper } = require('../helpers/commonHelper');
const { CREDENTIALS } = require('../constants'); 

const wallet = new FileSystemWallet(CREDENTIALS.DISTRIBUTOR.WALLET_PATH);

async function main(certPath, privateKeyDirPath) {
    try {
        const privateKeyPath = CommonHelper.getPrivateKeyFullPathFromDir(privateKeyDirPath);

        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privateKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(CREDENTIALS.DISTRIBUTOR.MSP_ID, certificate, privateKey);
        
        await wallet.import(CREDENTIALS.DISTRIBUTOR.ADMIN.IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding distributor creds to wallet');
        throw new Error(error);
    }
}

main(CREDENTIALS.DISTRIBUTOR.ADMIN.CERTIFICATE, CREDENTIALS.DISTRIBUTOR.ADMIN.PRIVATE_KEY)
.then(() => { console.log("Distributor credentials is successfully added to wallet"); });

module.exports.execute = main;