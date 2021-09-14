'use strict';

// Generate a psychrometric chart as an svg element.
export function Psychart(width, height, unitSystem, db_min, db_max, dp_max) {
    const
        // Define the SVG namespace.
        NS = 'http://www.w3.org/2000/svg',
        // The SVG element on which to draw lines, points, etc.
        chart = document.createElementNS(NS, 'svg'),
        // Import the functionality of Psychrolib.js.
        psychrolib = require('psychrolib.js');
    // Set the unit system.
    psychrolib.SetUnitSystem(unitSystem);
    const
        // Atmospheric pressure at altitude 0 [ft or m]
        atm = psychrolib.GetStandardAtmPressure(0),
        // Humidity ratio [grains of water per mass of dry air]
        hr_min = 0,
        // Humidity ratio [grains of water per mass of dry air]
        hr_max = psychrolib.GetHumRatioFromTDewPoint(dp_max, atm);

    // Set the chart's viewport size.
    chart.setAttribute('width', width);
    chart.setAttribute('height', height);
    chart.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    // Bound the number 'n' between min and max (inclusive)
    const bound = (n, min, max) => {
        if(typeof n !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
            throw 'Incorrect parameter types for Psychart.bound(n: number, min: number, max: number)';
        }
        if(min > max) { throw 'min cannot be larger than max'; }
        if(n > max) { return max; }
        if(n < min) { return min; }
        return n;
    }

    // Return a set of normalized cartesian coordinates [0-1] from a dry bulb and relative humidity.
    const dr2xy = (db, rh) => { return {
        'x': bound((db - db_min) / (db_max - db_min), 0, 1),
        'y': 1-bound((psychrolib.GetHumRatioFromRelHum(db, rh, atm) - hr_min) / (hr_max - hr_min), 0, 1),
    }};

    // Return a set of normalized cartesian coordinates [0-1] from a dry bulb and wet bulb.
    const dw2xy = (db, wb) => { return {
        'x': bound((db - db_min) / (db_max - db_min), 0, 1),
        'y': 1-bound((psychrolib.GetHumRatioFromTWetBulb(db, wb, atm) - hr_min) / (hr_max - hr_min), 0, 1),
    }};

    // Return a set of normalized cartesian coordinates [0-1] from a dry bulb and dew point.
    const dd2xy = (db, dp) => { return {
        'x': bound((db - db_min) / (db_max - db_min), 0, 1),
        'y': 1-bound((psychrolib.GetHumRatioFromTDewPoint(dp, atm) - hr_min) / (hr_max - hr_min), 0, 1),
    }};

    // Create a new SVG group for axis lines.
    const psyLineGroup = document.createElementNS(NS, 'g');
    psyLineGroup.setAttribute('transform', 'translate(10, 10) scale(' + (width-20) + ',' + (height-20) + ')')
    chart.appendChild(psyLineGroup);

    // Draw constant dry bulb vertical lines.
    for(let db = db_min; db <= db_max; db += 10) {
        const dbLine = new Line(1, '#CCC', psyLineGroup);
        // The lower point is on the X-axis (rh = 0%)
        dbLine.addPoint(dr2xy(db, 0));
        // The upper point is on the dew point line (db = dp)
        dbLine.addPoint(dd2xy(db, db));
    }

    // Draw constant dew point horizontal lines.
    for(let dp = 0; dp <= dp_max; dp += 10) {
        const dpLine = new Line(1, '#CCC', psyLineGroup);
        // The left point is on the dew point line (db = dp)
        dpLine.addPoint(dd2xy(dp, dp));
        // The right point is at the maximum dry bulb temperature
        dpLine.addPoint(dd2xy(db_max, dp));
    }

    // Draw constant wet bulb diagonal lines.
    for(let wb = db_min; wb < db_max; wb += 10) {
        const wbLine = new Line(1, '#CCC', psyLineGroup);
        // Dry bulb is always equal or greater than wet bulb.
        for(let db = wb; db <= db_max; db++) {
            wbLine.addPoint(dw2xy(db, wb));
        }
    }

    // Draw constant relative humidity lines.
    for(let rh = 0; rh <= 100; rh += 20) {
        const rhLine = new Line(1, '#CCC', psyLineGroup);
        // Must iterate through all dry bulb temperatures to calculate each Y-coordinate
        for(let db = db_min; db <= db_max; db++) {
            rhLine.addPoint(dr2xy(db, rh/100));
        }
    }

    // Return the SVG element to render to the screen.
    this.el = () => chart;

    // Define a method to draw a line.
    function Line(weight, color, parent) {
        // Perform some error checking.
        if(typeof weight !== 'number' || typeof color !== 'string' || typeof parent !== 'object') {
            throw 'Line(weight: number, color: string, parent: object) has incorrect parameter types.';
        }

        // Define the path element and assign its attributes.
        const pathElement = document.createElementNS(NS, 'path');
        pathElement.setAttribute('fill', 'none');
        pathElement.setAttribute('stroke', color);
        pathElement.setAttribute('stroke-width', weight + 'px');
        pathElement.setAttribute('vector-effect', 'non-scaling-stroke');
        parent.appendChild(pathElement);

        // This is the collection of (x,y) points that make up this path.
        let d = 'M';

        // Add an (x,y) coordinate pair to the end of this line.
        this.addPoint = (pt) => {
            if(typeof pt.x === 'number' && typeof pt.y === 'number') {
                d += ' ' + pt.x + ',' + pt.y;
                pathElement.setAttribute('d', d);
            } else {
                throw 'Line.addPoint(pt) requires pt.x and pt.y to be numeric values.';
            }
        };
    }
}
