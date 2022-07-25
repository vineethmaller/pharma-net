'use strict';

const express = require('express');
const router = express.Router();

const commonContractApi = require('../contract-apis/commonContract');

router.post('/registerCompany', (req, res) => {
    commonContractApi.registerCompany(req.body.companyCRN, req.body.companyName, req.body.location, req.body.organizationRole)
    .then((result) => {
        const responseBody = {
            status : 'success',
            company : result 
        };

        res.json(responseBody);
    })
    .catch((error) => {
        const responseBody = {
            status : 'error',
            source : 'common contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

router.post('/createPO', (req, res) => {
    commonContractApi.createPurchaseOrder(req.body.buyerCRN, req.body.sellerCRN, req.body.drugName, req.body.quantity, req.headers.organizationRole)
    .then((result) => {
        const responseBody = {
            status : 'success',
            purchaseOrder : result
        };

        res.json(responseBody);
    })
    .catch((error) => {
        const responseBody = {
            status : 'error',
            source : 'common contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

router.post('/createShipment', (req, res) => {
    commonContractApi.createShipment(req.body.buyerCRN, req.body.drugName, req.body.assets, req.body.transporterCRN, req.headers.organizationRole)
    .then((result) => {
        const responseBody = {
            status : 'success',
            shipment : result
        }

        res.json(responseBody);
    })
    .catch((error) => {
        const responseBody = {
            status : 'error',
            source : 'common contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

router.post('/view/drug', (req, res) => {
    commonContractApi.viewDrugState(req.drugName, req.body.serialNo, req.headers.organizationRole)
    .then((result) => {
        const responseBody = {
            status : 'success',
            drug : result
        }

        res.json(responseBody);
    })
    .catch((error) => {
        const responseBody = {
            status : 'error',
            source : 'common contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

router.post('/view/history', (req, res) => {
    commonContractApi.viewHistory(req.body.drugName, req.body.serialNo, req.headers.organizationRole)
    .then((result) => {
        const responseBody = {
            status : 'success',
            transactions : result
        }

        res.json(responseBody);
    })
    .catch((error) => {
        const responseBody = {
            status : 'error',
            source : 'common contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

module.exports = router;