import api from './api/fetch-api';
import planets from './data/milkyway';
import addTabsEventListeners from './ui-functionality/tabs';

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
        renderAsteroidTitle(asteroid);
    }
}

function generateSpaceModel(asteroid) {
    // Init object to main container
    const viz = new Spacekit.Simulation(document.querySelector('.space-viewer'), {
        basePath: 'https://typpo.github.io/spacekit/src',
        unitsPerAu: 5.0,
        jd: 2443568.0,
        jdPerSecond: 20,
        camera: {
            enableDrift: true,
        },
    });

    // Create a background 
    viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);

    // Create our first object - the sun - using a preset space object.
    viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);

    //create solar system objects
    planets.forEach(planet => {
        viz.createObject(
            planet,
            Object.assign(Spacekit.SpaceObjectPresets[planet.toLocaleUpperCase()], {
                labelText: planet.charAt(0).toUpperCase() + planet.slice(1),
            }),
        );
    })

    const label = asteroid.name;
    const orbitalData = asteroid["orbital_data"];

    if (label && orbitalData) {
        const eccentricity = parseFloat(orbitalData["eccentricity"]);
        const semiMajorAxis = parseFloat(orbitalData["semi_major_axis"]);
        const inclination = parseFloat(orbitalData["inclination"]);
        const ascendingNodeLongitude = parseFloat(orbitalData["ascending_node_longitude"]);
        const perihelionArguement = parseFloat(orbitalData["perihelion_argument"]);
        const meanAnomaly = parseFloat(orbitalData["mean_anomaly"]);
        const epochOsculation = parseFloat(orbitalData["epoch_osculation"]);

        let asteroidObject = null;

        try {
            asteroidObject = viz.createObject('spaceman', {
                labelText: label,
                ecliptic: {
                    displayLines: true,
                    lineColor: 0xff0000,
                },
                ephem: new Spacekit.Ephem(
                    {
                        a: semiMajorAxis,
                        e: eccentricity,
                        i: inclination,

                        om: ascendingNodeLongitude,
                        w: perihelionArguement,
                        ma: meanAnomaly,

                        epoch: epochOsculation,
                    },
                    'deg',
                ),
                particleSize: 20,
            });

            if (asteroidObject) {
                //viz.getViewer().followObject(asteroidObject, [-0.01, -0.01, 0.01]);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function renderAsteroidTitle(asteroid) {
    const pageTitle = document.querySelector('h1.page-title');
    const asteroidName = asteroid.name;

    if (pageTitle && asteroidName) {
        pageTitle.insertAdjacentText("beforeend", asteroidName);
    }
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
        <li class="nav-item">
            <a data-tabs-source="miscellaneous-data" class="nav-link">
                <i class="mdi mdi-account-circle d-lg-none d-block mr-1"></i>
                <span class="d-none d-lg-block">Miscellaneous Data</span>
            </a>
        </li>
    `;
}

function generateTables(asteroid) {
    let markup = '';

    //Orbital Data table
    const orbitalData = asteroid["orbital_data"]
    if (orbitalData) {
        markup += generateOrbitParamTable(orbitalData);
    }

    //Physical Data table
    const absoluteMagnitudeH = asteroid["absolute_magnitude_h"]
    const estimatedDiameter = asteroid["estimated_diameter"]
    if (absoluteMagnitudeH && estimatedDiameter) {
        markup += generatePhysicalParamsTable({ 'absolute_magnitude_h': absoluteMagnitudeH, 'estimated_diameter': estimatedDiameter })
    }

    //Close Approach Data table
    const closeApproachData = asteroid["close_approach_data"] ? asteroid["close_approach_data"] : null;
    if (closeApproachData) {
        markup += generateCloseApproachTable(closeApproachData);
    }

    //Miscellaneous Data table is_sentry_object
    const isHazardous = asteroid["is_potentially_hazardous_asteroid"]
    const isSentryObject = asteroid["is_sentry_object"]

    if (isHazardous != null && isSentryObject != null && orbitalData) {
        markup += generateMiscTable({ 'is_potentially_hazardous_asteroid': isHazardous, 'is_sentry_object': isSentryObject, 'orbital_data': orbitalData });
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

function generateMiscTable(miscData) {
    let markup = ''

    const isHazardous = miscData["is_potentially_hazardous_asteroid"];
    const isSentryObject = miscData["is_sentry_object"];

    const orbitalData = miscData["orbital_data"];
    const orbitDeterminationDate = orbitalData["orbit_determination_date"]
    const firstDeterminationDate = orbitalData["first_observation_date"]
    const lastObservationDate = orbitalData["last_observation_date"]
    const dataArcInDays = orbitalData["data_arc_in_days"]
    const observationsUsed = orbitalData["observations_used"]
    const orbitUncertainty = orbitalData["orbit_uncertainty"]
    const minimumOrbitIntersection = orbitalData["minimum_orbit_intersection"]
    const jupiterTisserandInvariant = orbitalData["jupiter_tisserand_invariant"]
    const equinox = orbitalData["equinox"]
    const orbitClassType = orbitalData["orbit_class"]?.["orbit_class_type"]
    const orbitClassDescription = orbitalData["orbit_class"]?.["orbit_class_description"]
    const orbitClassRange = orbitalData["orbit_class"]?.["orbit_class_range"]

    if (orbitDeterminationDate && firstDeterminationDate && lastObservationDate && dataArcInDays && observationsUsed
        && orbitUncertainty && minimumOrbitIntersection && jupiterTisserandInvariant
        && orbitClassType && orbitClassDescription && orbitClassRange) {

        markup += `
            <div class="tab-pane" data-tabs-target="miscellaneous-data">
                <table class="table mb-0">
                    <thead>
                        <tr>
                            <th class="border-top-0" scope="col">Element</th>
                            <th class="border-top-0" scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">Is Potentially Hazardous Asteroid</th>
                        <td>${isHazardous}</td>
                    </tr>
                    <tr>
                    <th scope="row">Is Sentry Object</th>
                        <td>${isSentryObject}</td>
                    </tr>
                    <tr>
                       <th scope="row">Orbit Class Type</th>
                       <td>${orbitClassType}</td>
                    </tr>
                    <tr>
                       <th scope="row">Orbit Class Description</th>
                       <td>${orbitClassDescription}</td>
                    </tr>
                    <tr>
                       <th scope="row">Orbit Class Range</th>
                       <td>${orbitClassRange}</td>
                    </tr>
                    <tr>
                       <th scope="row">Orbit Determination Date</th>
                       <td>${orbitDeterminationDate}</td>
                    </tr>
                    <tr>
                       <th scope="row">First Determination Date</th>
                       <td>${firstDeterminationDate}</td>
                    </tr>
                    <tr>
                       <th scope="row">Last Observation Date</th>
                       <td>${lastObservationDate}</td>
                    </tr>
                    <tr>
                       <th scope="row">Data Arc In Days</th>
                       <td>${dataArcInDays}</td>
                    </tr>
                    <tr>
                       <th scope="row">Observations Used</th>
                       <td>${observationsUsed}</td>
                    </tr>
                    <tr>
                       <th scope="row">Orbit Uncertainty</th>
                       <td>${orbitUncertainty}</td>
                    </tr>
                    <tr>
                       <th scope="row">Minimum Orbit Intersection</th>
                       <td>${minimumOrbitIntersection}</td>
                    </tr>
                    <tr>
                       <th scope="row">Jupiter Tisser and Invariant</th>
                       <td>${jupiterTisserandInvariant}</td>
                    </tr>
                    <tr>
                       <th scope="row">Equinox</th>
                       <td>${equinox}</td>
                    </tr>
                 </tbody>
                </table>
            </div>
            `;
    }

    return markup;
}