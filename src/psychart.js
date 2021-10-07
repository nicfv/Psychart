'use strict';

// Generate a psychrometric chart as an svg element.
export function Psychart(width, height, unitSystem, db_min, db_max, dp_max, lineColor, textColor) {
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
        hr_max = psychrolib.GetHumRatioFromTDewPoint(dp_max, atm),
        // The padding, in px, of the chart
        padding = 30,
        // The temperature unit to display
        tempUnit = psychrolib.isIP() ? 'F' : 'C';

    // Define the current region.
    let region;

    // Set the chart's viewport size.
    chart.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    // Normalize the number 'n' between min and max, returns a number [0-1]
    const normalize = (n, min, max) => (n - min) / (max - min);

    // Expand the normalized number 'n' [0-1] between min and max, returns a number [min-max]
    const expand = (n, min, max) => n * (max - min) + min;

    // Translate a number 'n' from one number line [min1-max1] to [min2-max2]
    const translate = (n, min1, max1, min2, max2) => expand(normalize(n, min1, max1), min2, max2);

    // Return a set of cartesian coordinates from a dry bulb and relative humidity.
    const dr2xy = (db, rh) => { return {
        'x': translate(db, db_min, db_max, padding, width - padding),
        'y': height - translate(dr2psy(db, rh).hr, hr_min, hr_max, padding, height - padding),
    }};

    // Return a set of cartesian coordinates from a dry bulb and wet bulb.
    const dw2xy = (db, wb) => { return {
        'x': translate(db, db_min, db_max, padding, width - padding),
        'y': height - translate(dw2psy(db, wb).hr, hr_min, hr_max, padding, height - padding),
    }};

    // Return a set of cartesian coordinates from a dry bulb and dew point.
    const dd2xy = (db, dp) => { return {
        'x': translate(db, db_min, db_max, padding, width - padding),
        'y': height - translate(dd2psy(db, dp).hr, hr_min, hr_max, padding, height - padding),
    }};

    // Return 5 air parameters from a dry bulb and relative humidity.
    const dr2psy = (db, rh) => {
        const psy = psychrolib.CalcPsychrometricsFromRelHum(db, rh, atm);
        return {
            'db': db,
            'rh': rh,
            'wb': psy[1],
            'dp': psy[2],
            'hr': psy[0],
        }
    };

    // Return 5 air parameters from a dry bulb and wet bulb.
    const dw2psy = (db, wb) => {
        const psy = psychrolib.CalcPsychrometricsFromTWetBulb(db, wb, atm);
        return {
            'db': db,
            'rh': psy[2],
            'wb': wb,
            'dp': psy[1],
            'hr': psy[0],
        }
    };

    // Return 5 air parameters from a dry bulb and dew point.
    const dd2psy = (db, dp) => {
        const psy = psychrolib.CalcPsychrometricsFromTDewPoint(db, dp, atm);
        return {
            'db': db,
            'rh': psy[2],
            'wb': psy[1],
            'dp': dp,
            'hr': psy[0],
        }
    };

    // Return a set of cartesian coordinates from a dry bulb and relative humidity for the shaded region.
    // this.dr2xy = (db, rh) => dr2xy(db, rh);

    // Return a set of cartesian coordinates from a dry bulb and wet bulb for the shaded region.
    // this.dw2xy = (db, wb) => dw2xy(db, wb);

    // Return a set of cartesian coordinates from a dry bulb and dew point for the shaded region.
    // this.dd2xy = (db, dp) => dd2xy(db, dp);

    // Plot a point using dry bulb and relative humidity.
    this.plotDbRh = (db, rh) => Point(dr2xy(db, rh), 5, '#f00');

    // Plot a point using dry bulb and wet bulb.
    this.plotDbWb = (db, wb) => Point(dw2xy(db, wb), 5, '#f00');

    // Plot a point using dry bulb and dew point.
    this.plotDbDp = (db, dp) => Point(dd2xy(db, dp), 5, '#f00');

    // Create a new SVG group for shaded regions.
    const regGroup = document.createElementNS(NS, 'g');
    chart.appendChild(regGroup)

    // Create a new SVG group for axis lines.
    const psyGroup = document.createElementNS(NS, 'g');
    chart.appendChild(psyGroup);

    // Create a new SVG group for labels.
    const txtGroup = document.createElementNS(NS, 'g');
    chart.appendChild(txtGroup);

    // Draw constant dry bulb vertical lines.
    for(let db = db_min; db <= db_max; db += 10) {
        const dbLine = new Line(1);
        // The lower point is on the X-axis (rh = 0%)
        dbLine.addPoint(dr2xy(db, 0));
        // The upper point is on the dew point line (db = dp)
        let upper = dd2xy(db, db);
        // Make sure that the line stays within bounds of the chart
        if(upper.y < padding) {
            upper.y = padding;
        }
        dbLine.addPoint(upper);
        // Add a label for the constant dry bulb line
        Label(dr2xy(db, 0), 'u', db + '\u00B0' + tempUnit);
    }

    // Draw constant dew point horizontal lines.
    for(let dp = 0; dp <= dp_max; dp += 10) {
        const dpLine = new Line(1);
        // The left point is on the dew point line (db = dp)
        let left = dd2xy(dp, dp);
        // Make sure that the line stays within bounds of the chart
        if(left.x < padding) {
            left.x = padding;
        }
        dpLine.addPoint(left);
        // The right point is at the maximum dry bulb temperature
        dpLine.addPoint(dd2xy(db_max, dp));
        // Add a label for the constant dew point line
        Label(dd2xy(db_max, dp), 'l', dp + '\u00B0' + tempUnit);
    }

    // Draw constant wet bulb diagonal lines.
    for(let wb = db_min; wb < db_max; wb += 10) {
        const wbLine = new Line(1);
        // Dry bulb is always equal or greater than wet bulb.
        for(let db = wb; db <= db_max; db++) {
            wbLine.addPoint(dw2xy(db, wb));
        }
        // Add a label on the saturation line
        Label(dd2xy(wb, wb), 'd', wb + '\u00B0' + tempUnit);
    }

    // Draw constant relative humidity lines.
    for(let rh = 0; rh <= 100; rh += 10) {
        const rhLine = new Line(1);
        let drawLabel = true;
        // Must iterate through all dry bulb temperatures to calculate each Y-coordinate
        for(let db = db_min; db <= db_max; db++) {
            let pt = dr2xy(db, rh/100);
            // Stop drawing when the line surpasses the bounds of the chart
            if(pt.y < padding) {
                pt.y = padding;
                rhLine.addPoint(pt);
                Label(pt, 'd', (rh === 0 || rh === 100) ? '' : rh + '%');
                drawLabel = false;
                break;
            }
            rhLine.addPoint(pt);
        }
        if(drawLabel) {
            Label(dr2xy(db_max, rh/100), 'r', (rh === 0 || rh === 100) ? '' : rh + '%');
        }
    }

    // Return the SVG element to render to the screen.
    this.el = () => chart;

    // Define a method to draw a line.
    function Line(weight) {
        // Perform some error checking.
        if(typeof weight !== 'number') {
            throw 'Line(weight: number) has incorrect parameter types.';
        }

        // Define the path element and assign its attributes.
        const pathElement = document.createElementNS(NS, 'path');
        pathElement.setAttribute('fill', 'none');
        pathElement.setAttribute('stroke', lineColor);
        pathElement.setAttribute('stroke-width', weight + 'px');
        pathElement.setAttribute('vector-effect', 'non-scaling-stroke');
        psyGroup.appendChild(pathElement);

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

    // Define a method to plot a point.
    function Point(c, r, color) {
        // Perform some error checking.
        if(typeof c.x !== 'number' || typeof c.y !== 'number' || typeof r !== 'number' || typeof color !== 'string') {
            throw 'Point({ c.x: number, c.y: number }, r: number, color: string) has incorrect parameter types.';
        }

        // Define a 0-length path element and assign its attributes.
        const ptElement = document.createElementNS(NS, 'path');
        ptElement.setAttribute('fill', 'none');
        ptElement.setAttribute('stroke', color);
        ptElement.setAttribute('stroke-width', r + 'px');
        ptElement.setAttribute('stroke-linecap', 'round');
        ptElement.setAttribute('vector-effect', 'non-scaling-stroke');
        ptElement.setAttribute('d', 'M ' + c.x + ',' + c.y + ' h 0');
        psyGroup.appendChild(ptElement);
    }

    // Define a method to plot a shaded region.
    function Region(color) {
        // Perform some error checking.
        if(typeof color !== 'string') {
            throw 'Region(color: string) has incorrect parameter types.';
        }

        let d = 'M', psy = undefined;

        const addPoint = (pt) => {
            if(typeof pt.x === 'number' && typeof pt.y === 'number') {
                d += ' ' + pt.x + ',' + pt.y;
                pathElement.setAttribute('d', d);
            } else {
                throw 'Line.addPoint(pt) requires pt.x and pt.y to be numeric values.';
            }
        };

        this.build = () => {
            // Define a path element for the shaded region.
            const regElement = document.createElementNS(NS, 'path');
            regElement.setAttribute('fill', color);
            regElement.setAttribute('stroke', 'none');
            regElement.setAttribute('d', d + ' z');
            regGroup.appendChild(regElement);
        };
    }

    // Define a method to write a label.
    function Label(pt, anchor, text) {
        // Perform some error checking.
        if(typeof pt.x !== 'number' || typeof pt.y !== 'number' || typeof anchor !== 'string' || typeof text !== 'string') {
            throw 'Label({ pt.x: number, pt.y: number }, anchor: string, text: string) has incorrect parameter types.';
        }

        const size = 12;

        // Define a text element and assign its attributes.
        const labelElement = document.createElementNS(NS, 'text');
        labelElement.setAttribute('fill', textColor);
        labelElement.setAttribute('x', pt.x);
        labelElement.setAttribute('y', pt.y);
        labelElement.setAttribute('font-family', 'sans-serif');
        labelElement.setAttribute('font-size', size + 'px');
        labelElement.setAttribute('text-anchor', 'middle');
        labelElement.setAttribute('dominant-baseline', 'middle');
        labelElement.textContent = text;
        txtGroup.appendChild(labelElement);

        switch (anchor.toLowerCase()) {
            case ('l'): {
                labelElement.setAttribute('x', pt.x + size/2);
                labelElement.setAttribute('text-anchor', 'start');
                break;
            }
            case ('r'): {
                labelElement.setAttribute('x', pt.x - size/2);
                labelElement.setAttribute('text-anchor', 'end');
                break;
            }
            case ('u'): {
                labelElement.setAttribute('y', pt.y + size/2);
                labelElement.setAttribute('dominant-baseline', 'hanging');
                break;
            }
            case ('d'): {
                labelElement.setAttribute('y', pt.y - size/2);
                labelElement.setAttribute('dominant-baseline', 'alphabetic');
                break;
            }
            case ('c'): {
                break;
            }
            default: {
                throw 'anchor should be one of the following: [l, r, u, d, c]';
            }
        }
    }
}
