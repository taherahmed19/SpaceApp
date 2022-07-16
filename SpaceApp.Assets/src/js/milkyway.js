export default function addSolarSystemObjects(viz) {
    // Create our first object - the sun - using a preset space object.
    viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);

    // Then add some planets
    viz.createObject('mercury', Spacekit.SpaceObjectPresets.MERCURY);
    viz.createObject('venus', Spacekit.SpaceObjectPresets.VENUS);
    viz.createObject('earth', Spacekit.SpaceObjectPresets.EARTH);
    viz.createObject('mars', Spacekit.SpaceObjectPresets.MARS);
    viz.createObject('jupiter', Spacekit.SpaceObjectPresets.JUPITER);
    viz.createObject('saturn', Spacekit.SpaceObjectPresets.SATURN);
    viz.createObject('uranus', Spacekit.SpaceObjectPresets.URANUS);
    viz.createObject('neptune', Spacekit.SpaceObjectPresets.NEPTUNE);
}