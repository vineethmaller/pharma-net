'use strict';

const { Utils } = require('./utils');
const { COMPOSITE_KEY_PREFIXES, MESSAGES, HIERARCHY_LEVELS } = require('../constants');

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

	/**
	 * 
	 * @param {*} drugObjectIterator 
	 * @param {*} sellerKey 
	 * @param {*} quantity 
	 * @returns 
	 */
	static getListOfValidDrugs(ctx, listOfAssets, quantity) {
		let validDrugList = [];

		if(listOfAssets.length === quantity) {
			validDrugList = fetchDrugsByIDs(ctx, listOfAssets);
		}

		return validDrugList;
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} listOfAssets 
	 * @returns 
	 */
	static fetchDrugsByIDs(ctx, listOfAssets) {
		let drugList = [];
		for(let asset in listOfAssets) {
			let drugObjectBuffer = ctx.stub.getState(asset);

			if(drugObjectBuffer === 0) {
				return MESSAGES.ASSET_NOT_FOUND;
			}

			let drugObject = Utils.bufferToJson(drugObjectBuffer);
			drugList.push(drugObject);
		}
		return drugList;
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugObjectsArray 
	 * @param {*} transporterCRN 
	 * @returns 
	 */
	static updateDrugStateForShipmentCreation(ctx, drugObjectsArray, transporterCRN) {

		let response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [transporterCRN]);

		if(!response.done) {
			let transporterID = response.next();

			for(let drugObject in drugObjectsArray) {
				let productID = drugObject.productID;
				drugObject.owner = transporterID;

				await ctx.stub.putState(productID, Utils.jsonToBuffer(drugObject));
			}
			return;
		}
		throw new Error(MESSAGES.TRANSPORTER_IS_NOT_REGISTERED);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugObjectsArray 
	 * @param {*} buyerID 
	 * @param {*} shipmentID 
	 */
	static updateDrugStateForShipmentDelivery(ctx, drugObjectsArray, buyerID, shipmentID) {
		for(let drugObject in drugObjectsArray) {
			let productID = drugObject.productID;
			drugObject.owner = buyerID;
			drugObject.shipment.push(shipmentID);

			await ctx.stub.putState(productID, Utils.jsonToBuffer(drugObject));
		}
	}

}

module.exports = { Common }