import api from './api/fetch-api';
import addSolarSystemObjects from './milkyway';
import { asteroidTableData } from './data/asteroid';
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
        appendApiDateToObject(asteroid);
        renderDetailsTableMarkup();
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

function appendApiDateToObject(asteroid) {
    const orbitalData = asteroid["orbital_data"] ? asteroid["orbital_data"] : null;

    if (orbitalData) {
        const eccentricity = orbitalData["eccentricity"];
        const semiMajorAxis = orbitalData["semi_major_axis"];
        const perihelionDistance = orbitalData["perihelion_distance"];
        const inclination = orbitalData["inclination"];
        const ascendingNodeLongitude = orbitalData["ascending_node_longitude"];
        const meanAnomaly = orbitalData["mean_anomaly"];
        const perihelionTime = orbitalData["perihelion_time"];
        const orbitalPeriod = orbitalData["orbital_period"];
        const aphelionDistance = orbitalData["aphelion_distance"];

        let orbitParameters = asteroidTableData.find(item => { return item.name == "Orbit Parameters" });

        orbitParameters.rows[0]["eccentricity"].value = eccentricity;
        orbitParameters.rows[1]["semiMajorAxis"].value = semiMajorAxis;
        orbitParameters.rows[2]["perihelionDistance"].value = perihelionDistance;
        orbitParameters.rows[3]["inclination"].value = inclination;
        orbitParameters.rows[4]["ascendingNodeLongitude"].value = ascendingNodeLongitude;
        orbitParameters.rows[5]["meanAnomaly"].value = meanAnomaly;
        orbitParameters.rows[6]["timeOfPerihelionPassage"].value = perihelionTime;
        orbitParameters.rows[7]["siderealOrbitalPeriod"].value = orbitalPeriod;
        orbitParameters.rows[8]["meanMotion"].value = eccentricity;
        orbitParameters.rows[9]["aphelionDistance"].value = aphelionDistance;
    }

    const absoluteMagnitudeH = asteroid["absolute_magnitude_h"] ? asteroid["absolute_magnitude_h"] : null;
    const estimatedDiameter = asteroid["estimated_diameter"] ? asteroid["estimated_diameter"] : null;

    if (absoluteMagnitudeH && estimatedDiameter) {
        const estimatedDiameterMinKm = estimatedDiameter.kilometers?.estimated_diameter_min;
        const estimatedDiameterMaxKm = estimatedDiameter.kilometers?.estimated_diameter_max;
        const estimatedDiameterMinMeters = estimatedDiameter.meters?.estimated_diameter_min;
        const estimatedDiameterMaxMeters = estimatedDiameter.meters?.estimated_diameter_max;
        const estimatedDiameterMinMiles = estimatedDiameter.miles?.estimated_diameter_min;
        const estimatedDiameterMaxMiles = estimatedDiameter.miles?.estimated_diameter_max;
        const estimatedDiameterMinFeet = estimatedDiameter.feet?.estimated_diameter_min;
        const estimatedDiameterMaxFeet = estimatedDiameter.feet?.estimated_diameter_max;

        let physicalParameters = asteroidTableData.find(item => { return item.name == "Physical Parameters" });

        physicalParameters.rows[0]["absoluteMagnitudeH"].value = absoluteMagnitudeH;
        physicalParameters.rows[1]["estimatedDiameterMinKm"].value = estimatedDiameterMinKm;
        physicalParameters.rows[2]["estimatedDiameterMaxKm"].value = estimatedDiameterMaxKm;
        physicalParameters.rows[3]["estimatedDiameterMinMeters"].value = estimatedDiameterMinMeters;
        physicalParameters.rows[4]["estimatedDiameterMaxMeters"].value = estimatedDiameterMaxMeters;
        physicalParameters.rows[5]["estimatedDiameterMinMiles"].value = estimatedDiameterMinMiles;
        physicalParameters.rows[6]["estimatedDiameterMaxMiles"].value = estimatedDiameterMaxMiles;
        physicalParameters.rows[7]["estimatedDiameterMinFeet"].value = estimatedDiameterMinFeet;
        physicalParameters.rows[8]["estimatedDiameterMaxFeet"].value = estimatedDiameterMaxFeet;

    }
}

function renderDetailsTableMarkup() {
    const asteroidDetails = document.querySelector('#asteroid-details');
    if (asteroidDetails) {
        const tabHeaderMarkup = generateTabs()
        const tableRows = generateTables();

        const markup = `
            <ul class="nav nav-tabs mb-3">
                ${tabHeaderMarkup}
            </ul>
            <div class="tab-content">
                ${tableRows}
            </div>
        `;

        asteroidDetails.insertAdjacentHTML("beforeend", markup);
        addTabsEventListeners();
    }
}

function generateTabs() {
    let markup = '';

    if (asteroidTableData) {
        asteroidTableData.forEach((asteroidItem, index) => {
            if (asteroidItem.name) {
                markup += `
                    <li class="nav-item">
                        <a data-tabs-source="${asteroidItem.name.replaceAll(' ', '-').toLowerCase()}" class="nav-link ${index == 0 ? 'active' : ''}">
                            <i class="mdi mdi-home-variant d-lg-none d-block mr-1"></i>
                            <span class="d-none d-lg-block">${asteroidItem.name}</span>
                        </a>
                    </li>
                    `;
            }
        })
    }

    return markup;
}

function generateTables() {
    let markup = '';

    asteroidTableData.forEach((item, index) => {
        const tableRowHeaders = generateTableRowHeaders(item.headers);
        const tableRows = generateTableRows(item.rows);

        markup += `
        <div class="tab-pane ${index == 0 ? 'active' : ''}" data-tabs-target="${item.name.replaceAll(' ', '-').toLowerCase()}">
            <table class="table mb-0">
                <thead>
                    <tr>
                        ${tableRowHeaders}
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
        `
    });

    return markup;
}

function generateTableRowHeaders(headers) {
    let markup = ``;

    headers.forEach(header => {
        markup += `
            <th class="border-top-0" scope="col">${header}</th>
        `
    });

    return markup;
}

function generateTableRows(rows) {
    let markup = ``;

    rows.forEach(row => {
        for (var key in row) {
            const value = row[key].value;
            const label = row[key].label;

            if (value && label) {
                markup += `<tr>
                    <th scope="row">${label}</th>
                    <td>${value}</td>
                </tr>
                `;
            }
        }
    });

    return markup;
}