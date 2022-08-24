import { geolocationErrorCodes } from '../data/enums';

export function applyFullscreen(element) {
    if (document.fullscreenElement == null) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { /* Safari */
            element.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        }
    }
}

export function requestGeolocation(successCallback, errorCallback) {
    const options = {
        enableHighAccuracy: true,
        maximumAge: 1000 * 60 * 60 * 24, //how long to cache position data for - cache for 1 day
        timeout: 27000
    }

    if (navigator && 'geolocation' in navigator && navigator.geolocation) {
        try {
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
        } catch (error) {
            console.error(error);
        }
    }
}

export function geolocationApiBrowserSupport() {
    return navigator.geolocation;
}

export function handleErrorCallback(error, errorNotificationCallback, container) {
    if (error != null && error.code != null && errorNotificationCallback && container) {
        
        switch (error.code) {
            case geolocationErrorCodes.permissionDenied:
                errorNotificationCallback("geolocationDisabled", container)
                break;
            case geolocationErrorCodes.positionUnavailable:
                errorNotificationCallback("geolocationUnavailable", container)
                break;
            case geolocationErrorCodes.timeOut:
                errorNotificationCallback("geolocationTimeout", container)
                break;
            default:
                errorNotificationCallback("geolocationDefault", container)
                break;
        }
    }
}