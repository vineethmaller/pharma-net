'use strict';

const fs = require('fs');
const path = require('path');
const { X509WalletMixin, FileSystemWallet } = require('fabric-network');

const CRYPTO_MATERIALS_PATH = path.resolve('../../network/crypto-config');
const wallet = new FileSystemWallet('./identity/distributor');

const IDENTITY_LABEL = "DISTRIBUTOR_ADMIN";
const DISTRIBUTOR_MSP_ID = "distributorMSP";

const DISTRIBUTOR_CERTIFICATE_PATH = CRYPTO_MATERIALS_PATH + '/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem';
const DISTRIBUTOR_PREVIATE_KEY = CRYPTO_MATERIALS_PATH + '/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore/*_sk';

async function main(certPath, privKeyPath) {
    try {
        const certificate = fs.readFileSync(certPath).toString();
        const privateKey = fs.readFileSync(privKeyPath).toString();

        const identity = X509WalletMixin.createIdentity(DISTRIBUTOR_MSP_ID, certificate, privateKey);
        
        await wallet.import(IDENTITY_LABEL, identity);
    } catch(error) {
        console.log('Error while adding distributor creds to wallet. Error: ${error}');
        throw new Error(error);
    }
}

main(DISTRIBUTOR_CERTIFICATE_PATH, DISTRIBUTOR_PREVIATE_KEY)
.then(() => { console.log("Distributor credentials is successfully added to wallet"); });

module.exports.execute = main;