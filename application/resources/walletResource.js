'use strict';

const express = require('express');
const router = express.Router();

const addToWalletManufacturer = require('../wallets/manufacturer');
const addToWalletDistributor = require('../wallets/distributor');
const addToWalletRetailer = require('../wallets/retailer');
const addToWalletConsumer = require('../wallets/consumer');
const addToWalletTransporter = require('../wallets/transporter');

const resourceHelper = require('../helpers/resourceHelper');

router.post('/add/manufacturer', (req, res) => {
    addToWalletManufacturer.execute(req.body.certificate_path, req.body.privatekey_dirpath)
    .then(() => {
        const responseBody = {
            status : 'success',
            message : 'Manufacturer credential is added to wallet'
        };
        res.send(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/add/distributor', (req, res) => {
    addToWalletDistributor.execute(req.body.certificate_path, req.body.privatekey_dirpath)
    .then(() => {
        const responseBody = {
            status : 'success',
            message : 'Distributor credential is added to wallet'
        };
        res.send(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/add/retailer', (req, res) => {
    addToWalletRetailer.execute(req.body.certificate_path, req.body.privatekey_dirpath)
    .then(() => {
        const responseBody = {
            status : 'success',
            message : 'Retailer credential is added to wallet'
        };
        res.send(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/add/consumer', (req, res) => {
    addToWalletConsumer.execute(req.body.certificate_path, req.body.privatekey_dirpath)
    .then(() => {
        const responseBody = {
            status : 'success',
            message : 'Consumer credential is added to wallet'
        };
        res.send(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

router.post('/add/transporter', (req, res) => {
    addToWalletTransporter.execute(req.body.certificate_path, req.body.privatekey_dirpath)
    .then(() => {
        const responseBody = {
            status : 'success',
            message : 'Transporter credential is added to wallet'
        };
        res.send(responseBody);
    })
    .catch((error) => {
        let responseBody = resourceHelper.getErrorResponseObject(req, error);
        res.status(500).send(responseBody);
    });
});

module.exports = router;