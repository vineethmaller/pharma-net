'use strict';

const express = require('express');
const router = express.Router();

const manufacturerContractApi = require('../contract-apis/manufacturerContract');

router.post('/addDrug', (req, res) => {
    manufacturerContractApi.addDrug(req.body.drug_name, req.body.serial_no, req.body.manufactured_date, req.body.expiry_date, req.body.company_crn, req.headers.organization_role)
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