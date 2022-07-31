'use strict';

const cors = require('cors');
const express = require('express');
const app = express();

const walletResourceRouter = require('./resources/walletResource');
const commonResourceRouter = require('./resources/commonResource');
const manufacturerResourceRouter = require('./resources/manufacturerResource');
const retailerResourceRouter = require('./resources/retailerResource');
const transporterResourceRouter = require('./resources/transporterResource');

const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.set('title', 'Pharma Network API');

app.use('/wallet', walletResourceRouter);
app.use('/common', commonResourceRouter);
app.use('/manufacturer', manufacturerResourceRouter);
app.use('/retailer', retailerResourceRouter);
app.use('/transporter', transporterResourceRouter);

//Healthcheck
app.get('/health', (req, res) => res.send('Application is working'));

app.get('/kill', (req, res) => process.exit());

app.listen(PORT, () => console.log(`Pharma network API is up and listening on port ${PORT} @ ` + (new Date()).toLocaleString()));