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

	// Deprecated. Use tokenizeNG instead
    tokenize({card}) {
		return this.client.doRequest('tokenize', {card})
	}
    tokenizeNG({card}, tenantId) {
        return this.client.doRequest('tokenizeNG', {card, tenantId})
    }

    // Deprecated. Use intransitNG instead
	intransit({permanentToken, additionalInfo}) {
		return this.client.doRequest('intransit', {permanentToken, additionalInfo})
	}
    intransitNG({permanentToken, additionalInfo}, tenantId) {
        return this.client.doRequest('intransitNG', {permanentToken, additionalInfo, tenantId})
    }
}
