'use strict';

const express = require('express');
const router = express.Router();

const retailerContractApi = require('../contract-apis/retailerContract');
const resourceHelper = require('../helpers/resourceHelper');

router.post('/retailDrug', (req, res) => {
    retailerContractApi.retailDrug(req.body.drug_name, req.body.serial_no, req.body.retailer_crn, req.body.customer_aadhar, req.headers.organization_role)
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

module.exports = router;