import { applyFullscreen } from './utils';
import { cameraHeight } from '../earth';
import { showErrorNotification } from './notifications';

const cesiumContainer = document.querySelector('#cesiumContainer');

export default function configureControls(viewer, satellite) {
    if (cesiumContainer && viewer) {
        const flyToDurationGlobeView = 5;
        const flyToDuration2DView = 0;
        const flyToDurationColumbusView = 0;

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

            const scenePanelCloseButton = cesiumContainer.querySelector('.space-viewer-controls__close');
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
                                pointCameraToSatellite(flyToDuration2DView)
                                break;
                            case 'columbus-view':
                                columbusViewImage.classList.add('active');
                                viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
                                pointCameraToSatellite(flyToDurationColumbusView)
                                break;
                            default:
                                globe3dImage.classList.add('active');
                                viewer.scene.mode = Cesium.SceneMode.SCENE3D;
                                pointCameraToSatellite(flyToDurationGlobeView)
                                break;
                        }
                    }
                });
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
                                break;
                            case 2: //2d view
                                handleCamera2DView(flyToDuration2DView)
                                break;
                            case 3: //globe view
                                handleCameraGlobeView(flyToDurationGlobeView)
                                break;
                        }
                    } else {
                        showErrorNotification("Cannot click during animation", "animation", document.querySelector('#cesiumContainer'))
                    }
                })
            }

            function handleCamera2DView(duration) {
                let position = null;

                try {
                    position = JSON.parse(sessionStorage.getItem("IssPosition"))
                } catch (err) {
                    console.error(err)
                }

                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromRadians(
                        position.longitude,
                        position.latitude,
                        cameraHeight
                    ),
                    duration: duration,
                    complete: function () {
                        followSatelliteButton.classList.remove("js-disabled")
                    }
                });
            }

            function handleCameraGlobeView(duration) {
                if (!viewer.trackedEntity) {
                    viewer.trackedEntity = satellite;
                } else {
                    let position = null;

                    try {
                        position = JSON.parse(sessionStorage.getItem("IssPosition"))
                    } catch (err) {
                        console.error(err)
                    }

                    if (position) {
                        followSatelliteButton.classList.add("js-disabled")

                        viewer.camera.flyTo({
                            destination: Cesium.Cartesian3.fromRadians(
                                position.longitude,
                                position.latitude,
                                cameraHeight
                            ),
                            duration: duration,
                            complete: function () {
                                followSatelliteButton.classList.remove("js-disabled")
                            }
                        });
                        viewer.trackedEntity = null
                    }
                }
            }
        }

        function pointCameraToSatellite(duration) {
            let position = null;
            try {
                position = JSON.parse(sessionStorage.getItem("IssPosition"))
            } catch (err) {
                console.error(err);
            }

            if (position) {
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromRadians(position.longitude, position.latitude, cameraHeight),
                    duration: duration
                });
            }
        }

        configureSceneModeButton()
        configureFullScreenButton()
        configureFollowSatelliteButton(viewer, satellite)
    }
}