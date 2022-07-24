'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('../helpers/auth');
const { Utils } = require('../helpers/utils');
const { COMPOSITE_KEY_PREFIXES, MESSAGES, ERRORS } = require('../constants');

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

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugName 
	 * @param {*} serialNo 
	 * @param {*} retailerCRN 
	 * @param {*} customerAadhar 
	 * @returns 
	 */
	async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAadhar) {

		//Checks if the caller has transporter role in network
		if(Auth.authorizeTransporterRole(ctx)) {
			let response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [retailerCRN]);

			//Checks if retailer exists
			if(!response.done) {
				let retailerID = response.next();
				let productID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PRODUCT, [drugName, serialNo]);
				let productObjectBuffer = await ctx.stub.getState(productID);

				//Checks if product exists in network
				if(productObjectBuffer.length !== 0) {
					let productObject = Utils.bufferToJson(productObjectBuffer);

					//Checks if retailer owns the product
					if(productObject.owner === retailerID) {
						productObject.owner = customerAadhar;

						await ctx.stub.putState(productID, Utils.jsonToBuffer(productObject));

						return productObject;
					}
					return MESSAGES.RETAILER_DOES_NOT_MATCH;
				}
				return MESSAGES.PRODUCT_NOT_FOUND;
			}
			return MESSAGES.RETAILER_IS_NOT_REGISTERED;
		}
		return ERRORS.ROLE_AUTHORIZATION_ERROR;
	}
}

module.exports = { RetailerContract };