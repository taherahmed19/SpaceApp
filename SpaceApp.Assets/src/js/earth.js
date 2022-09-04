import api from './api/fetch-api';
import configureControls from './ui-functionality/iss-space-viewer-controls'
import { showInfoNotification } from './ui-functionality/notifications';
import { viewerConfig, globeConfig } from './data/iss-config';
import { additionalDetails } from './ui-functionality/iss-space-viewer-details';
import { mathOperation } from './utlis/math';

//move to iss-config
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
    const clock = viewer.clock;
    const heightBuffer = 1000;

    function setViewerWindowSettings() {
        scene.skyAtmosphere.show = viewerConfig.showSkyAtmosphere;
        scene.globe.enableLighting = viewerConfig.enableLighting;
        viewer.animation.container.style.visibility = viewerConfig.showAnimationController;
        viewer.timeline.container.style.visibility = viewerConfig.showTimeline;
        viewer.useBrowserRecommendedResolution = viewerConfig.useBrowserRecommendedResolution;
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.selectionIndicator.viewModel.selectionIndicatorElement.style.visibility = viewerConfig.showSelectionIndicator;
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
        clock.startTime = start.clone();
        clock.stopTime = stop.clone();
        clock.currentTime = start.clone();
        viewer.timeline.zoomTo(start, stop);
        clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER; //set clock in real-time

        const positionsOverTime = new Cesium.SampledPositionProperty();
        const speedOverTime = new Cesium.SampledProperty(Number);

        for (let i = 0; i < totalSeconds; i += timestepInSeconds) {
            const time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            const jsDate = Cesium.JulianDate.toDate(time);

            const positionAndVelocity = satellite.propagate(satrec, jsDate);
            const gmst = satellite.gstime(jsDate);
            const p = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

            // const km = Math.sqrt(Math.pow(positionAndVelocity.velocity.x, 2) + Math.pow(positionAndVelocity.velocity.y, 2) + Math.pow(positionAndVelocity.velocity.z, 2))
            // const speed = km * 2236.9362920544

            const speed = mathOperation.convertVectorToSpeed(
                positionAndVelocity.velocity.x,
                positionAndVelocity.velocity.y,
                positionAndVelocity.velocity.z)

            const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000);
            positionsOverTime.addSample(time, position);
            speedOverTime.addSample(time, speed)
        }

        return { positionsOverTime: positionsOverTime, speedOverTime: speedOverTime }
    }

    function addSatelliteEntity(entityPosition) {
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
            orientation: new Cesium.VelocityOrientationProperty(entityPosition) //https://cesium.com/learn/cesiumjs/ref-doc/VelocityOrientationProperty.html
        });

        return satelliteEntity;
    }

    function subscribleOnTickListener(speedOverTime) {
        const onTickListener = clock.onTick.addEventListener(function (clock) {
            const currentTime = clock.currentTime;

            if (additionalDetails.hasOwnProperty('configureTime')) additionalDetails.configureTime(currentTime)

            if (currentTime.equals(clock.stopTime)) {
                onTickListener()
                viewer.entities.removeAll();
                showInfoNotification("dataRefresh", cesiumContainer)
            }

            const speed = speedOverTime.getValue(currentTime);
            console.log(speed)
        });
    }
    function setCameraView(position) {
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
                position.current.longitude,
                position.current.latitude,
                globeConfig.cameraHeight
            )
        });
    }

    function setTileProgressEvent() {
        // Wait for globe to load then zoom out     
        let initialized = false;
        scene.globe.tileLoadProgressEvent.addEventListener(() => {
            if (!initialized && scene.globe.tilesLoaded === true) {
                clock.shouldAnimate = viewerConfig.shouldAnimate;
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

    const entityPosition = interpolatePositions(data.line1.trim(), data.line2.trim())
    const satelliteEntity = addSatelliteEntity(entityPosition.positionsOverTime);

    subscribleOnTickListener(entityPosition.speedOverTime)
    setViewerWindowSettings()
    setGlobeTextureSettings()
    setCameraView(position)
    setTileProgressEvent()
    setZoomSettings(scene, globeConfig.globeMinimumZoomDistance, globeConfig.globeMaximumZoomDistance, globeConfig.globeMinimumZoomRate)
    renderAxis(viewerConfig.showAxis, position)

    //UI elements
    configureControls(viewer, scene, clock, satelliteEntity);
    if (additionalDetails.hasOwnProperty('configureCoordinates')) additionalDetails.configureCoordinates(clock, satelliteEntity)
    if (additionalDetails.hasOwnProperty('configureDetails')) additionalDetails.configureDetails()
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

export { setZoomSettings };