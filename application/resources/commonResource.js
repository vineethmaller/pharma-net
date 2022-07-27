'use strict';

const express = require('express');
const router = express.Router();

const commonContractApi = require('../contract-apis/commonContract');
const resourceHelper = require('../helpers/resourceHelper');

router.post('/registerCompany', (req, res) => {
    commonContractApi.registerCompany(req.body.company_crn, req.body.company_name, req.body.location, req.body.organization_role)
    .then((result) => {
        const responseBody = {
            status : 'success',
            company : result 
        };

        res.json(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/createPO', (req, res) => {
    commonContractApi.createPurchaseOrder(req.body.buyer_crn, req.body.seller_crn, req.body.drug_name, req.body.quantity, req.headers.organization_role)
    .then((result) => {
        const responseBody = {
            status : 'success',
            purchaseOrder : result
        };

        res.json(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/createShipment', (req, res) => {
    commonContractApi.createShipment(req.body.buyer_crn, req.body.drug_name, req.body.assets, req.body.transporter_crn, req.headers.organization_role)
    .then((result) => {
        const responseBody = {
            status : 'success',
            shipment : result
        }

        res.json(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/view/drug', (req, res) => {
    commonContractApi.viewDrugState(req.body.drug_name, req.body.serial_no, req.headers.organization_role)
    .then((result) => {
        const responseBody = {
            status : 'success',
            drug : result
        }

        res.json(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/view/history', (req, res) => {
    commonContractApi.viewHistory(req.body.drug_name, req.body.serial_no, req.headers.organization_role)
    .then((result) => {
        const responseBody = {
            status : 'success',
            transactions : result
        }

        res.json(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

module.exports = router;