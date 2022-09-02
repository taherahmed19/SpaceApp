const config = {}

Object.defineProperties(config, {
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
        value: 'block',
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

export { config }