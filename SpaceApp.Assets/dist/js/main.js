/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/css/main.scss":
/*!***************************!*\
  !*** ./src/css/main.scss ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (__webpack_require__.p + \"/css/main.css\");\n\n//# sourceURL=webpack://asp.net/./src/css/main.scss?");

/***/ }),

/***/ "./src/js/api/api-endpoints.js":
/*!*************************************!*\
  !*** ./src/js/api/api-endpoints.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"applicationEndpoints\": () => (/* binding */ applicationEndpoints)\n/* harmony export */ });\n﻿const applicationEndpoints = {\r\n    IssTles: () => {\r\n        return {\r\n            method: 'GET',\r\n            resource: `http://spaceappapi-local.co.uk/api/space/GetISSTles`,\r\n            params: {},\r\n            accept: \"application/json\",\r\n            contentType: null,\r\n            body: null,\r\n        }\r\n    },\r\n    IssLocation: () => {\r\n        return {\r\n            method: 'GET',\r\n            resource: `http://spaceappapi-local.co.uk/api/space/GetISS`,\r\n            params: {},\r\n            accept: \"application/json\",\r\n            contentType: null,\r\n            body: null,\r\n        }\r\n    },\r\n    NearEarthObjects: () => {\r\n        return {\r\n            method: 'GET',\r\n            resource: `http://spaceappapi-local.co.uk/api/space/GetNearEarthObjects`,\r\n            params: {},\r\n            accept: \"application/json\",\r\n            contentType: null,\r\n            body: null,\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/api/api-endpoints.js?");

/***/ }),

/***/ "./src/js/api/fetch-api.js":
/*!*********************************!*\
  !*** ./src/js/api/fetch-api.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _api_endpoints__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-endpoints */ \"./src/js/api/api-endpoints.js\");\n﻿\r\n\r\nclass Api {\r\n    constructor() {\r\n        this.endpoints = _api_endpoints__WEBPACK_IMPORTED_MODULE_0__.applicationEndpoints;\r\n    }\r\n\r\n    makeApiCall(method = \"\", callback) {\r\n        const endpoint = this.endpoints[method];\r\n        if (endpoint) {\r\n            const apiCall = endpoint();\r\n            return this.request(apiCall, callback);\r\n        }\r\n    };\r\n\r\n    async request(endpoint = {}, callback = () => { }) {\r\n        try {\r\n            const response = await fetch(endpoint.resource, {\r\n                'method': endpoint?.method,\r\n                'body': endpoint?.body ? JSON.stringify(endpoint.body) : null,\r\n                'accept': endpoint.accept,\r\n                'content-type': endpoint.contentType ? endpoint.contentType : null,\r\n            });\r\n            \r\n            const data = await response.json();\r\n\r\n            callback(data);\r\n            \r\n            return await data;\r\n        } catch (error) {\r\n            console.error(error)\r\n            return error;\r\n        }\r\n    };\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Api());\n\n//# sourceURL=webpack://asp.net/./src/js/api/fetch-api.js?");

/***/ }),

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _earth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./earth */ \"./src/js/earth.js\");\n/* harmony import */ var _api_fetch_api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./api/fetch-api */ \"./src/js/api/fetch-api.js\");\n﻿\r\n\r\n\r\n_api_fetch_api__WEBPACK_IMPORTED_MODULE_1__[\"default\"].makeApiCall(\"IssTles\", _earth__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n\n//# sourceURL=webpack://asp.net/./src/js/app.js?");

/***/ }),

/***/ "./src/js/earth.js":
/*!*************************!*\
  !*** ./src/js/earth.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ renderEarthViewer)\n/* harmony export */ });\n﻿const heightBuffer = 1000;\r\n\r\nfunction renderEarthViewer(data) {\r\n    // Initialize the Cesium viewer.\r\n    const viewer = new Cesium.Viewer('cesiumContainer', {\r\n        imageryProvider: new Cesium.TileMapServiceImageryProvider({\r\n            url: Cesium.buildModuleUrl(\"Assets/Textures/NaturalEarthII\"),\r\n        }),\r\n        baseLayerPicker: true, geocoder: false, homeButton: true, infoBox: false,\r\n        navigationHelpButton: true, sceneModePicker: true, fullscreenButton: false\r\n    });\r\n\r\n    viewer.scene.globe.enableLighting = true;\r\n    //Hide UI elements \r\n    viewer.animation.container.style.visibility = 'hidden';\r\n    viewer.timeline.container.style.visibility = 'hidden';\r\n    viewer.forceResize();\r\n\r\n    var position = getPosition(data.line1.trim(), data.line2.trim())\r\n    var pointPosition = new Cesium.Cartesian3.fromRadians(\r\n        position.longitude, position.latitude, position.height * heightBuffer\r\n    );\r\n\r\n    // Visualize the satellite at this location with a red dot.\r\n    const point = viewer.entities.add({\r\n        position: pointPosition,\r\n        point: { pixelSize: 10, color: Cesium.Color.RED }\r\n    });\r\n\r\n    viewer.camera.setView({\r\n        destination: Cesium.Cartesian3.fromRadians(\r\n            position.longitude,\r\n            position.latitude,\r\n            Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position).height\r\n        )\r\n    });\r\n\r\n    window.setInterval(function () {\r\n        updatePosition(point, data)\r\n    }, 1000);\r\n}\r\n\r\nfunction updatePosition(currentPoint, data) {\r\n    var position = getPosition(data.line1.trim(), data.line2.trim())\r\n    var pointPosition = new Cesium.Cartesian3.fromRadians(\r\n        position.longitude, position.latitude, position.height * heightBuffer\r\n    )\r\n    currentPoint.position = pointPosition;\r\n}\r\n\r\nfunction getPosition(tleLine1, tleLine2) {\r\n    // These 2 lines are published by NORAD and allow us to predict where the ISS is at any given moment. They are regularly updated.\r\n    // Get the latest from: https://celestrak.com/satcat/tle.php?CATNR=25544.\r\n    const satrec = satellite.twoline2satrec(\r\n        tleLine1,\r\n        tleLine2\r\n    );\r\n\r\n    const positionAndVelocity = satellite.propagate(satrec, new Date());\r\n    const gmst = satellite.gstime(new Date());\r\n    const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);\r\n\r\n    return {\r\n        longitude: position.longitude,\r\n        latitude: position.latitude,\r\n        height: position.height,\r\n    }\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/earth.js?");

/***/ }),

/***/ "./src/js/main.js":
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.js */ \"./src/js/app.js\");\n\n\n//# sourceURL=webpack://asp.net/./src/js/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	__webpack_require__("./src/css/main.scss");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/main.js");
/******/ 	
/******/ })()
;