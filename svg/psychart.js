'use strict';

/**
 * Validate
 * @param {string} types A string of characters `ibfnosyu*` that represent the parameters.
 * @param  {...any} args The arguments object or the individual arguments going into the function.
 */
function Validate(types, ...args) {
    // Validate parameters going into this function.
    if (typeof types !== 'string') {
        throw 'Incorrect validation parameter types.';
    }

    // Define functions that check parameter types.
    const TYPEOF = {
        'i': x => typeof x === 'bigint',
        'b': x => typeof x === 'boolean',
        'f': x => typeof x === 'function',
        'n': x => typeof x === 'number',
        'o': x => typeof x === 'object',
        's': x => typeof x === 'string',
        'y': x => typeof x === 'symbol',
        'u': x => typeof x === 'undefined',
        '*': () => true,
    };

    // Capture the name of the calling function.
    const CALLER = new Error().stack.match(/at +[^\(\)]+/gi).slice(1, -1).map(x => x.slice(0, -1)).join(', ');

    // Create the argument list using the parameters or just the arguments object.
    let argList = args;
    if (args.length === 1 && typeof args[0] === 'object' && args[0]['length']) {
        argList = args[0];
    }

    // Verify that the correct number of parameters are inputted.
    if (types.length !== argList.length) {
        throw 'Found ' + (argList.length > types.length ? argList.length - types.length : types.length - argList.length) + ' too ' + (argList.length > types.length ? 'many' : 'few') + ' arguments ' + CALLER + '.';
    }

    // Validate each parameter type.
    for (let i = 0; i < types.length; i++) {
        if (!TYPEOF[types[i]]) {
            throw types[i] + ' is not a valid type.';
        }
        if (!TYPEOF[types[i]](argList[i])) {
            throw TYPEOF[types[i]] + ' failed for parameter ' + (i + 1) + ', ' + (typeof argList[i]) + ' found ' + CALLER + '.';
        }
    }
}

// Generate a psychrometric chart as an svg element.
function Psychart(width, height, unitSystem, db_min, db_max, dp_max, lineColor, textColor) {
    Validate('nnnnnnss', arguments);
    const
        // Define the SVG namespace.
        NS = 'http://www.w3.org/2000/svg',
        // The SVG element on which to draw lines, points, etc.
        chart = document.createElementNS(NS, 'svg'),
        // Import the functionality of Psychrolib.js.
        psychrolib = new Psychrometrics();
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

    /**
     * Label anchor enum type.
     */
    const Anchor = {
        /**
         * Northwest
         */
        NW: 0,
        /**
         * North center
         */
        N: 1,
        /**
         * Northeast
         */
        NE: 2,
        /**
         * East center
         */
        E: 3,
        /**
         * Southeast
         */
        SE: 4,
        /**
         * South center
         */
        S: 5,
        /**
         * Southwest
         */
        SW: 6,
        /**
         * West center
         */
        W: 7,
        /**
         * Center
         */
        C: 8,
    };
    Object.freeze(Anchor);

    // Define the current region.
    let region;

    // Set the chart's viewport size.
    chart.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    /**
     * Normalize the number 'n' between min and max, returns a number [0-1]
     */
    const normalize = (n, min, max) => (n - min) / (max - min);

    /**
     * Expand the normalized number 'n' [0-1] between min and max, returns a number [min-max]
     */
    const expand = (n, min, max) => n * (max - min) + min;

    /**
     * Translate a number 'n' from one number line [min1-max1] to [min2-max2]
     */
    const translate = (n, min1, max1, min2, max2) => expand(normalize(n, min1, max1), min2, max2);

    /**
     * Return a set of cartesian coordinates from a dry bulb and relative humidity.
     */
    const dr2xy = (db, rh) => new Point(
        translate(db, db_min, db_max, padding, width - padding),
        height - translate(dr2psy(db, rh).hr, hr_min, hr_max, padding, height - padding));

    /**
     * Return a set of cartesian coordinates from a dry bulb and wet bulb.
     */
    const dw2xy = (db, wb) => new Point(
        translate(db, db_min, db_max, padding, width - padding),
        height - translate(dw2psy(db, wb).hr, hr_min, hr_max, padding, height - padding));

    /**
     * Return a set of cartesian coordinates from a dry bulb and dew point.
     */
    const dd2xy = (db, dp) => new Point(
        translate(db, db_min, db_max, padding, width - padding),
        height - translate(dd2psy(db, dp).hr, hr_min, hr_max, padding, height - padding));

    /**
     * Return 5 air parameters from a dry bulb and relative humidity.
     */
    const dr2psy = (db, rh) => {
        const psy = psychrolib.CalcPsychrometricsFromRelHum(db, rh, atm);
        return new Psy(db, rh, psy[1], psy[2], psy[0]);
    };

    /**
     * Return 5 air parameters from a dry bulb and wet bulb.
     */
    const dw2psy = (db, wb) => {
        const psy = psychrolib.CalcPsychrometricsFromTWetBulb(db, wb, atm);
        return new Psy(db, psy[2], wb, psy[1], psy[0]);
    };

    /**
     * Return 5 air parameters from a dry bulb and dew point.
     */
    const dd2psy = (db, dp) => {
        const psy = psychrolib.CalcPsychrometricsFromTDewPoint(db, dp, atm);
        return new Psy(db, psy[2], psy[1], dp, psy[0]);
    };

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
    for (let db = db_min; db <= db_max; db += 10) {
        const dbLine = new Line(1);
        // The lower point is on the X-axis (rh = 0%)
        dbLine.addPoint(dr2xy(db, 0));
        // The upper point is on the dew point line (db = dp)
        let upper = dd2xy(db, db);
        // Make sure that the line stays within bounds of the chart
        if (upper.y < padding) {
            upper = new Point(upper.x, padding);
        }
        dbLine.addPoint(upper);
        // Add a label for the constant dry bulb line
        Label(dr2xy(db, 0), Anchor.N, db + '\u00B0' + tempUnit);
    }

    // Draw constant dew point horizontal lines.
    for (let dp = 0; dp <= dp_max; dp += 10) {
        const dpLine = new Line(1);
        // The left point is on the dew point line (db = dp)
        let left = dd2xy(dp, dp);
        // Make sure that the line stays within bounds of the chart
        if (left.x < padding) {
            left = new Point(padding, left.y);
        }
        dpLine.addPoint(left);
        // The right point is at the maximum dry bulb temperature
        dpLine.addPoint(dd2xy(db_max, dp));
        // Add a label for the constant dew point line
        Label(dd2xy(db_max, dp), Anchor.W, dp + '\u00B0' + tempUnit);
    }

    // Draw constant wet bulb diagonal lines.
    for (let wb = db_min; wb < db_max; wb += 10) {
        const wbLine = new Line(1);
        // Dry bulb is always equal or greater than wet bulb.
        for (let db = wb; db <= db_max; db++) {
            wbLine.addPoint(dw2xy(db, wb));
        }
        // Add a label on the saturation line
        Label(dd2xy(wb, wb), Anchor.SE, wb + '\u00B0' + tempUnit);
    }

    // Draw constant relative humidity lines.
    for (let rh = 0; rh <= 100; rh += 10) {
        const rhLine = new Line(1);
        let drawLabel = true;
        // Must iterate through all dry bulb temperatures to calculate each Y-coordinate
        for (let db = db_min; db <= db_max; db++) {
            let pt = dr2xy(db, rh / 100);
            // Stop drawing when the line surpasses the bounds of the chart
            if (pt.y < padding) {
                pt = new Point(pt.x, padding);
                rhLine.addPoint(pt);
                Label(pt, Anchor.S, (rh === 0 || rh === 100) ? '' : rh + '%');
                drawLabel = false;
                break;
            }
            rhLine.addPoint(pt);
        }
        if (drawLabel) {
            Label(dr2xy(db_max, rh / 100), Anchor.NE, (rh === 0 || rh === 100) ? '' : rh + '%');
        }
    }

    /**
     * Plot a point using dry bulb and relative humidity.
     */
    this.plotDbRh = (db, rh) => PlotPoint(dr2xy(db, rh), 5, '#f00');

    /**
     * Plot a point using dry bulb and wet bulb.
     */
    this.plotDbWb = (db, wb) => PlotPoint(dw2xy(db, wb), 5, '#f00');

    /**
     * Plot a point using dry bulb and dew point.
     */
    this.plotDbDp = (db, dp) => PlotPoint(dd2xy(db, dp), 5, '#f00');

    /**
     * Return the SVG element to render to the screen.
     */
    this.el = () => chart;

    /**
     * Represents an (x,y) cartesian coordinate pair.
     */
    function Point(x, y) {
        Validate('nn', arguments);
        this.x = x;
        this.y = y;
        Object.freeze(this);
    }

    /**
     * Represents a single air condition using 5 states.
     */
    function Psy(db, rh, wb, dp, hr) {
        Validate('nnnnn', arguments);
        /**
         * Dew Point
         */
        this.db = db;
        /**
         * Relative Humidity
         */
        this.rh = rh;
        /**
         * Wet Bulb
         */
        this.wb = wb;
        /**
         * Dew Point
         */
        this.dp = dp;
        /**
         * Humidity Ratio
         */
        this.hr = hr;
        Object.freeze(this);
    }

    /**
     * Define a method to dynamically draw a line.
     */
    function Line(weight) {
        Validate('n', arguments);

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
            if (typeof pt.x === 'number' && typeof pt.y === 'number') {
                d += ' ' + pt.x + ',' + pt.y;
                pathElement.setAttribute('d', d);
            } else {
                throw 'Line.addPoint(pt) requires pt.x and pt.y to be numeric values.';
            }
        };
    }

    /**
     * Define a method to plot a point.
     */
    function PlotPoint(c, r, color) {
        Validate('ons', arguments);
        if (!(c instanceof Point)) {
            throw 'Incorrect parameter types in PlotPoint.';
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
    function Region(color, initialPsy) {
        Validate('so', arguments);
        if (!(initialPsy instanceof Psy)) {
            throw 'Expected parameter 2 to be Psy.';
        }

        let d = 'M', psy = initialPsy;

        const addPoint = (pt) => {
            if (typeof pt.x === 'number' && typeof pt.y === 'number') {
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

    /**
     * Define a method to write a label.
     */
    function Label(pt, anchor, text) {
        // Perform some error checking.
        Validate('ons', arguments);
        if (!(pt instanceof Point)) {
            throw 'Incorrect parameter types in PlotPoint.';
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

        const top = () => {
            labelElement.setAttribute('y', pt.y + size / 2);
            labelElement.setAttribute('dominant-baseline', 'hanging');
        };

        const bot = () => {
            labelElement.setAttribute('y', pt.y - size / 2);
            labelElement.setAttribute('dominant-baseline', 'alphabetic');
        };

        const left = () => {
            labelElement.setAttribute('x', pt.x + size / 2);
            labelElement.setAttribute('text-anchor', 'start');
        };

        const right = () => {
            labelElement.setAttribute('x', pt.x - size / 2);
            labelElement.setAttribute('text-anchor', 'end');
        };

        // Move the point anchor if it is not in the center.
        switch (anchor) {
            case (Anchor.NW): {
                top(); left(); break;
            }
            case (Anchor.N): {
                top(); break;
            }
            case (Anchor.NE): {
                top(); right(); break;
            }
            case (Anchor.E): {
                right(); break;
            }
            case (Anchor.SE): {
                bot(); right(); break;
            }
            case (Anchor.S): {
                bot(); break;
            }
            case (Anchor.SW): {
                bot(); left(); break;
            }
            case (Anchor.W): {
                left(); break;
            }
            case (Anchor.C): {
                break;
            }
            default: {
                throw 'Incorrect Anchor type (' + anchor + '). Expected ' + JSON.stringify(Anchor);
            }
        }
    }

    Object.freeze(this);
}
