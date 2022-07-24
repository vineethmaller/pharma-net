'use strict';

const fs = require('fs');
const path = require('path');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const CRYPTO_MATERIALS_PATH = path.resolve('../../network/crypto-config');
const wallet = new FileSystemWallet('./identity/transporter');

const IDENTITY_LABEL = "TRANSPORTER_ADMIN";
const TRANSPORTER_MSP_ID = "transporterMSP";

const TRANSPORTER_CERTIFICATE_PATH = CRYPTO_MATERIALS_PATH + '/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem';
const TRANSPORTER_PREVIATE_KEY = CRYPTO_MATERIALS_PATH + '/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore/*_sk';

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(TRANSPORTER_MSP_ID, certificate, privateKey);
        
        await wallet.import(IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding transporter creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(TRANSPORTER_CERTIFICATE_PATH, TRANSPORTER_PREVIATE_KEY)
.then(() => { console.log("Transporter credentials is successfully added to wallet"); });

module.exports.execute = main;