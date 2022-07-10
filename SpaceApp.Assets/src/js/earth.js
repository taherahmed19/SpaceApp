import api from './api/fetch-api';

const heightBuffer = 1000;

api.makeApiCall("IssTles", renderEarthViewer);

function renderEarthViewer(data) {
    // Initialize the Cesium viewer.
    const viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.TileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII"),
        }),
        baseLayerPicker: true, geocoder: false, homeButton: true, infoBox: false,
        navigationHelpButton: true, sceneModePicker: true, fullscreenButton: false
    });

    viewer.scene.globe.enableLighting = true;
    //Hide UI elements 
    viewer.animation.container.style.visibility = 'hidden';
    viewer.timeline.container.style.visibility = 'hidden';
    viewer.forceResize();

    var position = getPosition(data.line1.trim(), data.line2.trim())
    var pointPosition = new Cesium.Cartesian3.fromRadians(
        position.longitude, position.latitude, position.height * heightBuffer
    );

    // Visualize the satellite at this location with a red dot.
    const point = viewer.entities.add({
        position: pointPosition,
        point: { pixelSize: 10, color: Cesium.Color.RED },
        label : {
            text : 'ISS',
            font : '14pt sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth : 2,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            pixelOffset : new Cesium.Cartesian2(0, -9)
        }
    });

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromRadians(
            position.longitude,
            position.latitude,
            Cesium.Ellipsoid.WGS84.cartesianToCartographic(viewer.camera.position).height
        )
    });

    // Wait for globe to load then zoom out     
    let initialized = false;
    viewer.scene.globe.tileLoadProgressEvent.addEventListener(() => {
        if (!initialized && viewer.scene.globe.tilesLoaded === true) {
            viewer.clock.shouldAnimate = true;
            initialized = true;
            viewer.scene.camera.zoomOut(7000000);
            removeLoadingSpinner()
        }
    });

    window.setInterval(function () {
        updatePosition(point, data)
    }, 1000);
}

function updatePosition(currentPoint, data) {
    var position = getPosition(data.line1.trim(), data.line2.trim())
    var pointPosition = new Cesium.Cartesian3.fromRadians(
        position.longitude, position.latitude, position.height * heightBuffer
    )
    currentPoint.position = pointPosition;
}

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

function removeLoadingSpinner() {
    const loadingSpinner = document.querySelector(".loading-spinner");
    const cesiumContainer = document.querySelector("#cesiumContainer");

    if (loadingSpinner && cesiumContainer) {
        loadingSpinner.style.display = "none";
        cesiumContainer.style.display = "block"
    }

}