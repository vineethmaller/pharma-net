'use strict';

const fs = require('fs');
const path = require('path');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const CRYPTO_MATERIALS_PATH = path.resolve('../../network/crypto-config');
const wallet = new FileSystemWallet('./identity/manufacturer');

const IDENTITY_LABEL = "MANUFACTURER_ADMIN";
const MANUFACTURER_MSP_ID = "manufacturerMSP";

const MANUFACTURER_CERTIFICATE_PATH = CRYPTO_MATERIALS_PATH + '/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem';
const MANUFACTURER_PREVIATE_KEY = CRYPTO_MATERIALS_PATH + '/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/*_sk';

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(MANUFACTURER_MSP_ID, certificate, privateKey);
        
        await wallet.import(IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding manufacturer creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(MANUFACTURER_CERTIFICATE_PATH, MANUFACTURER_PREVIATE_KEY)
.then(() => { console.log("Manufacturer credentials is successfully added to wallet"); });

module.exports.execute = main;