'use strict'

import {CreditcardsTokenizer} from '../src/CreditcardsTokenizer.js'
import {CreditcardsTokenizerDriver} from './CreditcardsTokenizerDriver.js'
import {expect, assert} from 'chai'
import {XMLHttpRequest} from 'xhr2'

describe('CreditcardsTokenizer', () => {
	let tokenizerServicePort = 10000
	let driver = new CreditcardsTokenizerDriver({
		port: tokenizerServicePort
	})
	let endpointUrl = `http://localhost:${tokenizerServicePort}/`
	let invalidEndpointUrl = 'http://thisisanonexistentdomain.thisdoesntexist/'
	
	let tokenizer = new CreditcardsTokenizer({XMLHttpRequest, endpointUrl})
	
	let card = {
		number: '4580458045804580',
		expiration: {
			year: 2020,
			month: 12
		}
	}
	let intransitToken = {
		token: '580a3a7b-ec10-45f7-8997-d1d1f84cd754',
		creditCard: {
			lastDigits: '4580',
			expiration: {
				year: 2020,
				month: 12
			},
			network: 'visa'
		}
	}
	let permanentToken = {
		token: '12345678-90ab-cdef-1234-567890abcdef',
		creditCard: {
			lastDigits: '4580',
			expiration: {
				year: 2020,
				month: 12
			},
			network: 'visa'
		}
	}
	let additionalInfo = {
		csc: '123',
		publicFields: {
			holderId: '1234567890',
			holderName: 'Chuck Norris',
			billingAddress: '123 main st',
			billingPostalCode: '90210'
		}
	}
	let intransitTokenWithAdditionalFields = {
		token: '663a3def-276a-78fc-13ab-9db1f54c7754',
		creditCard: {
			lastDigits: '4580',
			expiration: {
				year: 2020,
				month: 12
			},
			network: 'visa',
			additionalFields: {
				publicFields: additionalInfo.publicFields
			}
		}
	}
	
	let someError = {
		code: 'someCode',
		description: 'someDescription'
	}
	
	before(() => {
		driver.start()
	})
	
	after(() => {
		driver.stop()
	})
	
	beforeEach(() => {
		driver.reset()
	})
	
	describe('tokenize', () => {
		it ('creates in-transit tokens from valid cards', () => {
			driver.addRule({
				resource: '/tokenize',
				request: {card},
				response: {
					value: intransitToken
				}
			})
			
			return tokenizer.tokenize({card}).then((intransitToken) => {
				expect(intransitToken.token).to.not.be.empty
				expect(intransitToken.creditCard.lastDigits).to.be.equal(card.number.slice(-4))
				expect(intransitToken.creditCard.expiration).to.deep.equal(card.expiration)
				expect(intransitToken.creditCard.network).to.be.equal('visa')
				expect(intransitToken.creditCard.additionalFields).to.not.exist
			}, (error) => {
				assert.ok(false, `Tokenizing a valid card returned ${JSON.stringify(error)}`)
			})
		})
		
		it ('gracefully fails on invalid cards', () => {
			driver.addRule({
				resource: '/tokenize',
				request: {card},
				response: {
					error: someError
				}
			})
			
			return tokenizer.tokenize({card}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Tokenizing an invalid card returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error).to.deep.equal(someError)
			})
		})
		
		it ('gracefully fails on timeout', () => {
			let tokenizerWithTimeout = new CreditcardsTokenizer({
				XMLHttpRequest: XMLHttpRequest,
				endpointUrl: endpointUrl,
				timeout: 10
			})
			
			driver.addRule({
				resource: '/tokenize',
				request: {card},
				response: {
					value: intransitToken
				},
				delay: 100
			})
			
			return tokenizerWithTimeout.tokenize({card}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Tokenizing should have timed out, but returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error.code).to.equal('timeout')
				expect(error.description).to.not.be.empty
			})
		})
		
		it ('gracefully fails when network is down', () => {
			let tokenizerWithInvalidEndpointUrl = new CreditcardsTokenizer({
				XMLHttpRequest: XMLHttpRequest,
				endpointUrl: invalidEndpointUrl
			})
			
			return tokenizerWithInvalidEndpointUrl.tokenize({card}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Network should be down, but request returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error.code).to.equal('network_down')
				expect(error.description).to.not.be.empty
			})
		})
		
		it ('gracefully fails on protocol error', () => {
			driver.addRule({
				resource: '/tokenize',
				request: {card},
				response: '<html><head><title>Error 500</title></head></html>',
				useRawResponse: true
			})
			
			return tokenizer.tokenize({card}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Expected protocol error, but request returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error.code).to.equal('protocol')
				expect(error.description).to.not.be.empty
			})
		})
	})
	
	describe('intransit', () => {
		it ('creates in-transit tokens from valid permanent tokens', () => {
			driver.addRule({
				resource: '/intransit',
				request: {permanentToken, additionalInfo},
				response: {
					value: intransitTokenWithAdditionalFields
				}
			})
			
			return tokenizer.intransit({permanentToken, additionalInfo}).then((intransitToken) => {
				expect(intransitToken.token).to.not.be.empty
				expect(intransitToken.creditCard.lastDigits).to.be.equal(permanentToken.creditCard.lastDigits)
				expect(intransitToken.creditCard.expiration).to.deep.equal(permanentToken.creditCard.expiration)
				expect(intransitToken.creditCard.network).to.be.equal(permanentToken.creditCard.network)
				expect(intransitToken.creditCard.additionalFields).to.exist
				expect(intransitToken.creditCard.additionalFields.csc).to.not.exist
				expect(intransitToken.creditCard.additionalFields.publicFields).to.deep.equal(additionalInfo.publicFields)
			}, (error) => {
				assert.ok(false, `Tokenizing a valid card returned ${JSON.stringify(error)}`)
			})
			
		})
		
		it ('gracefully fails on invalid permanent tokens', () => {
			driver.addRule({
				resource: '/intransit',
				request: {permanentToken, additionalInfo},
				response: {
					error: someError
				}
			})
			
			return tokenizer.intransit({permanentToken, additionalInfo}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Tokenizing an invalid permanent token returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error).to.deep.equal(someError)
			})
		})
		
		it ('gracefully fails on timeout', () => {
			let tokenizerWithTimeout = new CreditcardsTokenizer({
				XMLHttpRequest: XMLHttpRequest,
				endpointUrl: endpointUrl,
				timeout: 10
			})
			
			driver.addRule({
				resource: '/intransit',
				request: {permanentToken, additionalInfo},
				response: {
					value: intransitTokenWithAdditionalFields
				},
				delay: 100
			})
			
			return tokenizerWithTimeout.intransit({permanentToken, additionalInfo}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Tokenizing a permanent token should have timed out, but returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error.code).to.equal('timeout')
				expect(error.description).to.not.be.empty
			})
		})
		
		it ('gracefully fails when network is down', () => {
			let tokenizerWithInvalidEndpointUrl = new CreditcardsTokenizer({
				XMLHttpRequest: XMLHttpRequest,
				endpointUrl: invalidEndpointUrl
			})
			
			return tokenizerWithInvalidEndpointUrl.intransit({permanentToken, additionalInfo}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Network should be down, but request returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error.code).to.equal('network_down')
				expect(error.description).to.not.be.empty
			})
		})
		
		it ('gracefully fails on protocol error', () => {
			driver.addRule({
				resource: '/intransit',
				request: {permanentToken, additionalInfo},
				response: '<html><head><title>Error 500</title></head></html>',
				useRawResponse: true
			})
			
			return tokenizer.intransit({permanentToken, additionalInfo}).then((intransitToken) => {
				// Unexpected success
				assert.ok(false, `Expected protocol error, but request returned ${JSON.stringify(intransitToken)}`)
			}, (error) => {
				expect(error.code).to.equal('protocol')
				expect(error.description).to.not.be.empty
			})
		})
	})
})
