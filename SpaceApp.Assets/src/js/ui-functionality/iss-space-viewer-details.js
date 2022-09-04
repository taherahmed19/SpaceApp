import mathOperations from "../utlis/math";
import stringOperations from "../utlis/string";

const additionalDetails = {}

const timeElement = document.querySelector('.js-details-time');

if (timeElement) {
    /**
     * 
     * @param {*} currentTime 
     */
    additionalDetails.configureTime = function (currentTime) {
        if (timeElement) {
            const dateTime = Cesium.JulianDate.toDate(currentTime);
            const day = dateTime.getDate().toString().padStart(2, '0');
            const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
            const year = dateTime.getFullYear()

            const hours = dateTime.getHours().toString().padStart(2, '0');
            const minutes = dateTime.getMinutes().toString().padStart(2, '0');
            const seconds = dateTime.getSeconds().toString().padStart(2, '0');

            const date = `${day}/${month}/${year}`;
            const time = `${hours}:${minutes}:${seconds}`

            timeElement.textContent = `${date} ${time}`
        }
    }
}

const latitudeElement = document.querySelector('.js-details-latitude')
const longitudeElement = document.querySelector('.js-details-longitude')
const altitudeElement = document.querySelector('.js-details-altitude')

if (latitudeElement && longitudeElement) {
    /**
     * 7 decimal places for lat/lng is sufficient for coordinates precision. See: https://rapidlasso.com/2019/05/06/how-many-decimal-digits-for-storing-longitude-latitude/
     * @param {*} clock 
     * @param {*} satelliteEntity 
     */
    additionalDetails.configureCoordinates = function (clock, satelliteEntity) {
        setInterval(function () {
            const currentTime = clock.currentTime;
            const position = Cesium.Cartographic.fromCartesian(satelliteEntity.position.getValue(currentTime));
            const latitude = Cesium.Math.toDegrees(position.latitude).toFixed(7);
            const longitude = Cesium.Math.toDegrees(position.longitude).toFixed(7);
            const altitude = mathOperations.convertMetresToMiles(position.height).toFixed(2) // Position returns height in meters

            latitudeElement.textContent = latitude;
            longitudeElement.textContent = longitude;
            altitudeElement.textContent = `${altitude} miles`;
        }, 1500)
    }
}

const velocityElement = document.querySelector('.js-details-velocity');

if (velocityElement) {
    additionalDetails.configureVelocityAltitude = function (clock, speedOverTime) {
        setInterval(function () {
            const currentTime = clock.currentTime;
            const speed = speedOverTime.getValue(currentTime).toFixed(2);

            velocityElement.textContent = `${stringOperations.formatNumber(speed)} mph`;
        }, 2000);
    }
}

const spaceViewerDetails = document.querySelector('.space-viewer-details')
const visibilityButton = document.querySelector('.js-details-visibility')
const detailsContent = document.querySelector('.js-details-content')
const velocityAltitudeContainer = document.querySelector('.js-altitude-velocity')

if (spaceViewerDetails && visibilityButton && detailsContent) {
    /**
     * 
     */
    additionalDetails.configureDetails = function () {
        if (visibilityButton && detailsContent) {
            visibilityButton.addEventListener("click", () => {
                detailsContent.classList.toggle("position-absolute")
                detailsContent.classList.toggle("invisible")
                velocityAltitudeContainer.classList.toggle("invisible")
                spaceViewerDetails.classList.toggle("active")
            })
        }

        //time in orbit
        const orbitTimeElement = document.querySelector('.js-orbit-time');

        if (orbitTimeElement) {
            const initialDate = new Date("1998-11-25")
            const currentDate = new Date()

            const dateDifferenceTime = currentDate.getTime() - initialDate.getTime();
            const dateDifferenceDays = dateDifferenceTime / (1000 * 3600 * 24)

            var years = Math.floor(dateDifferenceDays / 365);
            var days = Math.floor(dateDifferenceDays % 365);

            orbitTimeElement.textContent = `${years} years : ${days} days`
        }
    }
}

export default additionalDetails 