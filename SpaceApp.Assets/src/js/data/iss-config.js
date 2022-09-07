const viewerConfig = {}
Object.defineProperties(viewerConfig, {
    shouldAnimate: {
        value: true,
        writable: false,
    },
    debug: {
        value: false,
        writable: false,
    },
    showAxis: {
        value: false,
        writable: false,
    },
    showTimeline: {
        value: 'hidden',
        writable: false,
    },
    showAnimationController: {
        value: 'hidden',
        writable: false,
    },
    showSkyAtmosphere: {
        value: false,
        writable: false,
    },
    enableLighting: {
        value: false,
        writable: false,
    },
    showSelectionIndicator: {
        value: 'hidden',
        writable: false,
    },
    useBrowserRecommendedResolution: {
        value: false,
        writable: false,
    }
});

const globeConfig = {}
Object.defineProperties(globeConfig, {
    //globe view zoom settings
    globeMinimumZoomDistance: {
        value: 250000,
        writable: false,
    },
    globeMaximumZoomDistance: {
        value: 20000000,
        writable: false,
    },
    globeMinimumZoomRate: {
        value: 350000,
        writable: false,
    },
    columbusViewMinimumZoomDistance: {
        value: 250000,
        writable: false,
    },
    columbusViewMaximumZoomDistance: {
        value: 40000000,
        writable: false,
    },
    columbusViewMinimumZoomRate: {
        value: 350000,
        writable: false,
    },
    flatViewMinimumZoomDistance: {
        value: 250000,
        writable: false,
    },
    flatViewMaximumZoomDistance: {
        value: Infinity,
        writable: false,
    },
    //camera animation settings
    flyToDurationGlobeView: {
        value: 5,
        writable: false,
    },
    flyToDuration2DView: {
        value: 2,
        writable: false,
    },
    flyToDurationColumbusView: {
        value: 2,
        writable: false,
    },
    flyToDurationReset: {
        value: 0,
        writable: false,
    },
    flyToDurationCurrentLocation: {
        value: 3,
        writable: false,
    },
    //camera settings
    cameraHeight: {
        value: 20203203,
        writable: false,
    },
    //refresh
    reloadTimeout: {
        value: 6000,
        writable: false,
    },
});

const cityNamesLabelStyle = {}
Object.defineProperties(cityNamesLabelStyle, {
    //label settings
    font: {
        value: '31px sans-serif',
        writable: false,
        enumerable: true,
    },
    fillColor: {
        value: Cesium.Color.WHITE,
        writable: false,
        enumerable: true,
    },
    outlineWidth: {
        value: 2,
        writable: false,
        enumerable: true,
    },
    outlineColor: {
        value: Cesium.Color.BLACK,
        writable: false,
        enumerable: true,
    },
    style: {
        value: Cesium.LabelStyle.FILL_AND_OUTLINE,
        writable: false,
        enumerable: true,
    },
    scale: {
        value: 0.5,
        writable: false,
        enumerable: true,
    },
});

export { viewerConfig, globeConfig, cityNamesLabelStyle }