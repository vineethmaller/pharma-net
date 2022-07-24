'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('../helpers/auth');
const { Utils } = require('../helpers/utils');
const { Common } = require('../helpers/common');
const { SHIPMENT_STATUS, COMPOSITE_KEY_PREFIXES, ERRORS, MESSAGES } = require('../constants');

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

							let drugList = Common.fetchDrugsByIDs(ctx, assetList);

							//Update state of items in shipment
							await Common.updateDrugStateForShipmentDelivery(ctx, drugList, buyerID, shipmentID);

							//Update shipment status as delivered
							shipmentObject.status = SHIPMENT_STATUS.DELIVERED;

							await ctx.stub.putState(shipmentID, Utils.jsonToBuffer(shipmentObject));
							
							return shipmentObject;
						}
						throw new Error(MESSAGES.TRANSPORTER_DOES_NOT_MATCH);
					}
					throw new Error(MESSAGES.TRANSPORTER_IS_NOT_REGISTERED);
				}
				throw new Error(MESSAGES.SHIPMENT_NOT_FOUND);
			}
			throw new Error(MESSAGES.BUYER_IS_NOT_REGISTERED);
		}
		throw new Error(ERRORS.ROLE_AUTHORIZATION_ERROR);
	}
}

module.exports = { TransporterContract };