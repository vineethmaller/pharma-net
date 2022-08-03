'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('../helpers/auth');
const { Utils } = require('../helpers/utils');
const { SHIPMENT_STATUS, COMPOSITE_KEY_PREFIXES, ERRORS } = require('../constants');

const CONTRACT_NAME = 'pharmanet.transportercontract';
const CONTRACT_INSTANTIATE_MESSAGE = 'Pharmanet Transporter Smart Contract Instantiated';

class TransporterContract extends Contract {
	
	constructor() {
		super(CONTRACT_NAME);
		this.authorize = new Auth();
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
	 * @param {*} buyerCRN 
	 * @param {*} drugName 
	 * @param {*} transporterCRN 
	 * @returns 
	 */
	async updateShipment(ctx, buyerCRN, drugName, transporterCRN) {
		
		//Checks if the caller has transporter role in network
		if(Auth.authorizeTransporterRole(ctx)) {
			let shipmentID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.SHIPMENT, [buyerCRN, drugName]);
			let shipmentObjectBuffer = await ctx.stub.getState(shipmentID);

			let buyerIterator = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [buyerCRN]);
			let buyer = await buyerIterator.next();
			await buyerIterator.close();

			//Checks if the buyer exists
			if(!buyer.value) {
				throw new Error(ERRORS.BUYER_IS_NOT_REGISTERED);
			}
			
			let buyerID = buyer.value.key;

			//Checks if shipment exists
			if(shipmentObjectBuffer.length === 0) {
				throw new Error(ERRORS.SHIPMENT_NOT_FOUND);
			}
			
			let shipmentObject = Utils.bufferToJson(shipmentObjectBuffer);
			let assetList = shipmentObject.assets;

			let transporterIterator = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [transporterCRN]);
			let transporter = await transporterIterator.next();
			await transporterIterator.close();

			//Checks if the transporter exists
			if(!transporter.value) {
				throw new Error(ERRORS.TRANSPORTER_IS_NOT_REGISTERED);
			}
			
			let transporterID = transporter.value.key;

			//Checks if the transporter matches with the shipment
			if(shipmentObject.transporter !== transporterID) {
				throw new Error(ERRORS.TRANSPORTER_DOES_NOT_MATCH);
			}

			let drugList = await this.fetchDrugsByIDs(ctx, assetList);

			//Update state of items in shipment
			await this.updateDrugStateForShipmentDelivery(ctx, drugList, buyerID, shipmentID);

			//Update shipment status as delivered
			shipmentObject.status = SHIPMENT_STATUS.DELIVERED;

			await ctx.stub.putState(shipmentID, Utils.jsonToBuffer(shipmentObject));
							
			return shipmentObject;
		}
		throw new Error(ERRORS.ROLE_AUTHORIZATION_ERROR);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugObjectsArray 
	 * @param {*} buyerID 
	 * @param {*} shipmentID 
	 */
	async updateDrugStateForShipmentDelivery(ctx, drugObjectsArray, buyerID, shipmentID) {
		for(let i=0; i<drugObjectsArray.length; i++) {
			let productID = drugObjectsArray[i].productID;
			drugObjectsArray[i].owner = buyerID;
			drugObjectsArray[i].shipment.push(shipmentID);

			await ctx.stub.putState(productID, Utils.jsonToBuffer(drugObjectsArray[i]));
		}
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} listOfAssets 
	 * @returns 
	 */
	async fetchDrugsByIDs(ctx, listOfAssets) {
		let drugList = [];
		let drugObjectBuffer;
		for(let i =0; i < listOfAssets.length; i++) {
			try {
				drugObjectBuffer = await ctx.stub.getState(listOfAssets[i]);

				if(drugObjectBuffer.length === 0) {
					throw new Error(ERRORS.DRUG_NOT_FOUND + " Asset: " + listOfAssets[i]);
				}
			
				let drugObject = Utils.bufferToJson(drugObjectBuffer);
				drugList.push(drugObject);
			} catch(error) {
				throw new Error(error);
			}
		}
		return drugList;
	}	
}

module.exports = TransporterContract;