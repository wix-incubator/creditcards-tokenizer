"use strict"

import Q from "q"

export class CommonProtocolClient {
	constructor({XMLHttpRequest, endpointUrl, timeout}) {
		this.XMLHttpRequest = XMLHttpRequest
		this.endpointUrl = endpointUrl
		this.timeout = timeout || 0
	}
	doRequest(resource, request) {
		let deferred = Q.defer()
		
		let xhr = new this.XMLHttpRequest()
		xhr.ontimeout = function() {
			deferred.reject({
				code: "timeout",
				description: "request timed out"
			})
		}
		xhr.onload = function() {
			let response = JSON.parse(xhr.responseText)
			if (response.error) {
				deferred.reject(response.error)
			} else {
				deferred.resolve(response.value)
			}
		}
		
		xhr.open("POST", this.endpointUrl + resource, true)
		xhr.timeout = this.timeout
		xhr.setRequestHeader("Content-Type", "application/json")
		xhr.send(JSON.stringify(request))

		return deferred.promise
	}
}