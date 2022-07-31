'use strict';

const express = require('express');
const router = express.Router();

const transporterContractApi = require('../contract-apis/transporterContract');
const resourceHelper = require('../helpers/resourceHelper');

router.post('/updateShipment', (req, res) => {
    transporterContractApi.updateShipment(req.body.buyer_crn, req.body.drug_name, req.body.transporter_crn, req.headers.organization_role)
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

module.exports = router;