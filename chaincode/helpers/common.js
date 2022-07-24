'use strict';

const { Utils } = require('./utils');
const { HIERARCHY_LEVELS } = require('../constants');

class Common {

	/**
	 * 
	 * @param {*} manufacturedDate 
	 * @returns 
	 */
	static isValidManufacturedDate(manufacturedDate) {
		let currentDate = new Date();
		return manufacturedDate <= currentDate;
	}

	/**
	 * 
	 * @param {*} expiryDate 
	 * @returns 
	 */
	static isValidExpiryDate(expiryDate) {
		let currentDate = new Date();
		return expiryDate >= currentDate;
	}
    
    /**
	 * 
	 * @param {*} drugObject 
	 * @returns 
	 */
	static isDrugExpired(drugObject) {
		let currentDate = new Date();
		return drugObject.expiryDate > currentDate;
	}

    /**
	 * 
	 * @param {*} buyerObject 
	 * @param {*} sellerObject 
	 * @returns 
	 */
	static isValidBuyerSellerHierarchy(buyerObject, sellerObject) {

		//Checks if buyer or seller is transporter
		if(buyerObject.hierarchyKey && sellerObject.hierarchyKey) {

			//Checks if buyer hierarchy is after seller's and no jump in hierarchy is found
			if((buyerObject.hierarchyKey - sellerObject.hierarchyKey) === 1) {

				//Checks if the buyer is not consumer
				if(buyerObject.hierarchyKey < HIERARCHY_LEVELS.LEVEL_4) {
					return true;
				}
			}
		}
		return false
	}
}

module.exports = { Common }