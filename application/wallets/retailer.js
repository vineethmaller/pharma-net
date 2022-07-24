'use strict';

const fs = require('fs');
const path = require('path');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const CRYPTO_MATERIALS_PATH = path.resolve('../../network/crypto-config');
const wallet = new FileSystemWallet('./identity/retailer');

const IDENTITY_LABEL = "RETAILER_ADMIN";
const RETAILER_MSP_ID = "retailerMSP";

const RETAILER_CERTIFICATE_PATH = CRYPTO_MATERIALS_PATH + '/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem';
const RETAILER_PREVIATE_KEY = CRYPTO_MATERIALS_PATH + '/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore/*_sk';

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(RETAILER_MSP_ID, certificate, privateKey);
        
        await wallet.import(IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding retailer creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(RETAILER_CERTIFICATE_PATH, RETAILER_PREVIATE_KEY)
.then(() => { console.log("Retailer credentials is successfully added to wallet"); });

module.exports.execute = main;