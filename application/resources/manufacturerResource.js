'use strict';

const express = require('express');
const router = express.Router();

const manufacturerContractApi = require('../contract-apis/manufacturerContract');

router.post('/addDrug', (req, res) => {
    manufacturerContractApi.addDrug(req.body.drugName, req.body.serialNo, req.body.manufacturedDate, req.body.expiryDate, req.body.companyCRN, req.headers.organizationRole)
    .then((result) => {
        const responseBody = {
            status : 'success',
            drug : result 
        };

        res.json(responseBody);
    })
    .catch((error) => {
        const responseBody = {
            status : 'error',
            source : 'manufacturer contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

module.exports = router;