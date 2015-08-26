"use strict"

import {CreditcardsTokenizer} from "../src/CreditcardsTokenizer.js"
import {CreditcardsTokenizerDriver} from "./CreditcardsTokenizerDriver.js"
import {expect, assert} from "chai"
import {XMLHttpRequest} from "xmlhttprequest"


describe("CreditcardsTokenizer", function() {
	let tokenizerServicePort = 10000
	let driver = new CreditcardsTokenizerDriver({
		port: tokenizerServicePort
	})
	
	let tokenizer = new CreditcardsTokenizer({
		XMLHttpRequest: XMLHttpRequest,
		endpointUrl: "http://localhost:" + tokenizerServicePort + "/"
	})
	
	let validCard = {
		number: "4580458045804580",
		expiration: {
			year: 2020,
			month: 12
		}
	}
	let invalidCard = {
		number: "4580458045804581",
		expiration: {
			year: 2020,
			month: 12
		}
	}
	let intransitToken = {
		token: "580a3a7b-ec10-45f7-8997-d1d1f84cd754",
		creditCard: {
			lastDigits: "4580",
			expiration: {
				year: 2020,
				month: 12
			},
			network: "visa"
		}
	}
	let validPermanentToken = {
		token: "12345678-90ab-cdef-1234-567890abcdef",
		creditCard: {
			lastDigits: "4580",
			expiration: {
				year: 2020,
				month: 12
			},
			network: "visa"
		}
	}
	let invalidPermanentToken = {
		token: "12345678-90ab-cdef-1234-567890abcdef",
		creditCard: {
			lastDigits: "4580",
			expiration: {
				year: 2020,
				month: 12
			},
			network: "visa"
		}
	}
	let additionalFields = {
		csc: "123",
		publicFields: {
			holderId: "1234567890",
			holderName: "Chuck Norris",
			billingAddress: "123 main st",
			billingPostalCode: "90210"
		}
	}
	let intransitTokenWithAdditionalFields = {
		token: "580a3ccc-87ad-66f1-6255-e1d1f84cd754",
		creditCard: {
			lastDigits: "4580",
			expiration: {
				year: 2020,
				month: 12
			},
			network: "visa",
			additionalFields: {
				publicFields: additionalFields.publicFields
			}
		}
	}
	
	before(function() {
		driver.start()
	})
	
	after(function() {
		driver.stop()
	})
	
	beforeEach(function() {
		driver.reset()
	})
	
	describe("tokenize", function() {
		it ('creates in-transit tokens from valid cards', function() {
			driver.addRule({
				resource: "/tokenize",
				request: {
					card: validCard
				},
				response: {
					value: intransitToken
				}
			})
			
			return tokenizer.tokenize({
				card: validCard
			}).then(function(intransitToken) {
				expect(intransitToken.token).to.not.be.empty
				expect(intransitToken.creditCard.lastDigits).to.be.equal(validCard.number.slice(-4))
				expect(intransitToken.creditCard.expiration).to.deep.equal(validCard.expiration)
				expect(intransitToken.creditCard.network).to.be.equal("visa")
				expect(intransitToken.creditCard.additionalFields).to.not.exist
			}, function(error) {
				assert.ok(false, "Tokenizing a valid card returned " + JSON.stringify(error))
			})
		})
		
		it ('gracefully fails to create in-transit tokens from invalid cards', function() {
			driver.addRule({
				resource: "/tokenize",
				request: {
					card: invalidCard
				},
				response: {
					error: {
						code: "someCode",
						description: "someDescription"
					}
				}
			})
			
			return tokenizer.tokenize({
				card: invalidCard
			}).then(function(intransitToken) {
				// Unexpected success
				assert.ok(false, "Tokenizing an invalid card returned " + JSON.stringify(intransitToken))
			}, function(error) {
				expect(error.code).to.not.be.empty
				expect(error.description).to.not.be.empty
			})
		})
	})
	
	describe("intransit", function() {
		it ('creates in-transit tokens from valid permanent tokens', function() {
			driver.addRule({
				resource: "/intransit",
				request: {
					permanentToken: validPermanentToken,
					additionalFields: additionalFields
				},
				response: {
					value: intransitTokenWithAdditionalFields
				}
			})
			
			return tokenizer.intransit({
				permanentToken: validPermanentToken,
				additionalFields: additionalFields
			}).then(function(intransitToken) {
				expect(intransitToken.token).to.not.be.empty
				expect(intransitToken.creditCard.lastDigits).to.be.equal(validPermanentToken.creditCard.lastDigits)
				expect(intransitToken.creditCard.expiration).to.deep.equal(validPermanentToken.creditCard.expiration)
				expect(intransitToken.creditCard.network).to.be.equal(validPermanentToken.creditCard.network)
				expect(intransitToken.creditCard.additionalFields).to.exist
				expect(intransitToken.creditCard.additionalFields.csc).to.not.exist
				expect(intransitToken.creditCard.additionalFields.publicFields).to.deep.equal(additionalFields.publicFields)
			}, function(error) {
				assert.ok(false, "Tokenizing a valid card returned " + JSON.stringify(error))
			})
			
		})
		
		it ('gracefully fails to create in-transit tokens from invalid permanent tokens', function() {
			driver.addRule({
				resource: "/intransit",
				request: {
					permanentToken: invalidPermanentToken,
					additionalFields: additionalFields
				},
				response: {
					error: {
						code: "someCode",
						description: "someDescription"
					}
				}
			})
			
			return tokenizer.intransit({
				permanentToken: invalidPermanentToken,
				additionalFields: additionalFields
			}).then(function(intransitToken) {
				// Unexpected success
				assert.ok(false, "Tokenizing an invalid permanent token returned " + JSON.stringify(intransitToken))
			}, function(error) {
				expect(error.code).to.not.be.empty
				expect(error.description).to.not.be.empty
			})
		})
	})
})
