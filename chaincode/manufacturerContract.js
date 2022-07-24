'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('./auth');
const { Utils } = require('./utils');
const { COMPOSITE_KEY_PREFIXES, MESSAGES, ERRORS } = require('./constants');

const CONTRACT_NAME = 'pharmanet.manufacturercontract';
const CONTRACT_INSTANTIATE_MESSAGE = 'Pharmanet Manufacturer Smart Contract Instantiated';

class ManufacturerContract extends Contract {
	
	constructor() {
		super(CONTRACT_NAME);
	}
	
	/**
	 * 
	 * @param {*} _ctx 
	 */
	async instantiate(_ctx) {
		console.log(CONTRACT_INSTANTIATE_MESSAGE);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugName 
	 * @param {*} serialNo 
	 * @param {*} manufacturedDate 
	 * @param {*} expiryDate 
	 * @param {*} companyCRN 
	 * @returns 
	 */
	async addDrug(ctx, drugName, serialNo, manufacturedDate, expiryDate, companyCRN) {
		
		//Checks if the caller has manufacturer role in network
		if(Auth.authorizeManufacturerRole(ctx)) {
			
			let response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [companyCRN]);

			//Checks if the manufacturer is already registered
			if(!response.done) {
				let companyID = response.next();

				response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.PRODUCT, [serialNo]);

				//Checks if the serial number is already used
				if(response.done) {

					let manufacturedDateObject = new Date(manufacturedDate);
					if(!isValidManufacturedDate(manufacturedDateObject)) {
						return MESSAGES.INVALID_MANUFACTURED_DATE;
					}

					let expiryDateObject = new Date(expiryDate);
					if(!isValidExpiryDate(expiryDateObject)) {
						return MESSAGES.INVALID_EXPIRY_DATE;
					}

					let productID = ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PRODUCT, [drugName, serialNo]);

					let newDrugObject = {
						productID : productID,
						name : drugName,
						manufacturer : companyID,
						manufacturingDate : new Date(manufacturedDate),
						expiryDate : new Date(expiryDate),
						owner : companyID,
						shipment : []
					}

					await ctx.stub.putState(productID, Utils.jsonToBuffer(newDrugObject));

					return newDrugObject;
				}
				return MESSAGES.SERIAL_NO_IS_ALREADY_USED;
			}
			return MESSAGES.COMPANY_IS_NOT_REGISTERED;
		}
		return ERRORS.ROLE_AUTHORIZATION_ERROR;
	}

	static isValidManufacturedDate(manufacturedDate) {
		let currentDate = new Date();
		return manufacturedDate <= currentDate;
	}

	static isValidExpiryDate(expiryDate) {
		let currentDate = new Date();
		return expiryDate >= currentDate;
	}
}

module.exports = { ManufacturerContract };