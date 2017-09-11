'use strict'

import {CommonProtocolClient} from './CommonProtocolClient'

export class CreditcardsTokenizer {
	constructor({XMLHttpRequest, endpointUrl, timeout}) {
		this.client = new CommonProtocolClient({
			XMLHttpRequest: XMLHttpRequest,
			endpointUrl: endpointUrl || 'https://pay.wix.com/cards/',
			timeout: timeout || 0
		})
	}

    tokenize({card}, tenantId) {
        return this.client.doRequest('tokenize', {card, tenantId})
    }

    intransit({permanentToken, additionalInfo}, tenantId) {
        return this.client.doRequest('intransit', {permanentToken, additionalInfo, tenantId})
    }
}
