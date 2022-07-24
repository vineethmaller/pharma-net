'use strict';

const express = require('express');
const router = express.Router();

const retailerContractApi = require('./contract-apis/retailerContract');

router.post('/retailDrug', (req, res) => {
    retailerContractApi.retailDrug(req.body.drugName, req.body.serialNo, req.body.retailerCRN, req.body.customerAadhar, req.headers.organizationRole)
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
            source : 'retailer contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

module.exports.router = router;