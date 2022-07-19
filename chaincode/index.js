'use strict';

const manufacturerContract = require('./manufacturerContract.js');
const retailerContract = require('./retailerContract.js');
const transporterContract = require('./transporterContract.js');
const commonContract = require('./commonContract.js');

module.exports.manufacturerContract = manufacturerContract;
module.exports.retailerContract = retailerContract;
module.exports.transporterContract = transporterContract;
module.exports.commonContract = commonContract;

module.exports.contracts = [manufacturerContract, retailerContract, transporterContract, commonContract];