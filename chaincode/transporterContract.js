'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('./auth');
const { Utils } = require('./utils');
const { SHIPMENT_STATUS, COMPOSITE_KEY_PREFIXES, ERRORS, MESSAGES } = require('./constants');

const CONTRACT_NAME = 'pharmanet.transportercontract';
const CONTRACT_INSTANTIATE_MESSAGE = 'Pharmanet Transporter Smart Contract Instantiated';

class TransporterContract extends Contract {
	
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
	 * @param {*} buyerCRN 
	 * @param {*} drugName 
	 * @param {*} transporterCRN 
	 * @returns 
	 */
	async updateShipment(ctx, buyerCRN, drugName, transporterCRN) {
		
		//Checks if the caller has transporter role in network
		if(Auth.authorizeTransporterRole(ctx)) {
			let shipmentID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.SHIPMENT, [buyerCRN, drugName]);
			let shipmentObjectBuffer = ctx.stub.getState(shipmentID);

			let response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [buyerCRN]);

			//Checks if the buyer exists
			if(!response.done) {
				let buyerID = response.next();

				//Checks if shipment exists
				if(shipmentObjectBuffer.length !== 0) {
					let shipmentObject = Utils.bufferToJson(shipmentObjectBuffer);
					let assetList = shipmentObject.assets;

					response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [transporterCRN]);

					//Checks if the transporter exists
					if(!response.done) {
						let transporterID = response.next();

						//Checks if the transporter matches with the shipment
						if(shipmentObject.transporter === transporterID) {

							let drugList = await fetchDrugsByIDs(ctx, assetList);

							//Update state of items in shipment
							await updateDrugStateForShipmentDelivery(ctx, drugList, buyerID, shipmentID);

							//Update shipment status as delivered
							shipmentObject.status = SHIPMENT_STATUS.DELIVERED;

							await ctx.stub.putState(shipmentID, Utils.jsonToBuffer(shipmentObject));
							
							return shipmentObject;
						}
						return MESSAGES.TRANSPORTER_DOES_NOT_MATCH;
					}
					return MESSAGES.TRANSPORTER_IS_NOT_REGISTERED;
				}
				return MESSAGES.SHIPMENT_NOT_FOUND;
			}
		}
		return ERRORS.ROLE_AUTHORIZATION_ERROR;
	}

	async fetchDrugsByIDs(ctx, listOfAssets) {
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

	async updateDrugStateForShipmentDelivery(ctx, drugObjectsArray, buyerID, shipmentID) {
		for(let drugObject in drugObjectsArray) {
			let productID = drugObject.productID;
			drugObject.owner = buyerID;
			drugObject.shipment.push(shipmentID);

			await ctx.stub.putState(productID, Utils.jsonToBuffer(drugObject));
		}
	}
}

module.exports = { TransporterContract };