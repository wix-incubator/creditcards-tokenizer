"use strict"

import {CommonProtocolClient} from "./CommonProtocolClient.js"

export class CreditcardsTokenizer {
	constructor({XMLHttpRequest, endpointUrl, timeout}) {
		this.client = new CommonProtocolClient({
			XMLHttpRequest: XMLHttpRequest,
			endpointUrl: endpointUrl || "https://pay.wix.com/cards/",
			timeout: timeout || 0
		})
	}
	tokenize({card}) {
		return this.client.doRequest("tokenize", {card})
	}
	intransit({permanentToken, additionalInfo}) {
		return this.client.doRequest("intransit", {permanentToken, additionalInfo})
	}
}
