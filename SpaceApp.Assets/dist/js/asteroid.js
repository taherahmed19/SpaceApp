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

/***/ "./src/js/api/api-endpoints.js":
/*!*************************************!*\
  !*** ./src/js/api/api-endpoints.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"applicationEndpoints\": () => (/* binding */ applicationEndpoints)\n/* harmony export */ });\n﻿const applicationEndpoints = {\r\n    IssTles: () => {\r\n        return {\r\n            method: 'GET',\r\n            resource: `http://spaceappapi-local.co.uk/api/space/GetISSTles`,\r\n            params: {},\r\n            accept: \"application/json\",\r\n            contentType: null,\r\n            body: null,\r\n        }\r\n    },\r\n    IssLocation: () => {\r\n        return {\r\n            method: 'GET',\r\n            resource: `http://spaceappapi-local.co.uk/api/space/GetISS`,\r\n            params: {},\r\n            accept: \"application/json\",\r\n            contentType: null,\r\n            body: null,\r\n        }\r\n    },\r\n    NearEarthObjects: () => {\r\n        return {\r\n            method: 'GET',\r\n            resource: `http://spaceappapi-local.co.uk/api/space/GetNearEarthObjects`,\r\n            params: {},\r\n            accept: \"application/json\",\r\n            contentType: null,\r\n            body: null,\r\n        }\r\n    },\r\n    Asteroid: (params, body) => {\r\n        return {\r\n            method: 'GET',\r\n            resource: `http://spaceappapi-local.co.uk/api/space/GetAsteroid`,\r\n            params: params ? params : null,\r\n            accept: \"application/json\",\r\n            contentType: null,\r\n            body: body ? body : null,\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/api/api-endpoints.js?");

/***/ }),

/***/ "./src/js/api/fetch-api.js":
/*!*********************************!*\
  !*** ./src/js/api/fetch-api.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _api_endpoints__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-endpoints */ \"./src/js/api/api-endpoints.js\");\n﻿\r\n\r\nclass Api {\r\n    constructor() {\r\n        this.endpoints = _api_endpoints__WEBPACK_IMPORTED_MODULE_0__.applicationEndpoints;\r\n    }\r\n\r\n    makeApiCall(method = \"\", callback, params = {}, body = {}) {\r\n        const endpoint = this.endpoints[method];\r\n        if (endpoint) {\r\n            const apiCall = endpoint(params, body);\r\n            return this.request(apiCall, callback);\r\n        }\r\n    };\r\n\r\n    async request(endpoint = {}, callback = () => { }) {\r\n        try {\r\n            if (endpoint) {\r\n                let url = `${endpoint.resource}${endpoint.method == \"GET\" && endpoint.params ? '?' + (new URLSearchParams(endpoint.params)).toString() : ''}`;\r\n\r\n                fetch(url, {\r\n                    'method': endpoint.method,\r\n                    'body': endpoint.body ? JSON.stringify(endpoint.body) : null,\r\n                    'accept': endpoint.accept,\r\n                    'content-type': endpoint.contentType ? endpoint.contentType : null,\r\n                }).then(async (response) => {\r\n                    const data = await response.json();\r\n                    callback(data);\r\n                    return data;\r\n                }).catch((error) => {\r\n                    return error;\r\n                });\r\n            }\r\n        } catch (error) {\r\n            console.error(error)\r\n            return error;\r\n        }\r\n    };\r\n}\r\n\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Api());\n\n//# sourceURL=webpack://asp.net/./src/js/api/fetch-api.js?");

/***/ }),

/***/ "./src/js/asteroid.js":
/*!****************************!*\
  !*** ./src/js/asteroid.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _api_fetch_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api/fetch-api */ \"./src/js/api/fetch-api.js\");\n/* harmony import */ var _milkyway__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./milkyway */ \"./src/js/milkyway.js\");\n/* harmony import */ var _data_asteroid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./data/asteroid */ \"./src/js/data/asteroid.js\");\n/* harmony import */ var _ui_functionality_tabs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ui-functionality/tabs */ \"./src/js/ui-functionality/tabs.js\");\n﻿\r\n\r\n\r\n\r\n//Make api call for individual asteroid and render 3d model\r\n//Table is rendered through .NET \r\n\r\nrenderAsteroid();\r\n\r\nfunction renderAsteroid() {\r\n    const mainContainer = document.querySelector(`[data-id]`);\r\n\r\n    if (mainContainer) {\r\n        const asteroidId = mainContainer.dataset.id;\r\n\r\n        if (asteroidId) {\r\n            _api_fetch_api__WEBPACK_IMPORTED_MODULE_0__[\"default\"].makeApiCall(\"Asteroid\", generateAsteroidData, { id: asteroidId }, null);\r\n        }\r\n    }\r\n}\r\n\r\nfunction generateAsteroidData(asteroid) {\r\n    if (asteroid) {\r\n        generateSpaceModel(asteroid);\r\n        appendApiDateToObject(asteroid);\r\n        renderDetailsTableMarkup();\r\n    }\r\n}\r\n\r\nfunction generateSpaceModel(asteroid) {\r\n    // Init object to main container\r\n    const viz = new Spacekit.Simulation(document.getElementById('main-container'), {\r\n        basePath: 'https://typpo.github.io/spacekit/src',\r\n    });\r\n\r\n    // Create a background \r\n    viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);\r\n\r\n    (0,_milkyway__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(viz);\r\n\r\n\r\n    const label = asteroid.name ? asteroid.name : '';\r\n\r\n    viz.createObject('spaceman', {\r\n        labelText: label,\r\n        ephem: new Spacekit.Ephem({\r\n            // These parameters define orbit shape.\r\n            a: .758624972466197, //semi_major_axis\r\n            e: .3586130156934444, //eccentricity\r\n            i: 33.43752567920985, //inclination\r\n\r\n            // These parameters define the orientation of the orbit.\r\n            om: 281.8812466845817, //ascending_node_longitude\r\n            w: 201.4705339910219, //perihelion_argument\r\n            ma: 26.53022026723202,\r\n\r\n            // Where the object is in its orbit.\r\n            epoch: 2459600.5,\r\n        }, 'deg'),\r\n    });\r\n}\r\n\r\nfunction appendApiDateToObject(asteroid) {\r\n    const orbitalData = asteroid[\"orbital_data\"] ? asteroid[\"orbital_data\"] : null;\r\n\r\n    if (orbitalData) {\r\n        const eccentricity = orbitalData[\"eccentricity\"];\r\n        const semiMajorAxis = orbitalData[\"semi_major_axis\"];\r\n        const perihelionDistance = orbitalData[\"perihelion_distance\"];\r\n        const inclination = orbitalData[\"inclination\"];\r\n        const ascendingNodeLongitude = orbitalData[\"ascending_node_longitude\"];\r\n        const meanAnomaly = orbitalData[\"mean_anomaly\"];\r\n        const perihelionTime = orbitalData[\"perihelion_time\"];\r\n        const orbitalPeriod = orbitalData[\"orbital_period\"];\r\n        const aphelionDistance = orbitalData[\"aphelion_distance\"];\r\n\r\n        let orbitParameters = _data_asteroid__WEBPACK_IMPORTED_MODULE_2__.asteroidTableData.find(item => { return item.name == \"Orbit Parameters\" });\r\n\r\n        orbitParameters.rows[0][\"eccentricity\"].value = eccentricity;\r\n        orbitParameters.rows[1][\"semiMajorAxis\"].value = semiMajorAxis;\r\n        orbitParameters.rows[2][\"perihelionDistance\"].value = perihelionDistance;\r\n        orbitParameters.rows[3][\"inclination\"].value = inclination;\r\n        orbitParameters.rows[4][\"ascendingNodeLongitude\"].value = ascendingNodeLongitude;\r\n        orbitParameters.rows[5][\"meanAnomaly\"].value = meanAnomaly;\r\n        orbitParameters.rows[6][\"timeOfPerihelionPassage\"].value = perihelionTime;\r\n        orbitParameters.rows[7][\"siderealOrbitalPeriod\"].value = orbitalPeriod;\r\n        orbitParameters.rows[8][\"meanMotion\"].value = eccentricity;\r\n        orbitParameters.rows[9][\"aphelionDistance\"].value = aphelionDistance;\r\n    }\r\n\r\n    const absoluteMagnitudeH = asteroid[\"absolute_magnitude_h\"] ? asteroid[\"absolute_magnitude_h\"] : null;\r\n    const estimatedDiameter = asteroid[\"estimated_diameter\"] ? asteroid[\"estimated_diameter\"] : null;\r\n\r\n    if (absoluteMagnitudeH && estimatedDiameter) {\r\n        const estimatedDiameterMinKm = estimatedDiameter.kilometers?.estimated_diameter_min;\r\n        const estimatedDiameterMaxKm = estimatedDiameter.kilometers?.estimated_diameter_max;\r\n        const estimatedDiameterMinMeters = estimatedDiameter.meters?.estimated_diameter_min;\r\n        const estimatedDiameterMaxMeters = estimatedDiameter.meters?.estimated_diameter_max;\r\n        const estimatedDiameterMinMiles = estimatedDiameter.miles?.estimated_diameter_min;\r\n        const estimatedDiameterMaxMiles = estimatedDiameter.miles?.estimated_diameter_max;\r\n        const estimatedDiameterMinFeet = estimatedDiameter.feet?.estimated_diameter_min;\r\n        const estimatedDiameterMaxFeet = estimatedDiameter.feet?.estimated_diameter_max;\r\n\r\n        let physicalParameters = _data_asteroid__WEBPACK_IMPORTED_MODULE_2__.asteroidTableData.find(item => { return item.name == \"Physical Parameters\" });\r\n\r\n        physicalParameters.rows[0][\"absoluteMagnitudeH\"].value = absoluteMagnitudeH;\r\n        physicalParameters.rows[1][\"estimatedDiameterMinKm\"].value = estimatedDiameterMinKm;\r\n        physicalParameters.rows[2][\"estimatedDiameterMaxKm\"].value = estimatedDiameterMaxKm;\r\n        physicalParameters.rows[3][\"estimatedDiameterMinMeters\"].value = estimatedDiameterMinMeters;\r\n        physicalParameters.rows[4][\"estimatedDiameterMaxMeters\"].value = estimatedDiameterMaxMeters;\r\n        physicalParameters.rows[5][\"estimatedDiameterMinMiles\"].value = estimatedDiameterMinMiles;\r\n        physicalParameters.rows[6][\"estimatedDiameterMaxMiles\"].value = estimatedDiameterMaxMiles;\r\n        physicalParameters.rows[7][\"estimatedDiameterMinFeet\"].value = estimatedDiameterMinFeet;\r\n        physicalParameters.rows[8][\"estimatedDiameterMaxFeet\"].value = estimatedDiameterMaxFeet;\r\n\r\n    }\r\n}\r\n\r\nfunction renderDetailsTableMarkup() {\r\n    const asteroidDetails = document.querySelector('#asteroid-details');\r\n    if (asteroidDetails) {\r\n        const tabHeaderMarkup = generateTabs()\r\n        const tableRows = generateTables();\r\n\r\n        const markup = `\r\n            <ul class=\"nav nav-tabs mb-3\">\r\n                ${tabHeaderMarkup}\r\n            </ul>\r\n            <div class=\"tab-content\">\r\n                ${tableRows}\r\n            </div>\r\n        `;\r\n\r\n        asteroidDetails.insertAdjacentHTML(\"beforeend\", markup);\r\n        (0,_ui_functionality_tabs__WEBPACK_IMPORTED_MODULE_3__[\"default\"])();\r\n    }\r\n}\r\n\r\nfunction generateTabs() {\r\n    let markup = '';\r\n\r\n    if (_data_asteroid__WEBPACK_IMPORTED_MODULE_2__.asteroidTableData) {\r\n        _data_asteroid__WEBPACK_IMPORTED_MODULE_2__.asteroidTableData.forEach((asteroidItem, index) => {\r\n            if (asteroidItem.name) {\r\n                markup += `\r\n                    <li class=\"nav-item\">\r\n                        <a data-tabs-source=\"${asteroidItem.name.replaceAll(' ', '-').toLowerCase()}\" class=\"nav-link ${index == 0 ? 'active' : ''}\">\r\n                            <i class=\"mdi mdi-home-variant d-lg-none d-block mr-1\"></i>\r\n                            <span class=\"d-none d-lg-block\">${asteroidItem.name}</span>\r\n                        </a>\r\n                    </li>\r\n                    `;\r\n            }\r\n        })\r\n    }\r\n\r\n    return markup;\r\n}\r\n\r\nfunction generateTables() {\r\n    let markup = '';\r\n\r\n    _data_asteroid__WEBPACK_IMPORTED_MODULE_2__.asteroidTableData.forEach((item, index) => {\r\n        const tableRowHeaders = generateTableRowHeaders(item.headers);\r\n        const tableRows = generateTableRows(item.rows);\r\n\r\n        markup += `\r\n        <div class=\"tab-pane ${index == 0 ? 'active' : ''}\" data-tabs-target=\"${item.name.replaceAll(' ', '-').toLowerCase()}\">\r\n            <table class=\"table mb-0\">\r\n                <thead>\r\n                    <tr>\r\n                        ${tableRowHeaders}\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    ${tableRows}\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n        `\r\n    });\r\n\r\n    return markup;\r\n}\r\n\r\nfunction generateTableRowHeaders(headers) {\r\n    let markup = ``;\r\n\r\n    headers.forEach(header => {\r\n        markup += `\r\n            <th class=\"border-top-0\" scope=\"col\">${header}</th>\r\n        `\r\n    });\r\n\r\n    return markup;\r\n}\r\n\r\nfunction generateTableRows(rows) {\r\n    let markup = ``;\r\n\r\n    rows.forEach(row => {\r\n        for (var key in row) {\r\n            const value = row[key].value;\r\n            const label = row[key].label;\r\n\r\n            if (value && label) {\r\n                markup += `<tr>\r\n                    <th scope=\"row\">${label}</th>\r\n                    <td>${value}</td>\r\n                </tr>\r\n                `;\r\n            }\r\n        }\r\n    });\r\n\r\n    return markup;\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/asteroid.js?");

/***/ }),

/***/ "./src/js/data/asteroid.js":
/*!*********************************!*\
  !*** ./src/js/data/asteroid.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"asteroidTableData\": () => (/* binding */ asteroidTableData)\n/* harmony export */ });\n﻿const asteroidTableData = [\r\n    {\r\n        name: 'Orbit Parameters',\r\n        headers: [\r\n            'Element',\r\n            'Value',\r\n        ],\r\n        rows: [\r\n            {\r\n                'eccentricity': {\r\n                    label: 'Eccentricity',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'semiMajorAxis': {\r\n                    label: 'Semi-Major Axis',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'perihelionDistance': {\r\n                    label: 'Perihelion Distance',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'inclination': {\r\n                    label: 'Inclination',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'ascendingNodeLongitude': {\r\n                    label: 'Ascending Node Longitude',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'meanAnomaly': {\r\n                    label: 'Mean Anomaly',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'timeOfPerihelionPassage': {\r\n                    label: 'Time Of Perihelion Passage',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'siderealOrbitalPeriod': {\r\n                    label: 'Side Real Orbital Period',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'meanMotion': {\r\n                    label: 'Mean Motion',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'aphelionDistance': {\r\n                    label: 'Aphelion Distance',\r\n                    value: ''\r\n                }\r\n            },\r\n        ]\r\n    },\r\n    {\r\n        name: 'Physical Parameters',\r\n        headers: [\r\n            'Element',\r\n            'Value',\r\n        ],\r\n        rows: [\r\n            {\r\n                'absoluteMagnitudeH': {\r\n                    label: 'Absolute Magnitude [H]',\r\n                    value: ''\r\n                }\r\n            },\r\n            {\r\n                'estimatedDiameterMinKm': {\r\n                    label: 'Estimated Diameter Min (Km)',\r\n                    value: ''\r\n                },\r\n            },\r\n            {\r\n                'estimatedDiameterMaxKm': {\r\n                    label: 'Estimated Diameter Min (Km)',\r\n                    value: ''\r\n                },\r\n            },\r\n            {\r\n                'estimatedDiameterMinMeters': {\r\n                    label: 'Estimated Diameter Min (M)',\r\n                    value: ''\r\n                },\r\n            },\r\n            {\r\n                'estimatedDiameterMaxMeters': {\r\n                    label: 'Estimated Diameter Max (M)',\r\n                    value: ''\r\n                },\r\n            },\r\n            {\r\n                'estimatedDiameterMinMiles': {\r\n                    label: 'Estimated Diameter Min (Mi)',\r\n                    value: ''\r\n                },\r\n            },\r\n            {\r\n                'estimatedDiameterMaxMiles': {\r\n                    label: 'Estimated Diameter Max (Mi)',\r\n                    value: ''\r\n                },\r\n            },\r\n            {\r\n                'estimatedDiameterMinFeet': {\r\n                    label: 'Estimated Diameter Min (Ft)',\r\n                    value: ''\r\n                },\r\n            },\r\n            {\r\n                'estimatedDiameterMaxFeet': {\r\n                    label: 'Estimated Diameter Max (Ft)',\r\n                    value: ''\r\n                },\r\n            },\r\n        ]\r\n    },\r\n    {\r\n        name: 'Close Approach Data',\r\n        headers: [\r\n            'Element3',\r\n            'Value3',\r\n            'Value4',\r\n        ],\r\n        rows: []\r\n    },\r\n];\n\n//# sourceURL=webpack://asp.net/./src/js/data/asteroid.js?");

/***/ }),

/***/ "./src/js/milkyway.js":
/*!****************************!*\
  !*** ./src/js/milkyway.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ addSolarSystemObjects)\n/* harmony export */ });\n﻿function addSolarSystemObjects(viz) {\r\n    // Create our first object - the sun - using a preset space object.\r\n    viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);\r\n\r\n    // Then add some planets\r\n    viz.createObject('mercury', Spacekit.SpaceObjectPresets.MERCURY);\r\n    viz.createObject('venus', Spacekit.SpaceObjectPresets.VENUS);\r\n    viz.createObject('earth', Spacekit.SpaceObjectPresets.EARTH);\r\n    viz.createObject('mars', Spacekit.SpaceObjectPresets.MARS);\r\n    viz.createObject('jupiter', Spacekit.SpaceObjectPresets.JUPITER);\r\n    viz.createObject('saturn', Spacekit.SpaceObjectPresets.SATURN);\r\n    viz.createObject('uranus', Spacekit.SpaceObjectPresets.URANUS);\r\n    viz.createObject('neptune', Spacekit.SpaceObjectPresets.NEPTUNE);\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/milkyway.js?");

/***/ }),

/***/ "./src/js/ui-functionality/tabs.js":
/*!*****************************************!*\
  !*** ./src/js/ui-functionality/tabs.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ addTabsEventListeners)\n/* harmony export */ });\n﻿function addTabsEventListeners() {\r\n    const tabs = document.querySelectorAll('[data-tabs-source]');\r\n    const tabPanes = document.querySelectorAll('[data-tabs-target]');\r\n    \r\n    if (tabs && tabPanes) {\r\n        tabs.forEach(tab => {\r\n            tab.addEventListener(\"click\", () => {\r\n                const tabId = tab.getAttribute(\"data-tabs-source\");\r\n                const itemToShow = tabId && document.querySelector(`[data-tabs-target='${tabId}']`);\r\n    \r\n                if (itemToShow) {\r\n                    tabs.forEach(tab => { tab.classList.remove('active') });\r\n                    tab.classList.add('active');\r\n    \r\n                    tabPanes.forEach(tabPane => { tabPane.classList.remove('active') });\r\n                    itemToShow.classList.add('active');\r\n                }\r\n            })\r\n        })\r\n    }\r\n}\r\n\r\naddTabsEventListeners();\n\n//# sourceURL=webpack://asp.net/./src/js/ui-functionality/tabs.js?");

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
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/asteroid.js");
/******/ 	
/******/ })()
;