// import api from './api/fetch-api';

// api.makeApiCall("NearEarthObjects", renderAsteroidTable);

// function renderAsteroidTable(data) {
//     if (data) {
//         console.log(data)
//         const asteroids = data;

//         if (asteroids) {
//             asteroids.forEach(asteroid => {
//                 //generateMarkup(asteroid)
//                 generateAsteroidModel()
//             });
//         }
//     }
// }

// function generateMarkup(asteroid) {
//     if (asteroid) {
//         const name = asteroid.name ? asteroid.name : '';
//         const hazardous = asteroid["is_potentially_hazardous_asteroid"] ? asteroid["is_potentially_hazardous_asteroid"] : '';
//         console.log(name)

//     }
// }

// // const viz = new Spacekit.Simulation(document.getElementById('main-container'), {
// //     basePath: 'https://typpo.github.io/spacekit/src',
// // });

// // // Create a background 
// // viz.createSkybox(Spacekit.SkyboxPresets.NASA_TYCHO);

// // // Create our first object - the sun - using a preset space object.
// // viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);

// // // Then add some planets
// // viz.createObject('mercury', Spacekit.SpaceObjectPresets.MERCURY);
// // viz.createObject('venus', Spacekit.SpaceObjectPresets.VENUS);
// // // viz.createObject('earth', Spacekit.SpaceObjectPresets.EARTH);


// // viz.createObject('mars', Spacekit.SpaceObjectPresets.MARS);
// // viz.createObject('jupiter', Spacekit.SpaceObjectPresets.JUPITER);
// // viz.createObject('saturn', Spacekit.SpaceObjectPresets.SATURN);
// // viz.createObject('uranus', Spacekit.SpaceObjectPresets.URANUS);
// // viz.createObject('neptune', Spacekit.SpaceObjectPresets.NEPTUNE);

// // const earth = viz.createObject('earth', {
// //     labelText: 'Earth',
// //     ephem: Spacekit.SpaceObjectPresets.EARTH.ephem,
// //     textureUrl: Spacekit.SpaceObjectPresets.EARTH.textureUrl,
// //     rotation: {
// //         speed: -1,
// //       },
// // });


// // console.log(Spacekit.SpaceObjectPresets.EARTH)

// // viz.createObject('spaceman', {
// //     labelText: '523808 (2007 ML24)',
// //     ephem: new Spacekit.Ephem({
// //         // These parameters define orbit shape.
// //         a: .758624972466197, //semi_major_axis
// //         e: .3586130156934444, //eccentricity
// //         i: 33.43752567920985, //inclination

// //         // These parameters define the orientation of the orbit.
// //         om: 281.8812466845817, //ascending_node_longitude
// //         w: 201.4705339910219, //perihelion_argument
// //         ma: 26.53022026723202,

// //         // Where the object is in its orbit.
// //         epoch: 2459600.5,
// //     }, 'deg'),
// // });