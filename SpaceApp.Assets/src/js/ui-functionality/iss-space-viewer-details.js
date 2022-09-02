const timeElement = document.querySelector('.js-details-time');
const latitudeElement = document.querySelector('.js-details-latitude')
const longitudeElement = document.querySelector('.js-details-longitude')

const additionalDetails = {}

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

            latitudeElement.textContent = latitude;
            longitudeElement.textContent = longitude;
        }, 1500)
    }
}

additionalDetails.configureDetails = function () {
    const spaceViewerDetails = document.querySelector('.space-viewer-details')
    const visbilityButton = document.querySelector('.js-details-visibility')
    const detailsContent = document.querySelector('.js-details-content')
    
    if (visbilityButton && detailsContent) {
        visbilityButton.addEventListener("click", () => {
            detailsContent.classList.toggle("position-absolute")
            detailsContent.classList.toggle("invisible")
            spaceViewerDetails.classList.toggle("active")
        })
    }
}


export { additionalDetails }