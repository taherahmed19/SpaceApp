import { applyFullscreen } from './utils';
import { showErrorNotification, showInfoNotification } from './notifications';
import api from '../api/fetch-api';
import {
    setZoomSettings,
    cameraHeight,
    globeMinimumZoomDistance,
    globeMaximumZoomDistance,
    globeMinimumZoomRate,
    columbusViewMaximumZoomDistance,
    columbusViewMinimumZoomDistance,
    columbusViewMinimumZoomRate,
    flatViewMaximumZoomDistance,
    flatViewMinimumZoomDistance,
    flatViewMinimumZoomRate
} from '../earth';

export default function configureControls(viewer, scene, satellite) {
    const scenes = {
        globe: 3,
        flatView: 2,
        columbusView: 1,
    }
    const flyToDurationGlobeView = 5;
    const flyToDuration2DView = 2;
    const flyToDurationColumbusView = 2;
    const flyToDurationReset = 0;
    const zoomAmount = 250000;

    const labelStyle = {
        font: '31px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        outlineColor: Cesium.Color.BLACK,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scale: 0.5,
    }

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

            if (scenePanelCloseButton && controls && globeImages && globe3dImage && globe2dImage && columbusViewImage) {
                //configure scene panel close button
                scenePanelCloseButton.addEventListener("click", () => {
                    controls.style.display = "flex";
                    scenesPanel.classList.toggle('active');
                    globeImages.forEach(globeImage => { globeImage.classList.remove('active'); })

                    const selectedScene = cesiumContainer.querySelector('[name="scene-mode"]:checked');
                    if (selectedScene) {
                        const selectedSceneValue = selectedScene.value;

                        //configure view buttons
                        switch (selectedSceneValue) {
                            case '2d-globe':
                                globe2dImage.classList.add('active');
                                scene.mode = Cesium.SceneMode.SCENE2D;
                                setZoomSettings(scene, flatViewMinimumZoomDistance, flatViewMaximumZoomDistance, flatViewMinimumZoomRate)
                                pointCameraToSatellite(flyToDurationReset);
                                break;
                            case 'columbus-view':
                                columbusViewImage.classList.add('active');
                                scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
                                setZoomSettings(scene, columbusViewMinimumZoomDistance, columbusViewMaximumZoomDistance, columbusViewMinimumZoomRate);
                                pointCameraToSatellite(flyToDurationReset)
                                break;
                            default:
                                globe3dImage.classList.add('active');
                                scene.mode = Cesium.SceneMode.SCENE3D;
                                setZoomSettings(scene, globeMinimumZoomDistance, globeMaximumZoomDistance, globeMinimumZoomRate)
                                pointCameraToSatellite(flyToDurationReset)
                                break;
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
            const showCityLabelsCheckbox = cityLabelsPanel.querySelector('#filter-city-labels');
            const showAtmosphereCheckbox = cityLabelsPanel.querySelector('#filter-atmopshere');
            const showLightingCheckbox = cityLabelsPanel.querySelector('#filter-lighting');
            const labels = scene.primitives.add(new Cesium.LabelCollection());

            if (scenePanelCloseButton && showCityLabelsCheckbox && showAtmosphereCheckbox && showLightingCheckbox) {
                scenePanelCloseButton.addEventListener("click", () => {
                    controls.style.display = "flex";
                    cityLabelsPanel.classList.toggle('active');

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
                    if (showAtmosphereCheckbox.checked) {
                        scene.skyAtmosphere.show = true;
                    } else {
                        scene.skyAtmosphere.show = false;
                    }

                    //configure lighting
                    if (showLightingCheckbox.checked) {
                        scene.globe.enableLighting = true;
                    } else {
                        scene.globe.enableLighting = false;
                    }
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
                                ...labelStyle,
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
                                ...labelStyle,
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
                                ...labelStyle,
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
                        showErrorNotification("animationInProgress", cesiumContainer)
                    }
                })
            }

            function handleCameraColumbusView() {
                followSatelliteButton.classList.add("js-disabled")

                pointCameraToSatellite(flyToDurationColumbusView, function () {
                    followSatelliteButton.classList.remove("js-disabled")
                });
            }

            function handleCamera2DView() {
                followSatelliteButton.classList.add("js-disabled")

                pointCameraToSatellite(flyToDuration2DView, function () {
                    followSatelliteButton.classList.remove("js-disabled")
                });
            }

            function handleCameraGlobeView() {
                if (!viewer.trackedEntity) {
                    viewer.trackedEntity = satellite;
                    showInfoNotification("fixedCamera", cesiumContainer)
                } else {
                    followSatelliteButton.classList.add("js-disabled")

                    pointCameraToSatellite(flyToDurationGlobeView, function () {
                        followSatelliteButton.classList.remove("js-disabled")
                        showInfoNotification("freeCamera", cesiumContainer)
                    });
                    viewer.trackedEntity = null;
                }
            }
        }

        function configureZoomInButton() {
            const zoomInButton = cesiumContainer.querySelector('.js-cesium-zoom-in');

            if (zoomInButton) {
                zoomInButton.addEventListener("click", () => {
                    let minimumZoomDistance = 0;
                    let currentCameraHeight = 0;

                    if (viewer.trackedEntity) {
                        currentCameraHeight = scene.camera.position.z //view from values
                        minimumZoomDistance = 144472.18362793513;
                    } else {
                        switch (scene.mode) {
                            case scenes.globe:
                                minimumZoomDistance = globeMinimumZoomDistance
                                currentCameraHeight = scene.globe.ellipsoid.cartesianToCartographic(scene.camera.position).height
                                break;
                            case scenes.flatView:
                                minimumZoomDistance = flatViewMinimumZoomDistance
                                currentCameraHeight = (scene.camera.frustum.right - scene.camera.frustum.left) * 0.5
                                break;
                            case scenes.columbusView:
                                minimumZoomDistance = columbusViewMinimumZoomDistance
                                currentCameraHeight = scene.camera.position.z
                                break;
                        }
                    }

                    if (currentCameraHeight - zoomAmount <= minimumZoomDistance) { //prevent zooming in past the minimum zoom distance on the scene
                        let zoomDifference = currentCameraHeight - minimumZoomDistance

                        if (zoomDifference >= 0) {
                            viewer.scene.camera.zoomIn(zoomDifference)
                        }
                    } else {
                        viewer.scene.camera.zoomIn(zoomAmount)
                    }
                })
            }
        }

        function configureZoomOutButton() {
            const zoomOutButton = cesiumContainer.querySelector('.js-cesium-zoom-out');

            if (zoomOutButton) {
                zoomOutButton.addEventListener("click", () => {
                    const currentCameraHeight = scene.globe.ellipsoid.cartesianToCartographic(scene.camera.position).height

                    if (!(currentCameraHeight + zoomAmount > globeMaximumZoomDistance)) { //prevent zooming out past the max zoom distance on the scene
                        viewer.scene.camera.zoomOut(zoomAmount)
                    }
                })
            }
        }

        //TODO: Break out into earth.js
        function pointCameraToSatellite(duration, completeFunction) {
            let position = null;
            try {
                position = JSON.parse(sessionStorage.getItem("IssPosition"))
            } catch (err) {
                console.error(err);
            }

            if (position) {
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromRadians(
                        position.longitude,
                        position.latitude,
                        cameraHeight),
                    duration: duration,
                    complete: completeFunction
                });
            }
        }

        configureSceneModeButton()
        configureSettingsButton()
        configureFullScreenButton()
        configureFollowSatelliteButton()
        configureZoomInButton()
        configureZoomOutButton()
    }
}