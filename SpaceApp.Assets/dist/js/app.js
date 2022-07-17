/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ui_functionality_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ui-functionality/tabs */ \"./src/js/ui-functionality/tabs.js\");\n/* harmony import */ var _ui_functionality_space_viewer_controls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ui-functionality/space-viewer-controls */ \"./src/js/ui-functionality/space-viewer-controls.js\");\n/* harmony import */ var _ui_functionality_space_viewer_controls__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_ui_functionality_space_viewer_controls__WEBPACK_IMPORTED_MODULE_1__);\n﻿\r\n\n\n//# sourceURL=webpack://asp.net/./src/js/app.js?");

/***/ }),

/***/ "./src/js/ui-functionality/space-viewer-controls.js":
/*!**********************************************************!*\
  !*** ./src/js/ui-functionality/space-viewer-controls.js ***!
  \**********************************************************/
/***/ (() => {

eval("﻿const spaceViewer = document.querySelector('.space-viewer');\r\n\r\nif (spaceViewer) {\r\n    const fullScreenButton = spaceViewer.querySelector('.space-viewer__item--fullscreen');\r\n\r\n    fullScreenButton.addEventListener(\"click\", () => {\r\n        if (document.fullscreenElement == null) {\r\n            if (spaceViewer.requestFullscreen) {\r\n                spaceViewer.requestFullscreen();\r\n            } else if (spaceViewer.webkitRequestFullscreen) { /* Safari */\r\n                spaceViewer.webkitRequestFullscreen();\r\n            }\r\n        } else {\r\n            if (document.exitFullscreen) {\r\n                document.exitFullscreen();\r\n            } else if (document.webkitExitFullscreen) { /* Safari */\r\n                document.webkitExitFullscreen();\r\n            }\r\n        }\r\n    })\r\n}\r\n\n\n//# sourceURL=webpack://asp.net/./src/js/ui-functionality/space-viewer-controls.js?");

/***/ }),

/***/ "./src/js/ui-functionality/tabs.js":
/*!*****************************************!*\
  !*** ./src/js/ui-functionality/tabs.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/app.js");
/******/ 	
/******/ })()
;