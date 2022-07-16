import api from './api/fetch-api';
import addSolarSystemObjects from './milkyway';
import addTabsEventListeners from './ui-functionality/tabs';
//Make api call for individual asteroid and render 3d model
//Table is rendered through .NET 

renderAsteroid();

function renderAsteroid() {
    const mainContainer = document.querySelector(`[data-id]`);

    if (mainContainer) {
        const asteroidId = mainContainer.dataset.id;

        if (asteroidId) {
            api.makeApiCall("Asteroid", generateAsteroidData, { id: asteroidId }, null);
        }
    }
}

function generateAsteroidData(asteroid) {
    if (asteroid) {
        generateSpaceModel(asteroid);
        renderDetailsTableMarkup(asteroid);
    }
}

function generateSpaceModel(asteroid) {
    // Init object to main container
    const viz = new Spacekit.Simulation(document.getElementById('main-container'), {
        basePath: 'https://typpo.github.io/spacekit/src',
    });

    // Create a background 
    viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);

    addSolarSystemObjects(viz);


    const label = asteroid.name ? asteroid.name : '';

    viz.createObject('spaceman', {
        labelText: label,
        ephem: new Spacekit.Ephem({
            // These parameters define orbit shape.
            a: .758624972466197, //semi_major_axis
            e: .3586130156934444, //eccentricity
            i: 33.43752567920985, //inclination

            // These parameters define the orientation of the orbit.
            om: 281.8812466845817, //ascending_node_longitude
            w: 201.4705339910219, //perihelion_argument
            ma: 26.53022026723202,

            // Where the object is in its orbit.
            epoch: 2459600.5,
        }, 'deg'),
    });
}

function renderDetailsTableMarkup(asteroid) {
    const asteroidDetails = document.querySelector('#asteroid-details');
    if (asteroidDetails) {
        const tabs = generateTabs();
        const tables = generateTables(asteroid);

        const markup = `
            <ul class="nav nav-tabs mb-3">
                ${tabs}
            </ul>
            <div class="tab-content">
                ${tables}
            </div>
        `;

        asteroidDetails.insertAdjacentHTML("beforeend", markup);
        addTabsEventListeners();
    }
}

function generateTabs() {
    return `
        <li class="nav-item">
            <a data-tabs-source="orbit-parameters" class="nav-link active">
                <i class="mdi mdi-home-variant d-lg-none d-block mr-1"></i>
                <span class="d-none d-lg-block">Orbit Parameters</span>
            </a>
        </li>
        <li class="nav-item">
            <a data-tabs-source="physical-parameters" class="nav-link">
                <i class="mdi mdi-account-circle d-lg-none d-block mr-1"></i>
                <span class="d-none d-lg-block">Physical Parameters</span>
            </a>
        </li>
        <li class="nav-item">
            <a data-tabs-source="close-approach-data" class="nav-link">
                <i class="mdi mdi-account-circle d-lg-none d-block mr-1"></i>
                <span class="d-none d-lg-block">Close Approach Data</span>
            </a>
        </li>
    `;
}

function generateTables(asteroid) {
    let markup = '';
    const orbitalData = asteroid["orbital_data"] ? asteroid["orbital_data"] : null;

    if (orbitalData) {
        markup += generateOrbitParamTable(orbitalData);
    }

    const absoluteMagnitudeH = asteroid["absolute_magnitude_h"] ? asteroid["absolute_magnitude_h"] : null;
    const estimatedDiameter = asteroid["estimated_diameter"] ? asteroid["estimated_diameter"] : null;

    if (absoluteMagnitudeH && estimatedDiameter) {
        markup += generatePhysicalParamsTable({ 'absolute_magnitude_h': absoluteMagnitudeH, 'estimated_diameter': estimatedDiameter })
    }

    const closeApproachData = asteroid["close_approach_data"] ? asteroid["close_approach_data"] : null;

    if (closeApproachData) {
        markup += generateCloseApproachTable(closeApproachData);
    }

    return markup;
}

function generateOrbitParamTable(orbitalData) {
    let markup = '';

    const eccentricity = orbitalData["eccentricity"];
    const semiMajorAxis = orbitalData["semi_major_axis"];
    const perihelionDistance = orbitalData["perihelion_distance"];
    const inclination = orbitalData["inclination"];
    const ascendingNodeLongitude = orbitalData["ascending_node_longitude"];
    const meanAnomaly = orbitalData["mean_anomaly"];
    const perihelionTime = orbitalData["perihelion_time"];
    const orbitalPeriod = orbitalData["orbital_period"];
    const meanMotion = orbitalData["mean_motion"];
    const aphelionDistance = orbitalData["aphelion_distance"];

    markup += `
        <div class="tab-pane active" data-tabs-target="orbit-parameters">
            <table class="table mb-0">
                <thead>
                    <tr>
                        <th class="border-top-0" scope="col">Element</th>
                        <th class="border-top-0" scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">Eccentricity</th>
                        <td>${eccentricity}</td>
                    </tr>
                    <tr>
                        <th scope="row">Semi-major axis</th>
                        <td>${semiMajorAxis}</td>
                    </tr>
                    <tr>
                        <th scope="row">Perihelion distance</th>
                        <td>${perihelionDistance}</td>
                    </tr>
                    <tr>
                        <th scope="row">Inclination</th>
                        <td>${inclination}</td>
                    </tr>
                    <tr>
                        <th scope="row">Ascending node longitude</th>
                        <td>${ascendingNodeLongitude}</td>
                    </tr>
                    <tr>
                        <th scope="row">Mean anomaly</th>
                        <td>${meanAnomaly}</td>
                    </tr>
                    <tr>
                        <th scope="row">Time of perihelion passage</th>
                        <td>${perihelionTime}</td>
                    </tr>
                    <tr>
                        <th scope="row">Sidereal orbital period</th>
                        <td>${orbitalPeriod}</td>
                    </tr>
                    <tr>
                        <th scope="row">Mean motion</th>
                        <td>${meanMotion}</td>
                    </tr>
                    <tr>
                        <th scope="row">Aphelion distance</th>
                        <td>${aphelionDistance}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        `;

    return markup;
}

function generatePhysicalParamsTable(physicalData) {
    let markup = '';

    const absoluteMagnitudeH = physicalData["absolute_magnitude_h"];
    const esimatedDiameter = physicalData["estimated_diameter"];
    const estimatedDiameterMinKm = esimatedDiameter?.kilometers?.estimated_diameter_min;
    const estimatedDiameterMaxKm = esimatedDiameter?.kilometers?.estimated_diameter_max;
    const estimatedDiameterMinMeters = esimatedDiameter?.meters?.estimated_diameter_min;
    const estimatedDiameterMaxMeters = esimatedDiameter?.meters?.estimated_diameter_max;
    const estimatedDiameterMinMiles = esimatedDiameter?.miles?.estimated_diameter_min;
    const estimatedDiameterMaxMiles = esimatedDiameter?.miles?.estimated_diameter_max;
    const estimatedDiameterMinFeet = esimatedDiameter?.feet?.estimated_diameter_min;
    const estimatedDiameterMaxFeet = esimatedDiameter?.feet?.estimated_diameter_max;

    markup += `
    <div class="tab-pane" data-tabs-target="physical-parameters">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th class="border-top-0" scope="col">Element</th>
                    <th class="border-top-0" scope="col">Value</th>
                </tr>
            </thead>
            <tbody>
            <tr>
               <th scope="row">Absolute Magnitude [H]</th>
               <td>${absoluteMagnitudeH}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Min (Km)</th>
               <td>${estimatedDiameterMinKm}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Min (Km)</th>
               <td>${estimatedDiameterMaxKm}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Min (M)</th>
               <td>${estimatedDiameterMinMeters}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Max (M)</th>
               <td>${estimatedDiameterMaxMeters}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Min (Mi)</th>
               <td>${estimatedDiameterMinMiles}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Max (Mi)</th>
               <td>${estimatedDiameterMaxMiles}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Min (Ft)</th>
               <td>${estimatedDiameterMinFeet}</td>
            </tr>
            <tr>
               <th scope="row">Estimated Diameter Max (Ft)</th>
               <td>${estimatedDiameterMaxFeet}</td>
            </tr>
         </tbody>
        </table>
    </div>
    `;

    return markup;
}

function generateCloseApproachTable(closeApproachData) {
    let markup = '';

    const rows = generateCloseApproachTableRows(closeApproachData);

    markup += `
    <div class="tab-pane" data-tabs-target="close-approach-data">
        <table class="table mb-0">
            <thead>
                <tr>
                    <th class="border-top-0" scope="col">Close Approach Date</th>
                    <th class="border-top-0" scope="col">Relative Velocity (Km/s)</th>
                    <th class="border-top-0" scope="col">Miss Distance (Km)</th>
                    <th class="border-top-0" scope="col">Orbiting Body</th>
                </tr>
            </thead>
            <tbody>
            ${rows}
         </tbody>
        </table>
    </div>
    `;

    return markup;
}

function generateCloseApproachTableRows(closeApproachData) {
    let markup = '';

    closeApproachData.forEach(item => {
        const closeApproachDate = item["close_approach_date"];
        const velocityKm = item["relative_velocity"]?.["kilometers_per_second"];
        const missDistanceKm = item["miss_distance"]?.["kilometers"];
        const orbitingBody = item["orbiting_body"];

        markup += `
            <tr>
                <td>${closeApproachDate}</td>
                <td>${velocityKm}</td>
                <td>${missDistanceKm}</td>
                <td>${orbitingBody}</td>
            </tr>
        `;
    })

    return markup;
}