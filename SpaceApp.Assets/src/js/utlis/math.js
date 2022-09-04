const mathOperation = {}
/**
 * //to convert to speed = pythag theorom: https://github.com/shashwatak/satellite-js/issues/29
 * Km/s -> km/h -> mph
 * 1km/s = 3600 km/h
 * 1km/h = 0.621371 mph
 * 1km/s = 2236.94 mph
 * @param {*} x 
 * @param {*} y 
 * @param {*} z 
 */
mathOperation.convertVectorToSpeed = function (x, y, z) {
    const mPerHourInKmPerSec = 2236.9362920544;
    const kmPerSec = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2))
    return kmPerSec * mPerHourInKmPerSec;
}

export { mathOperation}