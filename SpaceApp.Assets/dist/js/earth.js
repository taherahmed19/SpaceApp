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

/***/ "./src/js/earth.js":
/*!*************************!*\
  !*** ./src/js/earth.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _api_fetch_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api/fetch-api */ \"./src/js/api/fetch-api.js\");\n/* harmony import */ var _ui_functionality_iss_space_viewer_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-functionality/iss-space-viewer-controls */ \"./src/js/ui-functionality/iss-space-viewer-controls.js\");\n﻿\r\n\r\nconst heightBuffer = 1000;\r\n\r\n_api_fetch_api__WEBPACK_IMPORTED_MODULE_0__[\"default\"].makeApiCall(\"IssTles\", renderEarthViewer);\r\n\r\n/**\r\n * \r\n * @param {*} data \r\n */\r\nfunction renderEarthViewer(data) {\r\n    // Initialize the Cesium viewer.\r\n    const viewer = new Cesium.Viewer('cesiumContainer', {\r\n        sceneMode: Cesium.SceneMode.SCENE3D,\r\n        imageryProvider: new Cesium.TileMapServiceImageryProvider({\r\n            url: Cesium.buildModuleUrl(\"Assets/Textures/NaturalEarthII\"),\r\n        }),\r\n        baseLayerPicker: false, geocoder: false, homeButton: false, infoBox: false,\r\n        navigationHelpButton: false, sceneModePicker: false, fullscreenButton: false,\r\n    });\r\n\r\n    viewer.scene.globe.enableLighting = false;\r\n    //Hide UI elements \r\n    viewer.animation.container.style.visibility = 'hidden';\r\n    viewer.timeline.container.style.visibility = 'hidden';\r\n    viewer.forceResize();\r\n\r\n    var position = getPosition(data.line1.trim(), data.line2.trim())\r\n    var pointPosition = new Cesium.Cartesian3.fromRadians(\r\n        position.longitude, position.latitude, position.height * heightBuffer\r\n    );\r\n\r\n    // Visualize the satellite at this location with a red dot.\r\n    const satellite = viewer.entities.add({\r\n        position: pointPosition,\r\n        model: {\r\n            uri: '/assets/models/ISS.glb',\r\n            minimumPixelSize: 8000,\r\n            maximumScale: 8000,\r\n        },\r\n        viewFrom: new Cesium.Cartesian3(0.0, -Cesium.Math.PI_OVER_TWO, viewer.scene.camera.position.z)\r\n    });\r\n    \r\n    viewer.camera.setView({\r\n        destination: Cesium.Cartesian3.fromRadians(\r\n            position.longitude,\r\n            position.latitude,\r\n            Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position).height\r\n        )\r\n    });\r\n\r\n    // Wait for globe to load then zoom out     \r\n    let initialized = false;\r\n    viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {\r\n        if (!initialized && viewer.scene.globe.tilesLoaded === true) {\r\n            // viewer.clock.shouldAnimate = true;\r\n            initialized = true;\r\n            //viewer.scene.camera.zoomOut(7000000);\r\n            removeLoadingSpinner()\r\n        }\r\n    });\r\n\r\n    window.setInterval(function () {\r\n        updatePosition(satellite, data)\r\n    }, 500);\r\n\r\n    //Configure controls\r\n    (0,_ui_functionality_iss_space_viewer_controls__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(viewer, satellite);\r\n}\r\n\r\n/**\r\n * \r\n * @param {*} currentPoint \r\n * @param {*} data \r\n */\r\nfunction updatePosition(currentPoint, data) {\r\n    var position = getPosition(data.line1.trim(), data.line2.trim())\r\n    var pointPosition = new Cesium.Cartesian3.fromRadians(\r\n        position.longitude, position.latitude, position.height * heightBuffer\r\n    )\r\n    currentPoint.position = pointPosition;\r\n\r\n    try {\r\n        sessionStorage.setItem(\"IssPosition\", JSON.stringify({ longitude: position.longitude, latitude: position.latitude }));\r\n    } catch (err) {\r\n        console.error(err)\r\n    }\r\n}\r\n\r\n/**\r\n * \r\n * @param {*} tleLine1 \r\n * @param {*} tleLine2 \r\n * @returns \r\n */\r\nfunction getPosition(tleLine1, tleLine2) {\r\n    // These 2 lines are published by NORAD and allow us to predict where the ISS is at any given moment. They are regularly updated.\r\n    // Get the latest from: https://celestrak.com/satcat/tle.php?CATNR=25544.\r\n    const satrec = satellite.twoline2satrec(\r\n        tleLine1,\r\n        tleLine2\r\n    );\r\n\r\n    const positionAndVelocity = satellite.propagate(satrec, new Date());\r\n    const gmst = satellite.gstime(new Date());\r\n    const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);\r\n\r\n    return {\r\n        longitude: position.longitude,\r\n        latitude: position.latitude,\r\n        height: position.height,\r\n    }\r\n}\r\n\r\n/**\r\n * \r\n */\r\nfunction removeLoadingSpinner() {\r\n    const loadingSpinner = document.querySelector(\".loading-spinner\");\r\n    const cesiumContainer = document.querySelector(\"#cesiumContainer\");\r\n\r\n    if (loadingSpinner && cesiumContainer) {\r\n        loadingSpinner.style.display = \"none\";\r\n        cesiumContainer.style.display = \"block\"\r\n    }\r\n\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/earth.js?");

/***/ }),

/***/ "./src/js/ui-functionality/iss-space-viewer-controls.js":
/*!**************************************************************!*\
  !*** ./src/js/ui-functionality/iss-space-viewer-controls.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ configureControls)\n/* harmony export */ });\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ \"./src/js/ui-functionality/utils.js\");\n﻿\r\n\r\nconst cesiumContainer = document.querySelector('#cesiumContainer');\r\n\r\nfunction configureControls(viewer, satellite) {\r\n    if (cesiumContainer && viewer) {\r\n        configureSceneModeButton(viewer)\r\n        configureFullScreenButton()\r\n        configureFollowSatelliteButton(viewer, satellite)\r\n    }\r\n}\r\n\r\nfunction configureSceneModeButton(viewer) {\r\n    const sceneModeButton = cesiumContainer.querySelector('.js-cesium-3d-globe');\r\n    const scenesPanel = cesiumContainer.querySelector('.js-cesium-scenes-panel');\r\n    const controls = cesiumContainer.querySelector('.space-viewer-controls')\r\n\r\n    if (sceneModeButton && scenesPanel && controls) {\r\n        sceneModeButton.addEventListener(\"click\", () => {\r\n            scenesPanel.classList.toggle(\"active\")\r\n            controls.style.display = \"none\";\r\n        })\r\n    }\r\n\r\n    const scenePanelCloseButton = cesiumContainer.querySelector('.space-viewer-controls__close');\r\n    const globeImages = cesiumContainer.querySelectorAll('.space-viewer-controls__icon--globe-icon');\r\n    const globe3dImage = cesiumContainer.querySelector('.space-viewer-controls__icon--3d-globe');\r\n    const globe2dImage = cesiumContainer.querySelector('.space-viewer-controls__icon--2d-globe');\r\n    const columbusViewImage = cesiumContainer.querySelector('.space-viewer-controls__icon--columbus-view');\r\n\r\n    if (scenePanelCloseButton && controls && globeImages && globe3dImage && globe2dImage && columbusViewImage) {\r\n        //configure scene panel close button\r\n        scenePanelCloseButton.addEventListener(\"click\", () => {\r\n            controls.style.display = \"flex\";\r\n            scenesPanel.classList.toggle('active');\r\n            globeImages.forEach(globeImage => { globeImage.classList.remove('active'); })\r\n\r\n            const selectedScene = cesiumContainer.querySelector('[name=\"scene-mode\"]:checked');\r\n            if (selectedScene) {\r\n                const scene = selectedScene.value;\r\n\r\n                //configure 3d globe buttons\r\n                switch (scene) {\r\n                    case '2d-globe':\r\n                        globe2dImage.classList.add('active');\r\n                        viewer.scene.mode = Cesium.SceneMode.SCENE2D;\r\n                        viewer.camera.flyHome(2)\r\n                        break;\r\n                    case 'columbus-view':\r\n                        columbusViewImage.classList.add('active');\r\n                        viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;\r\n                        viewer.camera.flyHome(2)\r\n                        break;\r\n                    default:\r\n                        globe3dImage.classList.add('active');\r\n                        viewer.scene.mode = Cesium.SceneMode.SCENE3D;\r\n\r\n                        pointCameraToSatellite(viewer)\r\n\r\n                        break;\r\n                }\r\n            }\r\n        });\r\n    }\r\n}\r\n\r\nfunction configureFullScreenButton() {\r\n    const fullscreenButton = cesiumContainer.querySelector('.js-cesium-fullscreen');\r\n    if (fullscreenButton) {\r\n        fullscreenButton.addEventListener(\"click\", () => {\r\n            (0,_utils__WEBPACK_IMPORTED_MODULE_0__.applyFullscreen)(cesiumContainer)\r\n        })\r\n    }\r\n}\r\n\r\n//js-cesium-follow-satellite\r\nfunction configureFollowSatelliteButton(viewer, satellite) {\r\n    const followSatelliteButton = cesiumContainer.querySelector('.js-cesium-follow-satellite');\r\n\r\n    if (followSatelliteButton) {\r\n        followSatelliteButton.addEventListener(\"click\", () => {\r\n            viewer.trackedEntity = satellite;\r\n        })\r\n    }\r\n}\r\n\r\nfunction pointCameraToSatellite(viewer) {\r\n    let position = null;\r\n    try {\r\n        position = JSON.parse(sessionStorage.getItem(\"IssPosition\"))\r\n    } catch (err) {\r\n        console.error(err);\r\n    }\r\n\r\n    if (position) {\r\n        viewer.camera.flyTo({\r\n            destination: Cesium.Cartesian3.fromRadians(position.longitude, position.latitude, 10000000),//set height to initial height\r\n        });\r\n    }\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/ui-functionality/iss-space-viewer-controls.js?");

/***/ }),

/***/ "./src/js/ui-functionality/utils.js":
/*!******************************************!*\
  !*** ./src/js/ui-functionality/utils.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"applyFullscreen\": () => (/* binding */ applyFullscreen)\n/* harmony export */ });\n﻿function applyFullscreen(element) {\r\n    if (document.fullscreenElement == null) {\r\n        if (element.requestFullscreen) {\r\n            element.requestFullscreen();\r\n        } else if (element.webkitRequestFullscreen) { /* Safari */\r\n        element.webkitRequestFullscreen();\r\n        }\r\n    } else {\r\n        if (document.exitFullscreen) {\r\n            document.exitFullscreen();\r\n        } else if (document.webkitExitFullscreen) { /* Safari */\r\n            document.webkitExitFullscreen();\r\n        }\r\n    }\r\n}\n\n//# sourceURL=webpack://asp.net/./src/js/ui-functionality/utils.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/earth.js");
/******/ 	
/******/ })()
;