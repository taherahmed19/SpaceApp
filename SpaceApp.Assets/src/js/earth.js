import api from './api/fetch-api';
import configureControls from './ui-functionality/iss-space-viewer-controls'

const heightBuffer = 1000;
const cameraHeight = 20203203;

/**
 * Default values
 * Minimum zoom distance = 1.0
 * Maxiumum zoom distance = Infinity
 * Minimum zoom rate = 20
 */
const globeMinimumZoomDistance = 250000;
const globeMaximumZoomDistance = 20000000;
const globeMinimumZoomRate = 350000;
const columbusViewMinimumZoomDistance = 250000;
const columbusViewMaximumZoomDistance = 40000000;
const columbusViewMinimumZoomRate = 350000;
const flatViewMinimumZoomDistance = 250000;
const flatViewMaximumZoomDistance = Infinity;
const flatViewMinimumZoomRate = 350000;

api.makeApiCall("IssTles", renderEarthViewer);

/**
 * 
 * @param {*} data 
 */
function renderEarthViewer(data) {
    console.log(data)
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YjhlOGFjMC1hYjQwLTRkN2QtYmIwYy0wMTUxNDJiZjMxOGIiLCJpZCI6MTA0NjM4LCJpYXQiOjE2NjA0MTQwNTh9.2gD9ETM4SVSm4lHrS3jOA9E7DHRSQhYlqQAOBtTLy6U';

    // Initialize the Cesium viewer.
    const viewer = new Cesium.Viewer('cesiumContainer', {
        sceneMode: Cesium.SceneMode.SCENE3D,
        imageryProvider: new Cesium.SingleTileImageryProvider({
            url: "/assets/images/earth-map-tiles.jpg",
            style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS
        }),
        baseLayerPicker: false, geocoder: false, homeButton: false, infoBox: false,
        navigationHelpButton: false, sceneModePicker: false, fullscreenButton: false,
    });

    const scene = viewer.scene;

    function setViewerWindowSettings() {
        scene.skyAtmosphere.show = false;
        scene.globe.enableLighting = false;
        viewer.animation.container.style.visibility = 'hidden';
        viewer.timeline.container.style.visibility = 'hidden';
        viewer.useBrowserRecommendedResolution = false;
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.selectionIndicator.viewModel.selectionIndicatorElement.style.visibility = 'hidden';
        viewer.forceResize();
    }

    function setGlobeTextureSettings() {
        const layers = scene.imageryLayers;
        const imageLayer = layers._layers[0];
        imageLayer.brightness = 0.6;
    }

    function addSatelliteEntity(position) {
        const pointPosition = new Cesium.Cartesian3.fromRadians(
            position.current.longitude, position.current.latitude, position.current.height * heightBuffer
        );

        const xOffset = -1200000;
        const yOffset = -600000;
        const zOffset = 950000;

        const satellite = viewer.entities.add({
            position: pointPosition,
            model: {
                uri: '/assets/models/ISS.glb',
                minimumPixelSize: 8000,
                maximumScale: 8000,
            },
            viewFrom: new Cesium.Cartesian3(xOffset, yOffset, zOffset),
            polyline: {
                //use previous position and current position 
                positions: Cesium.Cartesian3.fromRadiansArrayHeights([position.previous.longitude, position.previous.latitude, position.previous.height * heightBuffer,
                position.current.longitude, position.current.latitude, position.current.height * heightBuffer]),
                width: 10,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    taperPower: 0.5,
                    color: Cesium.Color.CORNFLOWERBLUE,
                }),
            },
        });

        return satellite;
    }

    function setCameraView(position) {
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
                position.current.longitude,
                position.current.latitude,
                cameraHeight
            )
        });
    }


    function setTileProgressEvent() {
        // Wait for globe to load then zoom out     
        let initialized = false;
        scene.globe.tileLoadProgressEvent.addEventListener(() => {
            if (!initialized && scene.globe.tilesLoaded === true) {
                initialized = true;
                removeLoadingSpinner()
            }
        });
    }

    function setSatellitePositionInterval() {
        window.setInterval(function () {
            updatePosition(satellite, data)
        }, 2000); //100
    }

    const position = getPosition(data.line1.trim(), data.line2.trim())
    const satellite = addSatelliteEntity(position);
    setViewerWindowSettings()
    setGlobeTextureSettings()
    setCameraView(position)
    setTileProgressEvent()
    setZoomSettings(scene, globeMinimumZoomDistance, globeMaximumZoomDistance, globeMinimumZoomRate)
    setSatellitePositionInterval()
    configureControls(viewer, scene, satellite);
}

/**
 * 
 * @param {*} minimumZoomDistance 
 * @param {*} maximumZoomDistance 
 * @param {*} minimumZoomRate 
 */
function setZoomSettings(scene, minimumZoomDistance, maximumZoomDistance, minimumZoomRate) {
    scene.screenSpaceCameraController.minimumZoomDistance = minimumZoomDistance;
    scene.screenSpaceCameraController.maximumZoomDistance = maximumZoomDistance;
    scene.screenSpaceCameraController._minimumZoomRate = minimumZoomRate;
}

/**
 * 
 * @param {*} currentPoint 
 * @param {*} data 
 */
function updatePosition(satellite, data) {
    var position = getPosition(data.line1.trim(), data.line2.trim())
    var pointPosition = new Cesium.Cartesian3.fromRadians(
        position.current.longitude, position.current.latitude, position.current.height * heightBuffer
    )
    satellite.position = pointPosition;

    try {
        sessionStorage.setItem("IssPosition", JSON.stringify({ longitude: position.longitude, latitude: position.latitude }));
    } catch (err) {
        console.error(err)
    }
}

/**
 * 
 * @param {*} tleLine1 
 * @param {*} tleLine2 
 * @returns 
 */
function getPosition(tleLine1, tleLine2) {
    // These 2 lines are published by NORAD and allow us to predict where the ISS is at any given moment. They are regularly updated.
    // Get the latest from: https://celestrak.com/satcat/tle.php?CATNR=25544.
    const satrec = satellite.twoline2satrec(
        tleLine1,
        tleLine2
    );

    const previousDateTime = new Date();
    previousDateTime.setMinutes(previousDateTime.getMinutes() - 30);

    const previousPositionAndVelocity = satellite.propagate(satrec, previousDateTime); // Propagate satellite using time since epoch (in date).
    const previousGmst = satellite.gstime(previousDateTime);
    const previousPosition = satellite.eciToGeodetic(previousPositionAndVelocity.position, previousGmst);

    const currentDateTime = new Date();
    const positionAndVelocity = satellite.propagate(satrec, currentDateTime); // Propagate satellite using time since epoch (in date).
    const gmst = satellite.gstime(currentDateTime);
    const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

    return {
        current: {
            longitude: position.longitude,
            latitude: position.latitude,
            height: position.height,
        },
        previous: {
            longitude: previousPosition.longitude,
            latitude: previousPosition.latitude,
            height: previousPosition.height,
        }
    }
}

/**
 * 
 */
function removeLoadingSpinner() {
    const loadingSpinner = document.querySelector(".loading-spinner");
    const cesiumContainer = document.querySelector("#cesiumContainer");

    if (loadingSpinner && cesiumContainer) {
        loadingSpinner.style.display = "none";
        cesiumContainer.style.display = "block"
    }

}

export {
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
};