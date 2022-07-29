'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('../helpers/auth');
const { Utils } = require('../helpers/utils');
const { Common } = require('../helpers/common');
const { COMPOSITE_KEY_PREFIXES, ERRORS } = require('../constants');

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
					if(!Common.isValidManufacturedDate(manufacturedDateObject)) {
						return ERRORS.INVALID_MANUFACTURED_DATE;
					}

					let expiryDateObject = new Date(expiryDate);
					if(!Common.isValidExpiryDate(expiryDateObject)) {
						return ERRORS.INVALID_EXPIRY_DATE;
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
				throw new Error(ERRORS.SERIAL_NO_IS_ALREADY_USED);
			}
			throw new Error(ERRORS.COMPANY_IS_NOT_REGISTERED);
		}
		throw new Error(ERRORS.ROLE_AUTHORIZATION_ERROR);
	}
}

module.exports = ManufacturerContract;