module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _srcCreditcardsTokenizerJs = __webpack_require__(1);\n\nexports.CreditcardsTokenizer = _srcCreditcardsTokenizerJs.CreditcardsTokenizer;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./index.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./index.js?");

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar _CommonProtocolClientJs = __webpack_require__(2);\n\nvar CreditcardsTokenizer = (function () {\n\tfunction CreditcardsTokenizer(_ref) {\n\t\tvar XMLHttpRequest = _ref.XMLHttpRequest;\n\t\tvar endpointUrl = _ref.endpointUrl;\n\t\tvar timeout = _ref.timeout;\n\n\t\t_classCallCheck(this, CreditcardsTokenizer);\n\n\t\tthis.client = new _CommonProtocolClientJs.CommonProtocolClient({\n\t\t\tXMLHttpRequest: XMLHttpRequest,\n\t\t\tendpointUrl: endpointUrl || \"https://pay.wix.com/cards/\",\n\t\t\ttimeout: timeout || 0\n\t\t});\n\t}\n\n\t_createClass(CreditcardsTokenizer, [{\n\t\tkey: \"tokenize\",\n\t\tvalue: function tokenize(_ref2) {\n\t\t\tvar card = _ref2.card;\n\n\t\t\treturn this.client.doRequest(\"tokenize\", { card: card });\n\t\t}\n\t}, {\n\t\tkey: \"intransit\",\n\t\tvalue: function intransit(_ref3) {\n\t\t\tvar permanentToken = _ref3.permanentToken;\n\t\t\tvar additionalInfo = _ref3.additionalInfo;\n\n\t\t\treturn this.client.doRequest(\"intransit\", { permanentToken: permanentToken, additionalInfo: additionalInfo });\n\t\t}\n\t}]);\n\n\treturn CreditcardsTokenizer;\n})();\n\nexports.CreditcardsTokenizer = CreditcardsTokenizer;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/CreditcardsTokenizer.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/CreditcardsTokenizer.js?");

/***/ },
/* 2 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nvar CommonProtocolClient = (function () {\n\tfunction CommonProtocolClient(_ref) {\n\t\tvar XMLHttpRequest = _ref.XMLHttpRequest;\n\t\tvar endpointUrl = _ref.endpointUrl;\n\t\tvar timeout = _ref.timeout;\n\n\t\t_classCallCheck(this, CommonProtocolClient);\n\n\t\tthis.XMLHttpRequest = XMLHttpRequest;\n\t\tthis.endpointUrl = endpointUrl;\n\t\tthis.timeout = timeout || 0;\n\t}\n\n\t_createClass(CommonProtocolClient, [{\n\t\tkey: \"doRequest\",\n\t\tvalue: function doRequest(resource, request) {\n\t\t\tvar This = this;\n\t\t\treturn new Promise(function (resolve, reject) {\n\t\t\t\tvar xhr = new This.XMLHttpRequest();\n\t\t\t\txhr.ontimeout = function () {\n\t\t\t\t\treject({\n\t\t\t\t\t\tcode: \"timeout\",\n\t\t\t\t\t\tdescription: \"request timed out\"\n\t\t\t\t\t});\n\t\t\t\t};\n\t\t\t\txhr.onerror = function () {\n\t\t\t\t\treject({\n\t\t\t\t\t\tcode: \"network_down\",\n\t\t\t\t\t\tdescription: \"network is down\"\n\t\t\t\t\t});\n\t\t\t\t};\n\t\t\t\txhr.onload = function () {\n\t\t\t\t\ttry {\n\t\t\t\t\t\tvar response = JSON.parse(xhr.response);\n\t\t\t\t\t\tif (response.error) {\n\t\t\t\t\t\t\treject(response.error);\n\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\tresolve(response.value);\n\t\t\t\t\t\t}\n\t\t\t\t\t} catch (e) {\n\t\t\t\t\t\treject({\n\t\t\t\t\t\t\tcode: \"protocol\",\n\t\t\t\t\t\t\tdescription: \"unexpected response format\"\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t};\n\n\t\t\t\txhr.open(\"POST\", This.endpointUrl + resource, true);\n\t\t\t\txhr.timeout = This.timeout;\n\t\t\t\txhr.setRequestHeader(\"Content-Type\", \"application/json\");\n\t\t\t\txhr.send(JSON.stringify(request));\n\t\t\t});\n\t\t}\n\t}]);\n\n\treturn CommonProtocolClient;\n})();\n\nexports.CommonProtocolClient = CommonProtocolClient;\n\n/*****************\n ** WEBPACK FOOTER\n ** ./src/CommonProtocolClient.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///./src/CommonProtocolClient.js?");

/***/ }
/******/ ]);