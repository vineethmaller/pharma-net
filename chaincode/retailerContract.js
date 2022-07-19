'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('./auth');
const { Utils } = require('./utils');
const { USER_COMPOSITE_KEY_PREFIX, PROPERTY_CONPOSITE_KEY_PREFIX, CONTRACT_MESSAGES } = require('./constants');

const CONTRACT_NAME = 'pharmanet.retailercontract';
const CONTRACT_INSTANTIATE_MESSAGE = 'Pharmanet Retailer Smart Contract Instantiated';

class RetailerContract extends Contract {
	
	constructor() {
		super(CONTRACT_NAME);
		this.authorize = new Auth();
	}
	
	/**
	 * @param ctx
	 */
	async instantiate(_ctx) {
		console.log(CONTRACT_INSTANTIATE_MESSAGE);
	}
}