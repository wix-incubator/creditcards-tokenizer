"use strict"

export class CommonProtocolClient {
	constructor({XMLHttpRequest, endpointUrl, timeout}) {
		this.XMLHttpRequest = XMLHttpRequest
		this.endpointUrl = endpointUrl
		this.timeout = timeout || 0
	}
	doRequest(resource, request) {
		let This = this
		return new Promise(function(resolve, reject) {
			let xhr = new This.XMLHttpRequest()
			xhr.ontimeout = function() {
				reject({
					code: "timeout",
					description: "request timed out"
				})
			}
			xhr.onerror = function() {
				reject({
					code: "network_down",
					description: "network is down"
				})
			}
			xhr.onload = function() {
				try {
					let response = JSON.parse(xhr.response)
					if (response.error) {
						reject(response.error)
					} else {
						resolve(response.value)
					}
				} catch (e) {
					reject({
						code: "protocol",
						description: "unexpected response format"
					})
				}
			}
			
			xhr.open("POST", This.endpointUrl + resource, true)
			xhr.timeout = This.timeout
			xhr.setRequestHeader("Content-Type", "application/json")
			xhr.send(JSON.stringify(request))
		})
	}
}