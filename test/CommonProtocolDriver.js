'use strict'

import http from 'http'
import _ from 'lodash'

export class CommonProtocolDriver {
	constructor({port}) {
		this._server = http.createServer(this._handler.bind(this))
		this._port = port
		this.reset()
	}
	start() {
		this._server.listen(this._port, '127.0.0.1')
	}
	stop() {
		this._server.close()
	}
	reset() {
		this._rules = {}
	}
	addRule({resource, request, response, delay, useRawResponse}) {
		delay = delay || 0
		let resourceRules = this._rules[resource]
		if (!resourceRules) {
			resourceRules = []
			this._rules[resource] = resourceRules
		}
		resourceRules.push({request, response, delay, useRawResponse})
	}
	_handler(req, res) {
		let This = this
		let body = ''
		req.on('data', (data) => {
            body += data
        })
        req.on('end', () => {
			let request = JSON.parse(body)
			let rule = _.find(this._rules[req.url], (rule) => {
				return _.isEqual(rule.request, request)
			})
			
			if (rule) {
				_.delay(() => {
					res.writeHead(200, {'Content-Type': rule.useRawResponse ? 'text/html' : 'application/json'})
					res.end(rule.useRawResponse ? rule.response : JSON.stringify(rule.response))
				}, rule.delay)
			} else {
				res.writeHead(404)
				res.end()
			}
        })	
	}
}
