import { applyFullscreen } from './utils';

const cesiumContainer = document.querySelector('#cesiumContainer');

export default function configureControls(viewer) {
    if (cesiumContainer && viewer) {
        configureSceneModeButton(viewer)
        configureFullScreenButton()
    }
}

function configureSceneModeButton(viewer) {
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
                        break;
                    case 'columbus-view':
                        columbusViewImage.classList.add('active');
                        viewer.scene.mode = Cesium.SceneMode.COLUMBUS_VIEW;
                        viewer.camera.flyHome(2)
                        break;
                    default:
                        globe3dImage.classList.add('active');
                        viewer.scene.mode = Cesium.SceneMode.SCENE3D;

                        let position = null;
                        try {
                            position = JSON.parse(sessionStorage.getItem("IssPosition"))
                        } catch (err) {
                            console.error(err);
                        }

                        if (position) {
                            viewer.camera.flyTo({
                                destination: Cesium.Cartesian3.fromRadians(position.longitude, position.latitude, viewer.camera.positionCartographic.height),
                            });
                        }

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