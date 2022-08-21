//Geo location
const geolocationErrorCodes = {}
Object.defineProperties(geolocationErrorCodes, {
    permissionDenied: {
        value: 1,
        writable: false,
    },
    positionUnavailable: {
        value: 2,
        writable: false,
    },
    timeOut: {
        value: 3,
        writable: false,
    }
})

//Next enum
const scenes = {}

Object.defineProperties(scenes, {
    columbusView: {
        value: 1,
        writable: false,
    },
    flatView: {
        value: 2,
        writable: false,
    },
    globe: {
        value: 3,
        writable: false,
    }
})
export { geolocationErrorCodes, scenes }