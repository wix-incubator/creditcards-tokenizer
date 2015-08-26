"use strict"

import http from "http"
import _ from "lodash"

export class CreditcardsTokenizerDriver {
	constructor({port}) {
		this.server = http.createServer(this._handler.bind(this))
		this.port = port
		this.reset()
	}
	start() {
		this.server.listen(this.port, "127.0.0.1")
	}
	stop() {
		this.server.close()
	}
	reset() {
		this.rules = {}
	}
	addRule({resource, request, response}) {
		let resourceRules = this.rules[resource]
		if (!resourceRules) {
			resourceRules = []
			this.rules[resource] = resourceRules
		}
		resourceRules.push({request, response})
	}
	_handler(req, res) {
		let This = this
		let body = ""
		req.on('data', function (data) {
            body += data
        })
        req.on('end', function () {
			let request = JSON.parse(body)
			let rule = _.find(This.rules[req.url], function(rule) {
				return _.isEqual(rule.request, request)
			})
			
			if (rule) {
				res.writeHead(200, {'Content-Type': 'applicationjson'})
				res.end(JSON.stringify(rule.response))
			} else {
				res.writeHead(404)
				res.end()
			}
        })	
	}
}
