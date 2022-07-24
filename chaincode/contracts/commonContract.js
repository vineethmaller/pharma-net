'use strict';

const { Contract } = require('fabric-contract-api');
const { Auth } = require('../helpers/auth');
const { Utils } = require('../helpers/utils');
const { Common } = require('../helpers/common');
const { COMPOSITE_KEY_PREFIXES, ERRORS, ROLES, SHIPMENT_STATUS } = require('../constants');

const CONTRACT_NAME = 'pharmanet.commoncontract';
const CONTRACT_INSTANTIATE_MESSAGE = 'Pharmanet Common Smart Contract Instantiated';

class CommonContract extends Contract {
	
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
	 * @param {*} companyCRN 
	 * @param {*} companyName 
	 * @param {*} location 
	 * @param {*} organizationRole 
	 * @returns 
	 */
	async registerCompany(ctx, companyCRN, companyName, location, organizationRole) {
		
		//Checks if the caller has a valid role in network
		if(Auth.roleExists(ctx.mspId)) {

			//Checks if the organization role provided exists 
			//and whether it matches with the entity's network role
			if(Auth.doesOrganizationRoleMatchMSPID(ctx, organizationRole)) {

				const companyID = ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [companyCRN, companyName]);
				let companyObjectBuffer = await ctx.stub.getState(companyID);
			
				//Checks if company is already registered
				if(companyObjectBuffer.length === 0) {

					let newCompanyObject = {
						companyID : companyID,
						name : companyName,
						location : location,
						organizationRole : organizationRole,
						hierarchyKey : Auth.getRoleHierarchy(organizationRole)
					};

					await ctx.stub.putState(companyID, Utils.jsonToBuffer(newCompanyObject));

					return newCompanyObject;
				}
				throw new Error(ERRORS.COMPANY_ALREADY_REGISTERED);
			}
			throw new Error(ERRORS.ORGANIZATION_ROLE_DOES_NOT_MATCH_MSP_ID);
		}
		throw new Error(ERRORS.ROLE_AUTHORIZATION_ERROR);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} buyerCRN 
	 * @param {*} sellerCRN 
	 * @param {*} drugName 
	 * @param {*} quantity 
	 * @returns 
	 */
	async createPO(ctx, buyerCRN, sellerCRN, drugName, quantity) {
		let CALLER_ROLES = [ROLES.DISTRIBUTOR, ROLES.RETAILER];

		//Checks if the caller has distributor or retailer roles in network
		if(Auth.authorizeRole(ctx, CALLER_ROLES)) {

			let response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.PRODUCT, [drugName]);

			//Checks if the drug exists
			if(response.done) {
				return ERRORS.PRODUCT_NOT_FOUND;
			}
			
			response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [buyerCRN]);
			//Checks if the buyer is already registered
			if(!response.done) {
				let buyerID = response.next();
				let buyerObjectBuffer = await ctx.stub.getState(buyerID);
				let buyerObject = Utils.bufferToJson(buyerObjectBuffer);

				response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [sellerCRN]);
				//Checks if the seller is already registered
				if(!response.done) {
					let sellerID = response.next();
					let sellerObjectBuffer = await ctx.stub.getState(sellerID);
					let sellerObject = Utils.bufferToJson(sellerObjectBuffer);

					//Checks if the buyer-seller hierarchy is valid for purchase
					if(isValidBuyerSellerHierarchy(buyerObject, sellerObject)) {

						let purchaseOrderID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PURCHASE_ORDER, [buyerCRN, drugName]);
						
						let newPurchaseOrderObject = {
							poID : purchaseOrderID,
							drugName : drugName,
							quantity : quantity,
							buyer : buyerID,
							seller : sellerID
						};

						await ctx.stub.putState(purchaseOrderID, Utils.jsonToBuffer(newPurchaseOrderObject));

						return newPurchaseOrderObject;
					}
					throw new Error(ERRORS.INVALID_PURCHASE_ORDER);
				}
				throw new Error(ERRORS.SELLER_IS_NOT_REGISTERED);
			}
			throw new Error(ERRORS.BUYER_IS_NOT_REGISTERED);
		}
		throw new Error(ERRORS.ROLE_AUTHORIZATION_ERROR);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} buyerCRN 
	 * @param {*} drugName 
	 * @param {*} listOfAssets 
	 * @param {*} transporterCRN 
	 * @returns 
	 */
	async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN) {
		let CALLER_ROLES = [ROLES.DISTRIBUTOR, ROLES.MANUFACTURER];

		//Checks if the caller has manufacturer or distributor roles in network
		if(Auth.authorizeRole(ctx, CALLER_ROLES)) {

			let response = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [buyerCRN]);
			//Checks if the buyer is already registered
			if(!response.done) {
				
				let poID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PURCHASE_ORDER, [buyerCRN, drugName]);
				let purchaseOrderObjectBuffer = await ctx.stub.getState(poID);
				
				//Checks if purchase order exists
				if(purchaseOrderObjectBuffer.length !== 0) {

					let purchaseOrderObject = Utils.bufferToJson(purchaseOrderObjectBuffer);

					//Checks if the quantity requested in purchase order matches the count of items being shipped
					if(listOfAssets.length === purchaseOrderObject.quantity) {

						let drugObjectsArray = await fetchDrugsByIDs(ctx, listOfAssets);
						let sellerID = drugObjectsArray[0].owner;
						
						await updateDrugStateForShipmentCreation(ctx, drugObjectsArray, transporterCRN);

						let shipmentID = ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.SHIPMENT, [buyerCRN, drugName]);

						let newShipmentObject = {
							shipmentID : shipmentID,
							creator : sellerID,
							assets : listOfAssets,
							transporter : transporterCRN,
							status : SHIPMENT_STATUS.IN_TRANSIT
						}

						await ctx.stub.putState(shipmentID, Utils.jsonToBuffer(newShipmentObject));
							
						return newShipmentObject;
					} 
					throw new Error(INCORRECT_ITEM_COUNT_IN_SHIPMENT);
				}
				throw new Error(ERRORS.PURCHASE_ORDER_NOT_FOUND);
			}
			throw new Error(ERRORS.BUYER_IS_NOT_REGISTERED);
		}
		throw new Error(ERRORS.ROLE_AUTHORIZATION_ERROR);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugName 
	 * @param {*} serialNo 
	 * @returns 
	 */
	async viewHistory(ctx, drugName, serialNo) {
		let productID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PRODUCT, [drugName, serialNo]);
		let productObjectBuffer = await ctx.stub.getState(productID);

		if(productObjectBuffer.length !== 0) {
			let transactionArray = [];
			let response = await ctx.stub.getHistoryForKey(productID);

			while(!response.done) {
				transactionArray.push(response.next());
			}
			return transactionArray;
		}
		throw new Error(ERRORS.ASSET_NOT_FOUND);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugName 
	 * @param {*} serialNo 
	 * @returns 
	 */
	async viewDrugCurrentState(ctx, drugName, serialNo) {
		
		let productID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PRODUCT, [drugName, serialNo]);
		let productObjectBuffer = await ctx.stub.getState(productID);

		if(productObjectBuffer.length !== 0) {
			return Utils.bufferToJson(productObjectBuffer);
		}
		throw new Error(ERRORS.ASSET_NOT_FOUND);
	}

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} listOfAssets 
	 * @returns 
	 */
	async fetchDrugsByIDs(ctx, listOfAssets) {
		let drugList = [];
		for(let asset in listOfAssets) {
			let drugObjectBuffer = ctx.stub.getState(asset);

			if(drugObjectBuffer === 0) {
				throw new Error(ERRORS.ASSET_NOT_FOUND);
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
		throw new Error(ERRORS.TRANSPORTER_IS_NOT_REGISTERED);
	}
}

module.exports = { CommonContract };