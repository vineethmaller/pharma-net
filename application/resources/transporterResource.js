'use strict';

const express = require('express');
const router = express.Router();

const transporterContractApi = require('../contract-apis/transporterContract');

router.post('/updateShipment', (req, res) => {
    transporterContractApi.updateShipment(req.body.buyerCRN, req.body.drugName, req.body.transporterCRN, req.headers.organizationRole)
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
            source : 'transporter contract api',
            error : error
        };
        res.status(500).send(responseBody);
    });
});

module.exports = router;