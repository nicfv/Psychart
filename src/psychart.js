'use strict';

/**
 * Validate parameter types.
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

/**
 * Generate a psychrometric chart as an svg element.
 */
export function Psychart(width, height, unitSystem, db_min, db_max, dp_max, lineColor, textColor) {
    Validate('nnnnnnss', arguments);
    const
        // Define the SVG namespace.
        NS = 'http://www.w3.org/2000/svg',
        // The resolution of the graph.
        res = 0.1,
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
        tempUnit = '\u00B0' + (psychrolib.isIP() ? 'F' : 'C');

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
    let region = undefined;

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
     * Linearly interpolate a number 'n' from one range [min1-max1] to [min2-max2]
     */
    const translate = (n, min1, max1, min2, max2) => expand(normalize(n, min1, max1), min2, max2);

    /**
     * Check if two numbers 'a' and 'b' are approximately equal eith a maximum error of 'epsilon'.
     */
    const approx = (a, b, epsilon) => a - b < epsilon && b - a < epsilon;

    /**
     * Round the number 'a' to 'd' decimal places.
     */
    const round = (a, d = 0) => Math.round(a * 10 ** d) / (10 ** d);

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
    chart.appendChild(regGroup);

    // Create a new SVG group for axis lines.
    const psyGroup = document.createElementNS(NS, 'g');
    chart.appendChild(psyGroup);

    // Create a new SVG group for labels.
    const txtGroup = document.createElementNS(NS, 'g');
    chart.appendChild(txtGroup);

    // Create a new SVG group for points and point labels.
    const ptGroup = document.createElementNS(NS, 'g');
    chart.appendChild(ptGroup);

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
        Label(dr2xy(db, 0), Anchor.N, db + tempUnit, true);
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
        Label(dd2xy(db_max, dp), Anchor.W, dp + tempUnit, true);
    }

    // Draw constant wet bulb diagonal lines.
    for (let wb = db_min; wb < db_max; wb += 10) {
        const wbLine = new Line(1);
        // Dry bulb is always equal or greater than wet bulb.
        for (let db = wb; db <= db_max; db += res) {
            wbLine.addPoint(dw2xy(db, wb));
        }
        // Add a label on the saturation line
        Label(dd2xy(wb, wb), Anchor.SE, wb + tempUnit, true);
    }

    // Draw constant relative humidity lines.
    for (let rh = 0; rh <= 100; rh += 10) {
        const rhLine = new Line(1);
        let drawLabel = true;
        // Must iterate through all dry bulb temperatures to calculate each Y-coordinate
        for (let db = db_min; db <= db_max; db += res) {
            let pt = dr2xy(db, rh / 100);
            // Stop drawing when the line surpasses the bounds of the chart
            if (pt.y < padding) {
                pt = new Point(pt.x, padding);
                rhLine.addPoint(pt);
                Label(pt, Anchor.S, (rh === 0 || rh === 100) ? '' : rh + '%', true);
                drawLabel = false;
                break;
            }
            rhLine.addPoint(pt);
        }
        if (drawLabel) {
            Label(dr2xy(db_max, rh / 100), Anchor.NE, (rh === 0 || rh === 100) ? '' : rh + '%', true);
        }
    }

    /**
     * Plot a point using dry bulb and relative humidity.
     */
    this.plotDbRh = (t, db, rh, color = '#f00') => PlotPoint(t, dr2psy(db, rh), 5, color);

    /**
     * Plot a point using dry bulb and wet bulb.
     */
    this.plotDbWb = (t, db, wb, color = '#f00') => PlotPoint(t, dw2psy(db, wb), 5, color);

    /**
     * Plot a point using dry bulb and dew point.
     */
    this.plotDbDp = (t, db, dp, color = '#f00') => PlotPoint(t, dd2psy(db, dp), 5, color);

    /**
     * Create a new region.
     */
    this.newRegion = (color) => !(region instanceof Region) && (region = new Region(color));

    /**
     * Add a corner to the region defined by a dry bulb and relative humidity.
     */
    this.regionDbRh = (db, rh) => (region instanceof Region) && region.nextPsy(dr2psy(db, rh));

    /**
     * Add a corner to the region defined by a dry bulb and wet bulb.
     */
    this.regionDbWb = (db, wb) => (region instanceof Region) && region.nextPsy(dw2psy(db, wb));

    /**
     * Add a corner to the region defined by a dry bulb and dew point.
     */
    this.regionDbDp = (db, dp) => (region instanceof Region) && region.nextPsy(dd2psy(db, dp));

    /**
     * Draw the region onto the chart.
     */
    this.buildRegion = () => { if (region instanceof Region) { region.build(); region = undefined; } };

    /**
     * Delete all regions from the psychrometric chart.
     */
    this.clearRegions = () => regGroup.innerHTML = '';

    /**
     * Return the SVG element to render to the screen.
     */
    this.el = () => chart;

    /**
     * Represents an (x,y) cartesian coordinate pair.
     */
    function Point(x, y) {
        Validate('nn', arguments);
        /**
         * X-coordinate
         */
        this.x = x;
        /**
         * Y-coordinate
         */
        this.y = y;
        Object.freeze(this);
    }

    /**
     * Represents a single air condition using 5 states.
     */
    function Psy(db, rh, wb, dp, hr) {
        Validate('nnnnn', arguments);
        /**
         * Dry Bulb
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

        /**
         * Add an (x,y) coordinate pair to the end of this line.
         */
        this.addPoint = (pt) => {
            if (pt instanceof Point) {
                d += ' ' + pt.x + ',' + pt.y;
                pathElement.setAttribute('d', d);
            } else {
                throw 'Incorrect parameter types for Line.addPoint(Point).';
            }
        };
        Object.freeze(this);
    }

    /**
     * Define a method to plot a point.
     */
    function PlotPoint(t, psy, r, color) {
        Validate('sons', arguments);
        if (!(psy instanceof Psy)) {
            throw 'Incorrect parameter types in PlotPoint.';
        }

        // Determine the spatial location of psy.
        const c = dd2xy(psy.db, psy.dp);

        // Define a 0-length path element and assign its attributes.
        const ptElement = document.createElementNS(NS, 'path');
        ptElement.setAttribute('fill', 'none');
        ptElement.setAttribute('stroke', color);
        ptElement.setAttribute('stroke-width', r + 'px');
        ptElement.setAttribute('stroke-linecap', 'round');
        ptElement.setAttribute('vector-effect', 'non-scaling-stroke');
        ptElement.setAttribute('d', 'M ' + c.x + ',' + c.y + ' h 0');
        ptGroup.appendChild(ptElement);

        // Define the padding and label elements.
        const PADDING = 10,
            labelGroupElement = document.createElementNS(NS, 'g'),
            labelBackground = document.createElementNS(NS, 'rect'),
            labelElements = [
                Label(new Point(c.x + PADDING, c.y + PADDING), Anchor.NW, t, false),
                Label(new Point(c.x + PADDING, c.y + PADDING + 12), Anchor.NW, round(psy.db, 1) + tempUnit + ' Dry Bulb', false),
                Label(new Point(c.x + PADDING, c.y + PADDING + 24), Anchor.NW, round(psy.rh * 100) + '% Rel. Hum.', false),
                Label(new Point(c.x + PADDING, c.y + PADDING + 36), Anchor.NW, round(psy.wb, 1) + tempUnit + ' Wet Bulb', false),
                Label(new Point(c.x + PADDING, c.y + PADDING + 48), Anchor.NW, round(psy.dp, 1) + tempUnit + ' Dew Point', false),
            ];

        // Hide the group by default
        labelGroupElement.setAttribute('visibility', 'hidden');
        ptGroup.appendChild(labelGroupElement);

        // Set the attributes of the label background
        labelBackground.setAttribute('stroke', lineColor);
        labelBackground.setAttribute('fill', color);
        labelBackground.setAttribute('x', c.x + PADDING);
        labelBackground.setAttribute('y', c.y + PADDING);
        labelBackground.setAttribute('height', PADDING + 60);
        labelBackground.setAttribute('rx', 2);
        labelBackground.setAttribute('stroke-width', '1px');
        labelGroupElement.appendChild(labelBackground);

        // Determine the width of the label background
        let maxWidth = 0, currWidth;
        for (let i in labelElements) {
            labelGroupElement.appendChild(labelElements[i]);
            currWidth = labelElements[i].getBBox().width + PADDING;
            if (currWidth > maxWidth) {
                maxWidth = currWidth;
            }
        }
        labelBackground.setAttribute('width', maxWidth);

        // Set the behavior when the user interacts with this point
        ptElement.onmouseover = () => labelGroupElement.setAttribute('visibility', 'visible');

        // Set the behavior when the user interacts with this point
        ptElement.onmouseleave = () => labelGroupElement.setAttribute('visibility', 'hidden');
    }

    /**
     * Define a method to plot a shaded region.
     */
    function Region(color) {
        Validate('s', arguments);

        let d = 'M', first = undefined, state = undefined;

        // Add an (x,y) coordinate pair to the outline of this region.
        const addPoint = (pt) => {
            if (pt instanceof Point) {
                d += ' ' + pt.x + ',' + pt.y;
            } else {
                throw 'Incorrect parameter types for Region.addPoint(Point).';
            }
        };

        /**
         * Draw a line going from the last psychrometric state to the current one.
         */
        this.nextPsy = (psy) => {
            if (psy instanceof Psy) {
                if (state instanceof Psy) {
                    const EPS = 0.001;
                    if (approx(psy.rh, state.rh, EPS)) {
                        // Iso relative humidity line (curved line)
                        if (state.db < psy.db) {
                            // LTR
                            for (let db = state.db; db < psy.db; db += res) {
                                addPoint(dr2xy(db, state.rh));
                            }
                        } else {
                            // RTL
                            for (let db = state.db; db > psy.db; db -= res) {
                                addPoint(dr2xy(db, state.rh));
                            }
                        }
                    } else {
                        // Iso dry bulb, wet bulb, or dew point (straight line)
                        addPoint(dd2xy(psy.db, psy.dp));
                    }
                } else {
                    // Set the first state and add the point.
                    first = psy;
                    addPoint(dd2xy(psy.db, psy.dp));
                }
                state = psy;
            } else {
                throw 'Incorrect parameter types for Region.nextPsy(Psy).'
            }
        };

        /**
         * Draw the region.
         */
        this.build = () => {
            // Close the path.
            this.nextPsy(first);
            // Define a path element for the shaded region.
            const regElement = document.createElementNS(NS, 'path');
            regElement.setAttribute('fill', color);
            regElement.setAttribute('stroke', 'none');
            regElement.setAttribute('d', d + ' z');
            regGroup.appendChild(regElement);
        };
        Object.freeze(this);
    }

    /**
     * Define a method to write a label.
     */
    function Label(pt, anchor, text, append) {
        // Perform some error checking.
        Validate('onsb', arguments);
        if (!(pt instanceof Point)) {
            throw 'Incorrect parameter types in Label.';
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

        if (append) {
            txtGroup.appendChild(labelElement);
        }

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

        return labelElement;
    }

    Object.freeze(this);
}
