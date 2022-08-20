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
    animationInProgress: {
        id: "animationInProgress",
        showOnce: false,
        displayed: false,
        message: "Cannot click during animation",
    },
}

export { infoNotifications, errorNotifications }