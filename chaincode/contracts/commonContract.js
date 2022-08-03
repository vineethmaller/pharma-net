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
		if(Auth.roleExists(ctx.clientIdentity.mspId)) {

			//Checks if the organization role provided exists and whether it matches with the entity's network role
			if(!Auth.doesOrganizationRoleMatchMSPID(ctx, organizationRole)) {
				throw new Error(ERRORS.ORGANIZATION_ROLE_DOES_NOT_MATCH_MSP_ID);
			}

			const companyID = ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [companyCRN, companyName]);
			let companyObjectBuffer = await ctx.stub.getState(companyID);
			
			//Checks if company is already registered
			if(companyObjectBuffer.length !== 0) {
				throw new Error(ERRORS.COMPANY_ALREADY_REGISTERED);
			}

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

		//Checks if the caller has distributor or retailer roles in network
		if(Auth.authorizeDistributorRole(ctx) || Auth.authorizeRetailerRole(ctx)) {

			let productIterator = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.PRODUCT, [drugName]);
			let productObject = await productIterator.next();
			await productIterator.close();

			//Checks if the drug exists
			if(!productObject.value) {
				throw new Error(ERRORS.PRODUCT_NOT_FOUND);
			}
			
			let buyerIterator = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [buyerCRN]);
			let buyer = await buyerIterator.next();
			await buyerIterator.close();

			//Checks if the buyer is already registered
			if(!buyer.value) {
				throw new Error(ERRORS.BUYER_IS_NOT_REGISTERED);
			}
				
			let buyerID = buyer.value.key;
			let buyerObjectBuffer = await ctx.stub.getState(buyerID);
			let buyerObject = Utils.bufferToJson(buyerObjectBuffer);

			let sellerIterator = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [sellerCRN]);
			let seller = await sellerIterator.next();
			await sellerIterator.close();
			
			//Checks if the seller is already registered
			if(!seller.value) {
				throw new Error(ERRORS.SELLER_IS_NOT_REGISTERED);
			}
			
			let sellerID = seller.value.key;
			let sellerObjectBuffer = await ctx.stub.getState(sellerID);
			let sellerObject = Utils.bufferToJson(sellerObjectBuffer);

			//Checks if the buyer-seller hierarchy is valid for purchase
			if(!Common.isValidBuyerSellerHierarchy(buyerObject, sellerObject)) {
				throw new Error(ERRORS.INVALID_PURCHASE_ORDER);
			}

			let purchaseOrderID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PURCHASE_ORDER, [buyerCRN, drugName]);
						
			let newPurchaseOrderObject = {
				poID : purchaseOrderID,
				drugName : drugName,
				quantity : parseInt(quantity),
				buyer : buyerID,
				seller : sellerID
			};

			await ctx.stub.putState(purchaseOrderID, Utils.jsonToBuffer(newPurchaseOrderObject));

			return newPurchaseOrderObject;
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
	async createShipment(ctx, buyerCRN, drugName, listOfAssetsStr, transporterCRN) {

		//Checks if the caller has manufacturer or distributor roles in network
		if(Auth.authorizeManufacturerRole(ctx) || Auth.authorizeDistributorRole(ctx)) {

			let buyerIterator = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [buyerCRN]);
			let buyer = await buyerIterator.next();
			await buyerIterator.close();
			
			//Checks if the buyer is already registered
			if(!buyer.value) {
				throw new Error(ERRORS.BUYER_IS_NOT_REGISTERED);
			}
				
			let poID = await ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.PURCHASE_ORDER, [buyerCRN, drugName]);
			let purchaseOrderObjectBuffer = await ctx.stub.getState(poID);
				
			//Checks if purchase order exists
			if(purchaseOrderObjectBuffer.length === 0) {
				throw new Error(ERRORS.PURCHASE_ORDER_NOT_FOUND);
			}

			let purchaseOrderObject = Utils.bufferToJson(purchaseOrderObjectBuffer);
			let listOfAssets = listOfAssetsStr.split(",");

			//Checks if the quantity requested in purchase order matches the count of items being shipped
			if(listOfAssets.length !== purchaseOrderObject.quantity) {
				throw new Error(ERRORS.INCORRECT_ITEM_COUNT_IN_SHIPMENT);
			}

			let drugObjectsArray = await this.fetchDrugsByIDs(ctx, listOfAssets);
			let sellerID = drugObjectsArray[0].owner;

			console.log("No issues till here! Line 182");

			let transporterIterator = await ctx.stub.getStateByPartialCompositeKey(COMPOSITE_KEY_PREFIXES.COMPANY, [transporterCRN]);
			let transporter = await transporterIterator.next();
			await transporterIterator.close();

			console.log("No issues till here! Line 188");
	
			//Checks if transporter is already registered
			if(!transporter.value) {
				throw new Error(ERRORS.TRANSPORTER_IS_NOT_REGISTERED);
			}
							
			let transporterID = transporter.value.key;

			console.log("No issues till here! Line 197");
						
			await this.updateDrugStateForShipmentCreation(ctx, drugObjectsArray, transporterID);

			console.log("No issues till here! Line 201");

			let shipmentID = ctx.stub.createCompositeKey(COMPOSITE_KEY_PREFIXES.SHIPMENT, [buyerCRN, drugName]);

			let newShipmentObject = {
				shipmentID : shipmentID,
				creator : sellerID,
				assets : listOfAssets,
				transporter : transporterID,
				status : SHIPMENT_STATUS.IN_TRANSIT
			};

			await ctx.stub.putState(shipmentID, Utils.jsonToBuffer(newShipmentObject));

			console.log("No issues till here! Line 209");
							
			return newShipmentObject;
			
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

			let transaction = await response.next();
			while(transaction.value){
				let transactionObject = {};
				transactionObject.tx_id = transaction.value.tx_id;
				transactionObject.isDelete = transaction.value.is_delete;
				transactionObject.timestamp = new Date(parseInt(transaction.value.timestamp.seconds.low) * 1000);
				transactionObject.data = JSON.parse(transaction.value.value.toString("utf8"));

				transactionArray.push(transactionObject);
				transaction = await response.next();
			}

			return transactionArray;
		}
		throw new Error(ERRORS.DRUG_NOT_FOUND);
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

		//Checks if the drug exists
		if(productObjectBuffer.length !== 0) {
			return Utils.bufferToJson(productObjectBuffer);
		}

		throw new Error(ERRORS.DRUG_NOT_FOUND);
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
		};
		return drugList;
	}	

	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugObjectsArray 
	 * @param {*} transporterCRN 
	 * @returns 
	 */
	async updateDrugStateForShipmentCreation(ctx, drugObjectsArray, transporterID) {
		for(let i=0; i<drugObjectsArray.length; i++) {
			let productID = drugObjectsArray[i].productID;
			drugObjectsArray[i].owner = transporterID;
	
			await ctx.stub.putState(productID, Utils.jsonToBuffer(drugObjectsArray[i]));
		}
	}
}

module.exports = CommonContract;