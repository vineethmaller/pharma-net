'use strict';

class Utils {

	/**
	* @param bufferObject Buffer object
	* @returns JSON object
	*/
	static bufferToJson(bufferObject) {
		return JSON.parse(bufferObject.toString());
	}

	/**
	* @param object JSON object
	* @returns Buffer object
	*/
	static jsonToBuffer(jsonObject) {
		return Buffer.from(JSON.stringify(jsonObject));
	}
}

module.exports = { Utils };