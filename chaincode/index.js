'use strict';

const commonContract = require('./contracts/commonContract');
const manufacturerContract = require('./contracts/manufacturerContract');
const retailerContract = require('./contracts/retailerContract');
const transporterContract = require('./contracts/transporterContract');

module.exports.commonContract = commonContract;
module.exports.manufacturerContract = manufacturerContract;
module.exports.retailerContract = retailerContract;
module.exports.transporterContract = transporterContract;

module.exports.contracts = [ commonContract, manufacturerContract, retailerContract, transporterContract ];