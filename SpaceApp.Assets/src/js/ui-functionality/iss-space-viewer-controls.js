import { applyFullscreen } from './utils';
import { cameraHeight, citiesData } from '../earth';
import { showErrorNotification } from './notifications';
import api from '../api/fetch-api';

export default function configureControls(viewer, satellite) {
    const cesiumContainer = document.querySelector('#cesiumContainer');

    if (cesiumContainer && viewer) {
        const flyToDurationGlobeView = 5;
        const flyToDuration2DView = 2;
        const flyToDurationColumbusView = 2;
        const flyToDurationReset = 0;

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
                        const scene = selectedScene.value;

                        //configure 3d globe buttons
                        switch (scene) {
                            case '2d-globe':
                                globe2dImage.classList.add('active');
                                viewer.scene.mode = Cesium.SceneMode.SCENE2D;
                                pointCameraToSatellite(flyToDurationReset)
                                break;
                            case 'columbus-view':
                                columbusViewImage.classList.add('active');
                                viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
                                pointCameraToSatellite(flyToDurationReset)
                                break;
                            default:
                                globe3dImage.classList.add('active');
                                viewer.scene.mode = Cesium.SceneMode.SCENE3D;
                                pointCameraToSatellite(flyToDurationReset)
                                break;
                        }
                    }
                });
            }
        }

        function configureCityLabelsButton() {
            const cityLabelsButton = cesiumContainer.querySelector('.js-cesium-city-labels');
            const cityLabelsPanel = cesiumContainer.querySelector('.js-cesium-city-labels-panel');
            const controls = cesiumContainer.querySelector('.space-viewer-controls')

            if (cityLabelsButton && cityLabelsPanel && controls) {
                cityLabelsButton.addEventListener("click", () => {
                    cityLabelsPanel.classList.toggle("active")
                    controls.style.display = "none";
                })
            }

            const scenePanelCloseButton = cityLabelsPanel.querySelector('.space-viewer-controls__close');
            const showCityLabelsCheckbox = cityLabelsPanel.querySelector('.js-cesium-show-city-labels');
            if (scenePanelCloseButton && showCityLabelsCheckbox) {
                scenePanelCloseButton.addEventListener("click", () => {
                    controls.style.display = "flex";
                    cityLabelsPanel.classList.toggle('active');

                    if (showCityLabelsCheckbox.checked) {
                        if (citiesData.cities == null) {
                            //make api call for city data
                            try {
                                api.makeApiCall("CityLocations", renderCityNames);
                            } catch (err) {
                                console.error(err);
                            }
                        }
                    } else {
                        console.log("labels...")
                        console.log(viewer.scene.primitives)
                    }
                })
            }

            //TODO: Break out into earth.js
            function renderCityNames(cities) {
                if (cities && citiesData) {
                    const labels = viewer.scene.primitives.add(new Cesium.LabelCollection());

                    citiesData.cities = cities;

                    cities.forEach(city => {
                        const latitude = city["CapitalLatitude"];
                        const longitude = city["CapitalLongitude"];
                        const name = city["CapitalName"];

                        if (latitude && longitude && name) {
                            labels.add({
                                position: Cesium.Cartesian3.fromDegrees(longitude, latitude, 1000),
                                text: name,
                                font: '15px Helvetica',
                                //rotation: Cesium.Math.toRadians(-45)
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

                        switch (viewer.scene.mode) {
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
                        showErrorNotification("Cannot click during animation", "animation", document.querySelector('#cesiumContainer'))
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
                } else {
                    followSatelliteButton.classList.add("js-disabled")

                    pointCameraToSatellite(flyToDurationGlobeView, function () {
                        followSatelliteButton.classList.remove("js-disabled")
                    });
                    viewer.trackedEntity = null
                }
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
        configureCityLabelsButton()
        configureFullScreenButton()
        configureFollowSatelliteButton()
    }
}