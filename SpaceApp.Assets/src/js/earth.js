import api from './api/fetch-api';
import configureControls from './ui-functionality/iss-space-viewer-controls'

const heightBuffer = 1000;
const cameraHeight = 26203203.255770896;

api.makeApiCall("IssTles", renderEarthViewer);

/**
 * 
 * @param {*} data 
 */
function renderEarthViewer(data) {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YjhlOGFjMC1hYjQwLTRkN2QtYmIwYy0wMTUxNDJiZjMxOGIiLCJpZCI6MTA0NjM4LCJpYXQiOjE2NjA0MTQwNTh9.2gD9ETM4SVSm4lHrS3jOA9E7DHRSQhYlqQAOBtTLy6U';

    // Initialize the Cesium viewer.
    const viewer = new Cesium.Viewer('cesiumContainer', {
        sceneMode: Cesium.SceneMode.SCENE3D,
        terrainProvider: Cesium.createWorldTerrain({
            requestVertexNormals: true,
            requestWaterMask: true
        }),
        // imageryProvider: new Cesium.TileMapServiceImageryProvider({
        //     url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
        // }),
        baseLayerPicker: false, geocoder: false, homeButton: false, infoBox: false,
        navigationHelpButton: false, sceneModePicker: false, fullscreenButton: false,
    });

    var layers = viewer.scene.imageryLayers;
    // var blackMarble = layers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
    //     url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
    // }));
    console.log(layers._layers[0])
    try{
        layers._layers[0].alpha = 1 // 0.0 is transparent.  1.0 is opaque.
    }catch(err){
        console.error(err)
    }

    function setViewerWindowSettings() {
        viewer.scene.globe.enableLighting = false;
        //Hide UI elements 
        viewer.animation.container.style.visibility = 'hidden';
        viewer.timeline.container.style.visibility = 'hidden';
        viewer.forceResize();
    }

    function addSatelliteEntity(position) {
        const pointPosition = new Cesium.Cartesian3.fromRadians(
            position.longitude, position.latitude, position.height * heightBuffer
        );

        const xOffset = -1200000;
        const yOffset = -700000;
        const zOffset = 600000;

        const satellite = viewer.entities.add({
            position: pointPosition,
            model: {
                uri: '/assets/models/ISS.glb',
                minimumPixelSize: 8000,
                maximumScale: 8000,
            },
            viewFrom: new Cesium.Cartesian3(xOffset, yOffset, zOffset),
        });

        return satellite;
    }

    function setCameraView(position) {
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
                position.longitude,
                position.latitude,
                cameraHeight
            )
        });
    }


    function setTileProgressEvent() {
        // Wait for globe to load then zoom out     
        let initialized = false;
        viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
            if (!initialized && viewer.scene.globe.tilesLoaded === true) {
                // viewer.clock.shouldAnimate = true;
                initialized = true;
                //viewer.scene.camera.zoomOut(7000000);
                removeLoadingSpinner()
            }
        });
    }

    function setSatellitePositionInterval() {
        window.setInterval(function () {
            updatePosition(satellite, data)
        }, 100);
    }

    const position = getPosition(data.line1.trim(), data.line2.trim())
    const satellite = addSatelliteEntity(position);
    setViewerWindowSettings()
    setCameraView(position)
    setTileProgressEvent()
    setSatellitePositionInterval()
    configureControls(viewer, satellite);
}

/**
 * 
 * @param {*} currentPoint 
 * @param {*} data 
 */
function updatePosition(currentPoint, data) {
    var position = getPosition(data.line1.trim(), data.line2.trim())
    var pointPosition = new Cesium.Cartesian3.fromRadians(
        position.longitude, position.latitude, position.height * heightBuffer
    )
    currentPoint.position = pointPosition;

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

    const positionAndVelocity = satellite.propagate(satrec, new Date());
    const gmst = satellite.gstime(new Date());
    const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

    return {
        longitude: position.longitude,
        latitude: position.latitude,
        height: position.height,
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

export { cameraHeight };