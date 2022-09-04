import { applyFullscreen } from '../utlis/utils';
import { showErrorNotification, showInfoNotification } from './notifications';
import api from '../api/fetch-api';
import { requestGeolocation, geolocationApiBrowserSupport, handleErrorCallback } from '../utlis/utils';
import { scenes } from '../data/enums';
import { setZoomSettings } from '../earth';
import { globeConfig, cityNamesLabelStyle } from '../data/iss-config';

export default function configureControls(viewer, scene, clock, satellite) {
    const cesiumContainer = document.querySelector('#cesiumContainer');

    if (cesiumContainer && viewer) {

        function configureSceneModeButton() {
            const sceneModeButton = cesiumContainer.querySelector('.js-cesium-3d-globe');
            const scenesPanel = cesiumContainer.querySelector('.js-cesium-scenes-panel');
            const controls = cesiumContainer.querySelector('.space-viewer-controls')

            if (sceneModeButton && scenesPanel && controls) {
                sceneModeButton.addEventListener("click", () => {
                    scenesPanel.classList.toggle("active")
                    controls.style.display = "none";
                })
            }

            const scenePanelCloseButton = scenesPanel.querySelector('.space-viewer-controls__close');
            const globeImages = cesiumContainer.querySelectorAll('.space-viewer-controls__icon--globe-icon');
            const globe3dImage = cesiumContainer.querySelector('.space-viewer-controls__icon--3d-globe');
            const globe2dImage = cesiumContainer.querySelector('.space-viewer-controls__icon--2d-globe');
            const columbusViewImage = cesiumContainer.querySelector('.space-viewer-controls__icon--columbus-view');
            const followSatelliteButton = cesiumContainer.querySelector('.js-cesium-follow-satellite');
            const trackedEntityButton = cesiumContainer.querySelector('.js-cesium-tracked-entity');

            if (scenePanelCloseButton && controls && globeImages && globe3dImage && globe2dImage && columbusViewImage && followSatelliteButton) {
                //configure scene panel close button
                scenePanelCloseButton.addEventListener("click", () => {
                    controls.style.display = "flex";
                    scenesPanel.classList.toggle('active');

                    const selectedScene = cesiumContainer.querySelector('[name="scene-mode"]:checked');
                    if (selectedScene) {
                        const selectedSceneValue = Number(selectedScene.value);

                        if (selectedSceneValue !== scene.mode) {
                            viewer.trackedEntity = null;
                            globeImages.forEach(globeImage => { globeImage.classList.remove('active'); })
                            enableButtonsDuringAnimation()

                            //configure view buttons
                            switch (selectedSceneValue) {
                                case scenes.flatView:
                                    globe2dImage.classList.add('active');
                                    trackedEntityButton.classList.add('hide')
                                    scene.mode = Cesium.SceneMode.SCENE2D;
                                    setZoomSettings(scene, globeConfig.flatViewMinimumZoomDistance, globeConfig.flatViewMaximumZoomDistance, globeConfig.flatViewMinimumZoomRate)
                                    pointCameraToSatellite(globeConfig.flyToDurationReset);
                                    break;
                                case scenes.columbusView:
                                    columbusViewImage.classList.add('active');
                                    trackedEntityButton.classList.add('hide')
                                    scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
                                    setZoomSettings(scene, globeConfig.columbusViewMinimumZoomDistance, globeConfig.columbusViewMaximumZoomDistance, globeConfig.columbusViewMinimumZoomRate);
                                    pointCameraToSatellite(globeConfig.flyToDurationReset)
                                    break;
                                default:
                                    globe3dImage.classList.add('active');
                                    trackedEntityButton.classList.remove('hide')
                                    trackedEntityButton.classList.remove('active')
                                    scene.mode = Cesium.SceneMode.SCENE3D;
                                    setZoomSettings(scene, globeConfig.globeMinimumZoomDistance, globeConfig.globeMaximumZoomDistance, globeConfig.globeMinimumZoomRate)
                                    pointCameraToSatellite(globeConfig.flyToDurationReset)
                                    break;
                            }
                        }

                    }
                });
            }
        }

        function configureSettingsButton() {
            let isCityDataRetrieved = false;
            const settingsButton = cesiumContainer.querySelector('.js-cesium-settings');
            const cityLabelsPanel = cesiumContainer.querySelector('.js-cesium-settings-panel');
            const controls = cesiumContainer.querySelector('.space-viewer-controls')

            if (settingsButton && cityLabelsPanel && controls) {
                settingsButton.addEventListener("click", () => {
                    cityLabelsPanel.classList.toggle("active")
                    controls.style.display = "none";
                })
            }

            const scenePanelCloseButton = cityLabelsPanel.querySelector('.space-viewer-controls__close');
            const showOrbitCheckbox = cityLabelsPanel.querySelector('#filter-orbit');
            const showCityLabelsCheckbox = cityLabelsPanel.querySelector('#filter-city-labels');
            const showAtmosphereCheckbox = cityLabelsPanel.querySelector('#filter-atmopshere');
            const showLightingCheckbox = cityLabelsPanel.querySelector('#filter-lighting');
            const labels = scene.primitives.add(new Cesium.LabelCollection());

            if (scenePanelCloseButton && showOrbitCheckbox && showCityLabelsCheckbox && showAtmosphereCheckbox && showLightingCheckbox) {
                scenePanelCloseButton.addEventListener("click", () => {
                    controls.style.display = "flex";
                    cityLabelsPanel.classList.toggle('active');

                    //configure orbit 
                    satellite.path.show = showOrbitCheckbox.checked

                    //configure city labels
                    if (showCityLabelsCheckbox.checked) {
                        labels.show = true;
                        if (!isCityDataRetrieved) {
                            api.makeApiCall("CityLocations", renderCityNames); //make api call for city data
                        }
                    } else {
                        labels.show = false;
                    }

                    //configure atmosphere
                    scene.skyAtmosphere.show = showAtmosphereCheckbox.checked

                    //configure lighting
                    scene.globe.enableLighting = showLightingCheckbox.checked
                })
            }

            //TODO: Break out into earth.js
            function renderCityNames(cities) {
                if (cities) {
                    isCityDataRetrieved = true;

                    const highestCityLocations = cities.HighestCityLocations;
                    const medianCityLocations = cities.MedianCityLocations;
                    const lowestCityLocations = cities.LowestCityLocations;

                    const highestCitiesTranslucencyByDistance = undefined
                    const medianCitiesTranslucencyByDistance = new Cesium.NearFarScalar(1.0e7, 1.0, 1.01e7, 0.0);
                    const lowestCitiesTranslucencyByDistance = new Cesium.NearFarScalar(0.2e7, 1.0, 0.21e7, 0.0);

                    highestCityLocations.forEach(city => {
                        const latitude = city["CapitalLatitude"];
                        const longitude = city["CapitalLongitude"];
                        const name = city["CapitalName"];

                        if (latitude && longitude && name) {
                            labels.add({
                                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 0),
                                text: name,
                                ...cityNamesLabelStyle,
                                translucencyByDistance: highestCitiesTranslucencyByDistance,
                            });
                        }
                    })

                    medianCityLocations.forEach(city => {
                        const latitude = city["CapitalLatitude"];
                        const longitude = city["CapitalLongitude"];
                        const name = city["CapitalName"];

                        if (latitude && longitude && name) {
                            labels.add({
                                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
                                text: name,
                                ...cityNamesLabelStyle,
                                translucencyByDistance: medianCitiesTranslucencyByDistance
                            });
                        }
                    })

                    lowestCityLocations.forEach(city => {
                        const latitude = city["CapitalLatitude"];
                        const longitude = city["CapitalLongitude"];
                        const name = city["CapitalName"];

                        if (latitude && longitude && name) {
                            labels.add({
                                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 10),
                                text: name,
                                ...cityNamesLabelStyle,
                                translucencyByDistance: lowestCitiesTranslucencyByDistance
                            });
                        }
                    })
                }
            }
        }

        function configureFullScreenButton() {
            const fullscreenButton = cesiumContainer.querySelector('.js-cesium-fullscreen');
            if (fullscreenButton) {
                fullscreenButton.addEventListener("click", () => {
                    applyFullscreen(cesiumContainer)
                })
            }
        }

        function configureTrackedEntity() {
            const trackedEntityButton = cesiumContainer.querySelector('.js-cesium-tracked-entity');

            if (trackedEntityButton) {
                trackedEntityButton.addEventListener("click", () => {
                    if (!trackedEntityButton.classList.contains("js-disabled")) {
                        if (!viewer.trackedEntity) {
                            viewer.trackedEntity = satellite;
                            trackedEntityButton.classList.add("active")

                            showInfoNotification("fixedCamera", cesiumContainer)
                            enableButtonsDuringAnimation()

                        } else {
                            disableButtonsDuringAnimation()
                            trackedEntityButton.classList.remove("active")

                            pointCameraToSatellite(globeConfig.flyToDurationGlobeView, function () {
                                enableButtonsDuringAnimation()
                                showInfoNotification("freeCamera", cesiumContainer)
                                viewer.trackedEntity = null;
                            });
                        }
                    } else {
                        showErrorNotification("trackedEntityAnimationInProgress", cesiumContainer)
                    }
                })
            }
        }

        function configureFollowSatelliteButton() {
            const followSatelliteButton = cesiumContainer.querySelector('.js-cesium-follow-satellite');

            if (followSatelliteButton) {
                followSatelliteButton.addEventListener("click", () => {
                    if (!followSatelliteButton.classList.contains('js-disabled')) {

                        switch (scene.mode) {
                            case 1: //columbus view
                                handleCameraColumbusView()
                                break;
                            case 2: //2d view
                                handleCamera2DView()
                                break;
                            case 3: //globe view
                                handleCameraGlobeView()
                                break;
                        }
                    } else {
                        showErrorNotification("satelliteAnimationInProgress", cesiumContainer)
                    }
                })
            }

            function handleCameraColumbusView() {
                disableButtonsDuringAnimation()

                pointCameraToSatellite(globeConfig.flyToDurationColumbusView, function () {
                    enableButtonsDuringAnimation()
                });
            }

            function handleCamera2DView() {
                disableButtonsDuringAnimation()

                pointCameraToSatellite(globeConfig.flyToDuration2DView, function () {
                    enableButtonsDuringAnimation()
                });
            }

            function handleCameraGlobeView() {
                disableButtonsDuringAnimation()

                pointCameraToSatellite(globeConfig.flyToDurationGlobeView, function () {
                    enableButtonsDuringAnimation()
                    showInfoNotification("freeCamera", cesiumContainer)
                });
                viewer.trackedEntity = null;
            }
        }

        function configureCurrentLocationButton() {
            const trackedEntityButton = cesiumContainer.querySelector('.js-cesium-tracked-entity');
            const currentLocationButton = cesiumContainer.querySelector('.js-cesium-current-location');
            const billboardCollection = scene.primitives.add(new Cesium.BillboardCollection());
            const billboard = billboardCollection.add({
                image: 'assets/images/location-pin.svg',
                scale: 0.1,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                show: false
            });
            const currentLocationMarkerHeight = 1000;
            const currentLocationCameraHeight = 1000000

            let isPointingToCurrentLocation = false;

            if (currentLocationButton && trackedEntityButton) {
                currentLocationButton.addEventListener("click", () => {
                    if (!currentLocationButton.classList.contains("js-disabled")) {
                        if (!isPointingToCurrentLocation) {
                            if (!geolocationApiBrowserSupport()) { //geolocation feature not supported by browser
                                showErrorNotification("geolocationNotSupported", cesiumContainer)
                                return;
                            }

                            requestGeolocation(successCallback, errorCallback)
                        } else {
                            currentLocationButton.classList.remove("active")

                            //reset values
                            billboard.show = false;
                            isPointingToCurrentLocation = false;
                        }
                    } else {
                        showErrorNotification("geolocationAnimationInProgress", cesiumContainer)
                    }
                })
            }

            function successCallback(position) {
                if (position && position.coords) {
                    const coords = position.coords;
                    const latitude = coords.latitude;
                    const longitude = coords.longitude;

                    if (latitude && longitude) {
                        //Add active class to button
                        viewer.trackedEntity = null;
                        currentLocationButton.classList.add("active")
                        trackedEntityButton.classList.remove("active")
                        disableButtonsDuringAnimation()
                        billboard.position = new Cesium.Cartesian3.fromDegrees(longitude, latitude, currentLocationMarkerHeight);
                        billboard.show = true;

                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromDegrees(
                                longitude,
                                latitude,
                                currentLocationCameraHeight),
                            duration: globeConfig.flyToDurationCurrentLocation,
                            complete: function () {
                                isPointingToCurrentLocation = true;
                                enableButtonsDuringAnimation()
                            }
                        });

                        isPointingToCurrentLocation = true;
                    }
                }
            }

            function errorCallback(error) {
                handleErrorCallback(error, showErrorNotification, cesiumContainer)
            }
        }
        //TODO: Break out into earth.js
        function pointCameraToSatellite(duration, completeFunction) {
            let position = null;
            try {
                //position = JSON.parse(sessionStorage.getItem("IssPosition"))
                position = Cesium.Cartographic.fromCartesian(satellite.position.getValue(viewer.clock.currentTime))
            } catch (err) {
                console.error(err);
            }

            if (position) {
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromRadians(
                        position.longitude,
                        position.latitude,
                        globeConfig.cameraHeight),
                    duration: duration,
                    complete: completeFunction
                });
            }
        }

        function enableButtonsDuringAnimation() {
            const followSatelliteButton = cesiumContainer.querySelector('.js-cesium-follow-satellite');
            const currentLocationButton = cesiumContainer.querySelector('.js-cesium-current-location');
            const trackedEntityButton = cesiumContainer.querySelector('.js-cesium-tracked-entity');

            if (followSatelliteButton && currentLocationButton && trackedEntityButton) {
                followSatelliteButton.classList.remove("js-disabled")
                currentLocationButton.classList.remove("js-disabled")
                trackedEntityButton.classList.remove("js-disabled")
            }
        }

        function disableButtonsDuringAnimation() {
            const followSatelliteButton = cesiumContainer.querySelector('.js-cesium-follow-satellite');
            const currentLocationButton = cesiumContainer.querySelector('.js-cesium-current-location');
            const trackedEntityButton = cesiumContainer.querySelector('.js-cesium-tracked-entity');

            if (followSatelliteButton && currentLocationButton && trackedEntityButton) {
                followSatelliteButton.classList.add("js-disabled")
                currentLocationButton.classList.add("js-disabled")
                trackedEntityButton.classList.add("js-disabled")
            }
        }

        configureSceneModeButton()
        configureSettingsButton()
        configureFullScreenButton()
        configureTrackedEntity()
        configureFollowSatelliteButton()
        configureCurrentLocationButton()
    }
}