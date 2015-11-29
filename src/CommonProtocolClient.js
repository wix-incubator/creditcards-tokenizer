'use strict'

import Q from 'q'

export class CommonProtocolClient {
	constructor({XMLHttpRequest, endpointUrl, timeout}) {
		this._XMLHttpRequest = XMLHttpRequest
		this._endpointUrl = endpointUrl
		this._timeout = timeout || 0
	}
	doRequest(resource, request) {
		let deferred = Q.defer()
		
		let xhr = new this._XMLHttpRequest()
		xhr.ontimeout = () => {
			deferred.reject({
				code: 'timeout',
				description: 'request timed out'
			})
		}
		xhr.onerror = () => {
			deferred.reject({
				code: 'network_down',
				description: 'network is down'
			})
		}
		xhr.onload = () => {
			try {
				let response = JSON.parse(xhr.response)
				if (response.error) {
					deferred.reject(response.error)
				} else {
					deferred.resolve(response.value)
				}
			} catch (e) {
				deferred.reject({
					code: 'protocol',
					description: 'unexpected response format'
				})
			}
		}
		
		xhr.open('POST', `${this._endpointUrl}${resource}`, true)
		xhr.timeout = this._timeout
		xhr.setRequestHeader('Content-Type', 'application/json')
		xhr.send(JSON.stringify(request))
		
		return deferred.promise
	}
}