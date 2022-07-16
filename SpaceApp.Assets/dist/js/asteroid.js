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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _api_fetch_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api/fetch-api */ \"./src/js/api/fetch-api.js\");\n/* harmony import */ var _milkyway__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./milkyway */ \"./src/js/milkyway.js\");\n/* harmony import */ var _ui_functionality_tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ui-functionality/tabs */ \"./src/js/ui-functionality/tabs.js\");\n﻿\r\n\r\n\r\n//Make api call for individual asteroid and render 3d model\r\n//Table is rendered through .NET \r\n\r\nrenderAsteroid();\r\n\r\nfunction renderAsteroid() {\r\n    const mainContainer = document.querySelector(`[data-id]`);\r\n\r\n    if (mainContainer) {\r\n        const asteroidId = mainContainer.dataset.id;\r\n\r\n        if (asteroidId) {\r\n            _api_fetch_api__WEBPACK_IMPORTED_MODULE_0__[\"default\"].makeApiCall(\"Asteroid\", generateAsteroidData, { id: asteroidId }, null);\r\n        }\r\n    }\r\n}\r\n\r\nfunction generateAsteroidData(asteroid) {\r\n    if (asteroid) {\r\n        generateSpaceModel(asteroid);\r\n        renderDetailsTableMarkup(asteroid);\r\n    }\r\n}\r\n\r\nfunction generateSpaceModel(asteroid) {\r\n    // Init object to main container\r\n    const viz = new Spacekit.Simulation(document.getElementById('main-container'), {\r\n        basePath: 'https://typpo.github.io/spacekit/src',\r\n    });\r\n\r\n    // Create a background \r\n    viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);\r\n\r\n    (0,_milkyway__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(viz);\r\n\r\n\r\n    const label = asteroid.name ? asteroid.name : '';\r\n\r\n    viz.createObject('spaceman', {\r\n        labelText: label,\r\n        ephem: new Spacekit.Ephem({\r\n            // These parameters define orbit shape.\r\n            a: .758624972466197, //semi_major_axis\r\n            e: .3586130156934444, //eccentricity\r\n            i: 33.43752567920985, //inclination\r\n\r\n            // These parameters define the orientation of the orbit.\r\n            om: 281.8812466845817, //ascending_node_longitude\r\n            w: 201.4705339910219, //perihelion_argument\r\n            ma: 26.53022026723202,\r\n\r\n            // Where the object is in its orbit.\r\n            epoch: 2459600.5,\r\n        }, 'deg'),\r\n    });\r\n}\r\n\r\nfunction renderDetailsTableMarkup(asteroid) {\r\n    const asteroidDetails = document.querySelector('#asteroid-details');\r\n    if (asteroidDetails) {\r\n        const tabs = generateTabs();\r\n        const tables = generateTables(asteroid);\r\n\r\n        const markup = `\r\n            <ul class=\"nav nav-tabs mb-3\">\r\n                ${tabs}\r\n            </ul>\r\n            <div class=\"tab-content\">\r\n                ${tables}\r\n            </div>\r\n        `;\r\n\r\n        asteroidDetails.insertAdjacentHTML(\"beforeend\", markup);\r\n        (0,_ui_functionality_tabs__WEBPACK_IMPORTED_MODULE_2__[\"default\"])();\r\n    }\r\n}\r\n\r\nfunction generateTabs() {\r\n    return `\r\n        <li class=\"nav-item\">\r\n            <a data-tabs-source=\"orbit-parameters\" class=\"nav-link active\">\r\n                <i class=\"mdi mdi-home-variant d-lg-none d-block mr-1\"></i>\r\n                <span class=\"d-none d-lg-block\">Orbit Parameters</span>\r\n            </a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n            <a data-tabs-source=\"physical-parameters\" class=\"nav-link\">\r\n                <i class=\"mdi mdi-account-circle d-lg-none d-block mr-1\"></i>\r\n                <span class=\"d-none d-lg-block\">Physical Parameters</span>\r\n            </a>\r\n        </li>\r\n        <li class=\"nav-item\">\r\n            <a data-tabs-source=\"close-approach-data\" class=\"nav-link\">\r\n                <i class=\"mdi mdi-account-circle d-lg-none d-block mr-1\"></i>\r\n                <span class=\"d-none d-lg-block\">Close Approach Data</span>\r\n            </a>\r\n        </li>\r\n    `;\r\n}\r\n\r\nfunction generateTables(asteroid) {\r\n    let markup = '';\r\n    const orbitalData = asteroid[\"orbital_data\"] ? asteroid[\"orbital_data\"] : null;\r\n\r\n    if (orbitalData) {\r\n        markup += generateOrbitParamTable(orbitalData);\r\n    }\r\n\r\n    const absoluteMagnitudeH = asteroid[\"absolute_magnitude_h\"] ? asteroid[\"absolute_magnitude_h\"] : null;\r\n    const estimatedDiameter = asteroid[\"estimated_diameter\"] ? asteroid[\"estimated_diameter\"] : null;\r\n\r\n    if (absoluteMagnitudeH && estimatedDiameter) {\r\n        markup += generatePhysicalParamsTable({ 'absolute_magnitude_h': absoluteMagnitudeH, 'estimated_diameter': estimatedDiameter })\r\n    }\r\n\r\n    const closeApproachData = asteroid[\"close_approach_data\"] ? asteroid[\"close_approach_data\"] : null;\r\n\r\n    if (closeApproachData) {\r\n        markup += generateCloseApproachTable(closeApproachData);\r\n    }\r\n\r\n    return markup;\r\n}\r\n\r\nfunction generateOrbitParamTable(orbitalData) {\r\n    let markup = '';\r\n\r\n    const eccentricity = orbitalData[\"eccentricity\"];\r\n    const semiMajorAxis = orbitalData[\"semi_major_axis\"];\r\n    const perihelionDistance = orbitalData[\"perihelion_distance\"];\r\n    const inclination = orbitalData[\"inclination\"];\r\n    const ascendingNodeLongitude = orbitalData[\"ascending_node_longitude\"];\r\n    const meanAnomaly = orbitalData[\"mean_anomaly\"];\r\n    const perihelionTime = orbitalData[\"perihelion_time\"];\r\n    const orbitalPeriod = orbitalData[\"orbital_period\"];\r\n    const meanMotion = orbitalData[\"mean_motion\"];\r\n    const aphelionDistance = orbitalData[\"aphelion_distance\"];\r\n\r\n    markup += `\r\n        <div class=\"tab-pane active\" data-tabs-target=\"orbit-parameters\">\r\n            <table class=\"table mb-0\">\r\n                <thead>\r\n                    <tr>\r\n                        <th class=\"border-top-0\" scope=\"col\">Element</th>\r\n                        <th class=\"border-top-0\" scope=\"col\">Value</th>\r\n                    </tr>\r\n                </thead>\r\n                <tbody>\r\n                    <tr>\r\n                        <th scope=\"row\">Eccentricity</th>\r\n                        <td>${eccentricity}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Semi-major axis</th>\r\n                        <td>${semiMajorAxis}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Perihelion distance</th>\r\n                        <td>${perihelionDistance}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Inclination</th>\r\n                        <td>${inclination}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Ascending node longitude</th>\r\n                        <td>${ascendingNodeLongitude}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Mean anomaly</th>\r\n                        <td>${meanAnomaly}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Time of perihelion passage</th>\r\n                        <td>${perihelionTime}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Sidereal orbital period</th>\r\n                        <td>${orbitalPeriod}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Mean motion</th>\r\n                        <td>${meanMotion}</td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th scope=\"row\">Aphelion distance</th>\r\n                        <td>${aphelionDistance}</td>\r\n                    </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n        `;\r\n\r\n    return markup;\r\n}\r\n\r\nfunction generatePhysicalParamsTable(physicalData) {\r\n    let markup = '';\r\n\r\n    const absoluteMagnitudeH = physicalData[\"absolute_magnitude_h\"];\r\n    const esimatedDiameter = physicalData[\"estimated_diameter\"];\r\n    const estimatedDiameterMinKm = esimatedDiameter?.kilometers?.estimated_diameter_min;\r\n    const estimatedDiameterMaxKm = esimatedDiameter?.kilometers?.estimated_diameter_max;\r\n    const estimatedDiameterMinMeters = esimatedDiameter?.meters?.estimated_diameter_min;\r\n    const estimatedDiameterMaxMeters = esimatedDiameter?.meters?.estimated_diameter_max;\r\n    const estimatedDiameterMinMiles = esimatedDiameter?.miles?.estimated_diameter_min;\r\n    const estimatedDiameterMaxMiles = esimatedDiameter?.miles?.estimated_diameter_max;\r\n    const estimatedDiameterMinFeet = esimatedDiameter?.feet?.estimated_diameter_min;\r\n    const estimatedDiameterMaxFeet = esimatedDiameter?.feet?.estimated_diameter_max;\r\n\r\n    markup += `\r\n    <div class=\"tab-pane\" data-tabs-target=\"physical-parameters\">\r\n        <table class=\"table mb-0\">\r\n            <thead>\r\n                <tr>\r\n                    <th class=\"border-top-0\" scope=\"col\">Element</th>\r\n                    <th class=\"border-top-0\" scope=\"col\">Value</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n            <tr>\r\n               <th scope=\"row\">Absolute Magnitude [H]</th>\r\n               <td>${absoluteMagnitudeH}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Min (Km)</th>\r\n               <td>${estimatedDiameterMinKm}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Min (Km)</th>\r\n               <td>${estimatedDiameterMaxKm}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Min (M)</th>\r\n               <td>${estimatedDiameterMinMeters}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Max (M)</th>\r\n               <td>${estimatedDiameterMaxMeters}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Min (Mi)</th>\r\n               <td>${estimatedDiameterMinMiles}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Max (Mi)</th>\r\n               <td>${estimatedDiameterMaxMiles}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Min (Ft)</th>\r\n               <td>${estimatedDiameterMinFeet}</td>\r\n            </tr>\r\n            <tr>\r\n               <th scope=\"row\">Estimated Diameter Max (Ft)</th>\r\n               <td>${estimatedDiameterMaxFeet}</td>\r\n            </tr>\r\n         </tbody>\r\n        </table>\r\n    </div>\r\n    `;\r\n\r\n    return markup;\r\n}\r\n\r\nfunction generateCloseApproachTable(closeApproachData) {\r\n    let markup = '';\r\n\r\n    const rows = generateCloseApproachTableRows(closeApproachData);\r\n\r\n    markup += `\r\n    <div class=\"tab-pane\" data-tabs-target=\"close-approach-data\">\r\n        <table class=\"table mb-0\">\r\n            <thead>\r\n                <tr>\r\n                    <th class=\"border-top-0\" scope=\"col\">Close Approach Date</th>\r\n                    <th class=\"border-top-0\" scope=\"col\">Relative Velocity (Km/s)</th>\r\n                    <th class=\"border-top-0\" scope=\"col\">Miss Distance (Km)</th>\r\n                    <th class=\"border-top-0\" scope=\"col\">Orbiting Body</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody>\r\n            ${rows}\r\n         </tbody>\r\n        </table>\r\n    </div>\r\n    `;\r\n\r\n    return markup;\r\n}\r\n\r\nfunction generateCloseApproachTableRows(closeApproachData) {\r\n    let markup = '';\r\n\r\n    closeApproachData.forEach(item => {\r\n        const closeApproachDate = item[\"close_approach_date\"];\r\n        const velocityKm = item[\"relative_velocity\"]?.[\"kilometers_per_second\"];\r\n        const missDistanceKm = item[\"miss_distance\"]?.[\"kilometers\"];\r\n        const orbitingBody = item[\"orbiting_body\"];\r\n\r\n        markup += `\r\n            <tr>\r\n                <td>${closeApproachDate}</td>\r\n                <td>${velocityKm}</td>\r\n                <td>${missDistanceKm}</td>\r\n                <td>${orbitingBody}</td>\r\n            </tr>\r\n        `;\r\n    })\r\n\r\n    return markup;\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/asteroid.js?");

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