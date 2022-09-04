import api from './api/fetch-api';
import configureControls from './ui-functionality/iss-space-viewer-controls'
import { showInfoNotification } from './ui-functionality/notifications';
import { viewerConfig, globeConfig } from './data/iss-config';
import additionalDetails from './ui-functionality/iss-space-viewer-details';
import mathOperations from './utlis/math';

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

    function setViewerWindowSettings() {
        scene.skyAtmosphere.show = viewerConfig.showSkyAtmosphere;
        scene.globe.enableLighting = viewerConfig.enableLighting;
        viewer.animation.container.style.visibility = viewerConfig.showAnimationController;
        viewer.timeline.container.style.visibility = viewerConfig.showTimeline;
        viewer.useBrowserRecommendedResolution = viewerConfig.useBrowserRecommendedResolution;
        viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        viewer.selectionIndicator.viewModel.selectionIndicatorElement.style.visibility = viewerConfig.showSelectionIndicator;
        viewer.forceResize();
        clock.shouldAnimate = viewerConfig.shouldAnimate;
    }

    function setGlobeTextureSettings() {
        const layers = scene.imageryLayers;
        const imageLayer = layers._layers[0];
        imageLayer.brightness = 0.6;
    }

    function interpolatePositionsAndVelocity(tleLine1, tleLine2) {
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

            const speed = mathOperations.convertVectorToSpeed(
                positionAndVelocity.velocity.x,
                positionAndVelocity.velocity.y,
                positionAndVelocity.velocity.z)

            const position = Cesium.Cartesian3.fromRadians(p.longitude, p.latitude, p.height * 1000); //height in km

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

    function subscribleOnTickListener() {
        const onTickListener = clock.onTick.addEventListener(function (clock) {
            const currentTime = clock.currentTime;

            if (additionalDetails.hasOwnProperty('configureTime')) additionalDetails.configureTime(currentTime)

            if (currentTime.equals(clock.stopTime)) {
                onTickListener()
                viewer.entities.removeAll();
                showInfoNotification("dataRefresh", cesiumContainer)
            }
        });
    }

    function setCameraView(position) {
        viewer.camera.setView({
            destination: Cesium.Cartesian3.fromRadians(
                position.longitude,
                position.latitude,
                globeConfig.cameraHeight
            )
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
                position.longitude, position.latitude, globeConfig.height
            );

            const frame = Cesium.Transforms.headingPitchRollToFixedFrame(pointPosition, hpr);
            viewer.scene.primitives.add(new Cesium.DebugModelMatrixPrimitive({
                modelMatrix: frame,
                length: 800000,
                width: 3.0
            }));
        }
    }

    function setTileLoadProgressEvent() {
        // Wait for globe to load then execute function 
        let initialized = false;
        scene.globe.tileLoadProgressEvent.addEventListener(() => {
            if (!initialized && scene.globe.tilesLoaded === true) {
                initialized = true;

                const positionsAndVelocity = interpolatePositionsAndVelocity(data.line1.trim(), data.line2.trim())

                const positionsOvertime = positionsAndVelocity.positionsOverTime;
                const speedOverTime = positionsAndVelocity.speedOverTime;

                const satelliteEntity = addSatelliteEntity(positionsOvertime);

                const currentTime = clock.currentTime;
                const initialPosition = Cesium.Cartographic.fromCartesian(satelliteEntity.position.getValue(currentTime));

                subscribleOnTickListener()
                setViewerWindowSettings()
                setGlobeTextureSettings()
                setCameraView(initialPosition)

                setZoomSettings(scene, globeConfig.globeMinimumZoomDistance, globeConfig.globeMaximumZoomDistance, globeConfig.globeMinimumZoomRate)
                renderAxis(viewerConfig.showAxis, initialPosition)

                //UI elements
                configureControls(viewer, scene, clock, satelliteEntity);
                if (additionalDetails.hasOwnProperty('configureCoordinates')) additionalDetails.configureCoordinates(clock, satelliteEntity)
                if (additionalDetails.hasOwnProperty('configureDetails')) additionalDetails.configureDetails()
                if (additionalDetails.hasOwnProperty('configureVelocityAltitude')) additionalDetails.configureVelocityAltitude(clock, speedOverTime)

                removeLoadingSpinner()
                showCesiumContainer()
            }
        });
    }

    setTileLoadProgressEvent()
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
 */
function removeLoadingSpinner() {
    const loadingSpinner = document.querySelector(".loading-spinner");

    if (loadingSpinner && cesiumContainer) {
        loadingSpinner.style.display = "none";
    }
}

function showCesiumContainer(){
    const cesiumContainerWrapper = document.querySelector(".cesiumContainer-wrapper");
    const cesiumViewer = document.querySelector(".cesium-viewer");

    if(cesiumContainerWrapper && cesiumViewer){
        cesiumContainerWrapper.classList.remove("invisible")
        cesiumViewer.style.visibility = "visible"
    }
}

export { setZoomSettings };