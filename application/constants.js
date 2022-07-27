'use strict';

const PHARMA_NETWORK = {
    CHANNEL : 'pharmachannel',
    CONTRACTS : {
        COMMON_CONTRACT : {
            TYPE : 'common',
            NAME : 'pharmanet.commoncontract', 
            CONNECTION_PROFILE_PATH : '/home/node/app/connection-profiles/common.yml',
            FUNCTIONS : {
                REGISTER_COMPANY : 'registerCompany',
                CREATE_PURCHASE_ORDER : 'createPO',
                CREATE_SHIPMENT : 'createShipment',
                VIEW_HISTORY : 'viewHistory',
                VIEW_DRUG_STATE : 'viewDrugCurrentState'
            }
        },
        MANUFACTURER_CONTRACT : {
            TYPE : 'manufacturer',
            NAME : 'pharmanet.manufacturercontract', 
            CONNECTION_PROFILE_PATH : '/home/node/app/connection-profiles/manufacturer.yml',
            FUNCTIONS : {
                ADD_DRUG : 'addDrug'
            }
        },
        RETAILER_CONTRACT : {
            TYPE : 'retailer',
            NAME : 'pharmanet.retailercontract', 
            CONNECTION_PROFILE_PATH : '/home/node/app/connection-profiles/retailer.yml',
            FUNCTIONS : {
                RETAIL_DRUG : 'retailDrug'
            }
        },
        TRANSPORTER_CONTRACT : {
            TYPE : 'transporter',
            NAME : 'pharmanet.transportercontract', 
            CONNECTION_PROFILE_PATH : '/home/node/app/connection-profiles/transporter.yml',
            FUNCTIONS : {
                UPDATE_SHIPMENT : 'updateShipment'
            }
        }
    }
}

const CREDENTIALS = {
    MANUFACTURER : {
        ROLE : 'manufacturer',
        MSP_ID : 'manufacturerMSP',
        WALLET_PATH : '/home/node/app/wallets/identity/manufacturer',
        ADMIN : {
            IDENTITY_LABEL : 'MANUFACTURER_ADMIN',
            CERTIFICATE : '/home/node/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem',
            PRIVATE_KEY : '/home/node/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore'
        }
    },
    DISTRIBUTOR : {
        ROLE : 'distributor',
        MSP_ID : 'distributorMSP',
        WALLET_PATH : '/home/node/app/wallets/identity/distributor',
        ADMIN : {
            IDENTITY_LABEL : 'DISTRIBUTOR_ADMIN',
            CERTIFICATE : '/home/node/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem',
            PRIVATE_KEY : '/home/node/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore'
        }
    },
    RETAILER : {
        ROLE : 'retailer',
        MSP_ID : 'retailerMSP',
        WALLET_PATH : '/home/node/app/wallets/identity/retailer',
        ADMIN : {
            IDENTITY_LABEL : 'RETAILER_ADMIN',
            CERTIFICATE : '/home/node/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem',
            PRIVATE_KEY : '/home/node/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore'
        }
    },
    CONSUMER : {
        ROLE : 'consumer',
        MSP_ID : 'consumerMSP',
        WALLET_PATH : '/home/node/app/wallets/identity/consumer',
        ADMIN : {
            IDENTITY_LABEL : 'CONSUMER_ADMIN',
            CERTIFICATE : '/home/node/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem',
            PRIVATE_KEY : '/home/node/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore'
        }
    },
    TRANSPORTER : {
        ROLE : 'transporter',
        MSP_ID : 'transporterMSP',
        WALLET_PATH : '/home/node/app/wallets/identity/transporter',
        ADMIN : {
            IDENTITY_LABEL : 'TRANSPORTER_ADMIN',
            CERTIFICATE : '/home/node/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem',
            PRIVATE_KEY : '/home/node/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore'
        }
    }
}

module.exports = { PHARMA_NETWORK, CREDENTIALS };