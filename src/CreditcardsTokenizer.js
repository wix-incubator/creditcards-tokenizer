"use strict"

import Q from "q"

export class CreditcardsTokenizer {
	constructor({XMLHttpRequest, endpointUrl}) {
		this.XMLHttpRequest = XMLHttpRequest || window.XMLHttpRequest
		this.endpointUrl = endpointUrl || "https://pay.wix.com/cards/"
	}
	tokenize({card}) {
		return this._doJsonRequest("tokenize", {card})
	}
	intransit({permanentToken, additionalFields}) {
		return this._doJsonRequest("intransit", {permanentToken, additionalFields})
	}
	_doJsonRequest(resource, request) {
		let deferred = Q.defer()
		
		let xhr = new this.XMLHttpRequest()
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				let response = JSON.parse(xhr.responseText)
				if (response.error) {
					deferred.reject(response.error)
				} else {
					deferred.resolve(response.value)
				}
			}
		}
		
		xhr.open("POST", this.endpointUrl + resource, true)
		xhr.setRequestHeader("Content-Type", "application/json")
		xhr.send(JSON.stringify(request))

		return deferred.promise
	}
}
