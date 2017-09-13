import {CommonProtocolDriver} from './CommonProtocolDriver.js'

export class CreditcardsTokenizerDriver {
	constructor({port}) {
		this.driver = new CommonProtocolDriver({port})
	}
	start() {
		this.driver.start()
	}
	stop() {
		this.driver.stop()
	}
	reset() {
		this.driver.reset()
	}
	addRule({resource, request, response, delay, useRawResponse}) {
		this.driver.addRule({resource, request, response, delay, useRawResponse})
	}
}
