//TODO: Refactor to make object properties read-only
const infoNotifications = {
    fixedCamera: {
        id: "fixedCamera",
        showOnce: true,
        displayed: false,
        message: "Camera is fixed to ISS"
    },
    freeCamera: {
        id: "freeCamera",
        showOnce: true,
        displayed: false,
        message: "Camera reset"
    },
}

const errorNotifications = {
    satelliteAnimationInProgress: {
        id: "satelliteAnimationInProgress",
        showOnce: false,
        displayed: false,
        message: "Cannot click during animation",
    },
    geolocationAnimationInProgress: {
        id: "geolocationAnimationInProgress",
        showOnce: false,
        displayed: false,
        message: "Cannot click during animation",
    },
    geolocationNotSupported: {
        id: "geolocationNotSupported",
        showOnce: false,
        displayed: false,
        message: "Geolocation is not supported. Change browsers.",
    },
    geolocationDisabled: {
        id: "geolocationDisabled",
        showOnce: false,
        displayed: false,
        message: "Geolocation is disabled. Please update browser settings.",
    },
    geolocationUnavailable: {
        id: "geolocationUnavailable",
        showOnce: false,
        displayed: false,
        message: "Geolocation is unavailable. Please try again.",
    },
    geolocationTimeout: {
        id: "geolocationTimeout",
        showOnce: false,
        displayed: false,
        message: "Geolocation request timed out. Please try again later.",
    },
    geolocationDefault: {
        id: "geolocationDefault",
        showOnce: false,
        displayed: false,
        message: "Geolocation error. Please try again later.",
    },
}

export { infoNotifications, errorNotifications }