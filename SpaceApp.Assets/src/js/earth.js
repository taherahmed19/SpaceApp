import api from './api/fetch-api';
import configureControls from './ui-functionality/iss-space-viewer-controls'
import { showInfoNotification } from './ui-functionality/notifications';
import { config } from './data/iss-config';

//move to iss-config
const heightBuffer = 1000;
const cameraHeight = 20203203;

/**
 * Move to iss-config
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
        scene.skyAtmosphere.show = config.showSkyAtmosphere;
        scene.globe.enableLighting = config.enableLighting;
        viewer.animation.container.style.visibility = config.showAnimationController;
        viewer.timeline.container.style.visibility = config.showTimeline;
        viewer.useBrowserRecommendedResolution = config.useBrowserRecommendedResolution;
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.selectionIndicator.viewModel.selectionIndicatorElement.style.visibility = config.showSelectionIndicator;
        viewer.forceResize();
    }

    function setGlobeTextureSettings() {
        const layers = scene.imageryLayers;
        const imageLayer = layers._layers[0];
        imageLayer.brightness = 0.6;
    }

    function interpolatePositions(tleLine1, tleLine2) {
        const satrec = satellite.twoline2satrec(
            tleLine1,
            tleLine2
        );

        const totalSeconds = 60 * 60 * 6; //6 hours of position data
        const timestepInSeconds = 10;
        const start = Cesium.JulianDate.fromDate(new Date());
        const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.timeline.zoomTo(start, stop);
        viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; //set clock in real-time

        const positionsOverTime = new Cesium.SampledPositionProperty();
        for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
            const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            const jsDate = Cesium.JulianDate.toDate(time);

            const positionAndVelocity = satellite.propagate(satrec, jsDate);
            const gmst = satellite.gstime(jsDate);
            const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

            const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
            positionsOverTime.addSample(time, position);
        }

        return positionsOverTime
    }

    function addSatelliteEntity() {
        const entityPosition = interpolatePositions(data.line1.trim(), data.line2.trim())

        const xOffset = -1200000;
        const yOffset = -600000;
        const zOffset = 950000;

        const satelliteEntity = viewer.entities.add({
            position: entityPosition,
            model: {
                uri: '/assets/models/ISS.glb',
                minimumPixelSize: 8000,
                maximumScale: 8000,
            },
            viewFrom: new Cesium.Cartesian3(xOffset, yOffset, zOffset),
            path: {
                leadTime: 0,
                trailTime: 1000, //in seconds
                width: 10,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    taperPower: 0.95,
                    color: Cesium.Color.CORNFLOWERBLUE,
                }),
                show: false,
            },
        });

        return satelliteEntity;
    }

    function subscribleOnTickListener(satelliteEntity) {
        const onTickListener = viewer.clock.onTick.addEventListener(function (clock) {
            const currentTime = clock.currentTime;

            if (currentTime.equals(viewer.clock.stopTime)) {
                onTickListener()
                viewer.entities.removeAll();
                showInfoNotification("dataRefresh", cesiumContainer)
            } else {
                rotateSatellite(satelliteEntity)
            }
        });
    }

    function rotateSatellite(satelliteEntity) {
        const newTime = Cesium.JulianDate.addSeconds(viewer.clock.currentTime, 1, new Cesium.JulianDate());

        if (satelliteEntity.position.getValue(viewer.clock.currentTime)) {
            const currentSatellitePosition = Cesium.Cartographic.fromCartesian(satelliteEntity.position.getValue(viewer.clock.currentTime))
            const pointPosition = new Cesium.Cartesian3.fromRadians(
                currentSatellitePosition.longitude, currentSatellitePosition.latitude,
                currentSatellitePosition.height * heightBuffer)

            const newPosition = Cesium.Cartographic.fromCartesian(satelliteEntity.position.getValue(newTime))

            const pointX = newPosition.longitude;
            const pointY = newPosition.latitude;

            let posX = Cesium.Math.toDegrees(pointX)
            let posY = Cesium.Math.toDegrees(pointY)
            let satelliteX = Cesium.Math.toDegrees(currentSatellitePosition.longitude)
            let satelliteY = Cesium.Math.toDegrees(currentSatellitePosition.latitude)

            var angle = Math.atan2(posY - satelliteY, posX - satelliteX);
            angle = angle * -1

            satelliteEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(
                pointPosition,
                new Cesium.HeadingPitchRoll(angle, 0, 0))
        }
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
                viewer.clock.shouldAnimate = config.shouldAnimate;
                initialized = true;
                removeLoadingSpinner()
            }
        });
    }

    /**
     * Red = X
     * Green = Y
     * Blue = Z
     * @param {*} show 
     * @param {*} position 
     */
    function renderAxis(show, position) {
        if (show) {
            const hpr = new Cesium.HeadingPitchRoll(0, 0, 0);
            const pointPosition = new Cesium.Cartesian3.fromRadians(
                position.current.longitude, position.current.latitude, position.current.height * heightBuffer
            );

            const frame = Cesium.Transforms.headingPitchRollToFixedFrame(pointPosition, hpr);
            viewer.scene.primitives.add(new Cesium.DebugModelMatrixPrimitive({
                modelMatrix: frame,
                length: 800000,
                width: 3.0
            }));
        }
    }

    const position = getPosition(data.line1.trim(), data.line2.trim())
    const satelliteEntity = addSatelliteEntity(position);
    subscribleOnTickListener(satelliteEntity)
    setViewerWindowSettings()
    setGlobeTextureSettings()
    setCameraView(position)
    setTileProgressEvent()
    setZoomSettings(scene, globeMinimumZoomDistance, globeMaximumZoomDistance, globeMinimumZoomRate)
    configureControls(viewer, scene, satelliteEntity);
    renderAxis(config.showAxis, position)
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
    const timeOfPreviousOrbitPoint = 2;
    previousDateTime.setMinutes(previousDateTime.getMinutes() - timeOfPreviousOrbitPoint);

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