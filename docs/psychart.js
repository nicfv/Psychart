'use strict';

/**
 * Generate a psychrometric chart as an svg element.
 */
function Psychart(width, height, SI, db_min, db_max, dp_max, altitude, lineColor, textColor) {
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
    Validate('nnbnnnnss', arguments);
    const
        // Define the SVG namespace.
        NS = 'http://www.w3.org/2000/svg',
        // The resolution of the graph.
        res = 0.5,
        // The SVG element on which to draw lines, points, etc.
        chart = document.createElementNS(NS, 'svg'),
        // Import the functionality of Psychrolib.js.
        psychrolib = new Psychrometrics();
    // Set the unit system.
    psychrolib.SetUnitSystem(SI ? psychrolib.SI : psychrolib.IP);
    const
        // Atmospheric pressure at altitude [ft or m]
        atm = psychrolib.GetStandardAtmPressure(altitude),
        // Humidity ratio [grains of water per mass of dry air]
        hr_min = 0,
        // Humidity ratio [grains of water per mass of dry air]
        hr_max = psychrolib.GetHumRatioFromTDewPoint(dp_max, atm),
        // The font size, in px, of the chart
        fontSize = 12,
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

    // Define the last plotted point.
    let lastPoint = undefined;

    // Set the chart's viewport size.
    chart.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

    /**
     * Dispatch the `updatePsychart` event on the SVG element.
     */
    const dispatch = () => chart.dispatchEvent(new Event('updatePsychart'));

    /**
     * Clear any existing tooltips.
     */
    const clearTip = () => clearChildren(ttGroup);

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

    /**
     * Remove all children from a node.
     */
    const clearChildren = (node) => {
        let x;
        while (x = node.firstChild) {
            node.removeChild(x);
        }
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

    // Create a new SVG group for trendlines.
    const lineGroup = document.createElementNS(NS, 'g');
    chart.appendChild(lineGroup);

    // Create a new SVG group for points.
    const ptGroup = document.createElementNS(NS, 'g');
    chart.appendChild(ptGroup);

    // Create a new SVG group for tooltips.
    const ttGroup = document.createElementNS(NS, 'g');
    chart.appendChild(ttGroup);

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
        Label(dr2xy(db, 0), Anchor.N, db + tempUnit, true, 'Dry Bulb', '');
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
        Label(dd2xy(db_max, dp), Anchor.W, dp + tempUnit, true, 'Dew Point', '');
    }

    // Draw constant wet bulb diagonal lines.
    for (let wb = db_min; wb < db_max; wb += 10) {
        const wbLine = new Line(1);
        // Dry bulb is always equal or greater than wet bulb.
        for (let db = wb; db <= db_max; db += res) {
            wbLine.addPoint(dw2xy(db, wb));
        }
        // Add a label on the saturation line
        Label(dd2xy(wb, wb), Anchor.SE, wb + tempUnit, true, 'Wet Bulb', '');
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
                Label(pt, Anchor.S, (rh === 0 || rh === 100) ? '' : rh + '%', true, 'Relative Humidity', '');
                drawLabel = false;
                break;
            }
            rhLine.addPoint(pt);
        }
        if (drawLabel) {
            Label(dr2xy(db_max, rh / 100), Anchor.NE, (rh === 0 || rh === 100) ? '' : rh + '%', true, 'Relative Humidity', '');
        }
    }

    /**
     * Plot a point using dry bulb and relative humidity.
     */
    this.plotDbRh = (db, rh, t = '', color = '#f00', r = 5, lineWidth = 0) => PlotPoint(t, dr2psy(db, rh), r, color, lineWidth);

    /**
     * Plot a point using dry bulb and wet bulb.
     */
    this.plotDbWb = (db, wb, t = '', color = '#f00', r = 5, lineWidth = 0) => PlotPoint(t, dw2psy(db, wb), r, color, lineWidth);

    /**
     * Plot a point using dry bulb and dew point.
     */
    this.plotDbDp = (db, dp, t = '', color = '#f00', r = 5, lineWidth = 0) => PlotPoint(t, dd2psy(db, dp), r, color, lineWidth);

    /**
     * Create a new region.
     */
    this.newRegion = (name = '', color = '#00f') => !(region instanceof Region) && (region = new Region(name, color));

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
    this.clearRegions = () => !(region instanceof Region) && new Region('').clearAll();

    /**
     * Delete all data in the graph.
     */
    this.clearData = () => {
        clearChildren(ptGroup);
        clearChildren(lineGroup);
        lastPoint = undefined;
        dispatch();
    };

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
    function PlotPoint(t, psy, r, color, lineWidth) {
        Validate('sonsn', arguments);
        if (!(psy instanceof Psy)) {
            throw 'Incorrect parameter types in PlotPoint.';
        }

        // Determine the spatial location of psy.
        const c = dd2xy(psy.db, psy.dp);

        // Draw a line from the last point to this point.
        if (lineWidth > 0 && lastPoint instanceof Point) {
            const lineElement = document.createElementNS(NS, 'path');
            lineElement.setAttribute('fill', 'none');
            lineElement.setAttribute('stroke', color);
            lineElement.setAttribute('stroke-width', lineWidth + 'px');
            lineElement.setAttribute('stroke-linecap', 'round');
            lineElement.setAttribute('vector-effect', 'non-scaling-stroke');
            lineElement.setAttribute('d', 'M ' + lastPoint.x + ',' + lastPoint.y + ' ' + c.x + ',' + c.y);
            lineGroup.appendChild(lineElement);
        }
        lastPoint = c;

        // Define a 0-length path element and assign its attributes.
        const ptElement = document.createElementNS(NS, 'path');
        ptElement.setAttribute('fill', 'none');
        ptElement.setAttribute('stroke', color);
        ptElement.setAttribute('stroke-width', r + 'px');
        ptElement.setAttribute('stroke-linecap', 'round');
        ptElement.setAttribute('vector-effect', 'non-scaling-stroke');
        ptElement.setAttribute('d', 'M ' + c.x + ',' + c.y + ' h 0');
        ptGroup.appendChild(ptElement);

        // Generate the text to display on mouse hover.
        const tooltipString = (!!t ? t + '\n' : '') +
            round(psy.db, 1) + tempUnit + ' Dry Bulb\n' +
            round(psy.rh * 100) + '% Rel. Hum.\n' +
            round(psy.wb, 1) + tempUnit + ' Wet Bulb\n' +
            round(psy.dp, 1) + tempUnit + ' Dew Point';

        // Set the behavior when the user interacts with this point
        ptElement.onmouseover = () => Tooltip(c.x, c.y, color, tooltipString, true);

        // Set the behavior when the user interacts with this point
        ptElement.onmouseleave = () => clearTip();

        // Let the program know that the view needs to be updated.
        dispatch();
    }

    /**
     * Define a method to plot a shaded region.
     */
    function Region(name, color) {
        Validate('ss', arguments);

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
                            for (let db = state.db; db <= psy.db + EPS; db += res) {
                                addPoint(dr2xy(db, state.rh));
                            }
                        } else {
                            // RTL
                            for (let db = state.db; db >= psy.db - EPS; db -= res) {
                                addPoint(dr2xy(db, state.rh));
                            }
                        }
                        addPoint(dr2xy(psy.db, psy.rh));
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
            if (first instanceof Psy) {
                // Close the path.
                this.nextPsy(first);
                // Define a path element for the shaded region.
                const regElement = document.createElementNS(NS, 'path');
                regElement.setAttribute('fill', color);
                regElement.setAttribute('stroke', 'none');
                regElement.setAttribute('d', d + ' z');
                regGroup.appendChild(regElement);
                if (!!name) {
                    // Show a tooltip on mouse hover.
                    let pt = dd2xy(first.db, first.dp);
                    regElement.onmouseover = () => Tooltip(pt.x, pt.y, color, name, true);
                    // Clear tooltips on mouse leave.
                    regElement.onmouseleave = clearTip;
                }
                // Dispatch an event to show that the chart was updated.
                dispatch();
            }
        };

        /**
         * Delete all regions.
         */
        this.clearAll = () => {
            clearChildren(regGroup);
            dispatch();
        };
        Object.freeze(this);
    }

    /**
     * Define a method to write a label.
     */
    function Label(pt, anchor, text, append, title = '', textColorOverride = '') {
        // Perform some error checking.
        Validate('onsbss', arguments);
        if (!(pt instanceof Point)) {
            throw 'Incorrect parameter types in Label.';
        }

        // Define a text element and assign its attributes.
        const labelElement = document.createElementNS(NS, 'text');
        labelElement.setAttribute('fill', !!textColorOverride ? textColorOverride : textColor);
        labelElement.setAttribute('x', pt.x);
        labelElement.setAttribute('y', pt.y);
        labelElement.setAttribute('font-family', 'sans-serif');
        labelElement.setAttribute('font-size', fontSize + 'px');
        labelElement.setAttribute('text-anchor', 'middle');
        labelElement.setAttribute('dominant-baseline', 'middle');
        labelElement.textContent = text;
        // Optionally include a tooltip.
        if (!!title) {
            labelElement.onmouseover = () => Tooltip(pt.x, pt.y, '#888', title, true);
            labelElement.onmouseleave = clearTip;
        }

        if (append) {
            txtGroup.appendChild(labelElement);
        }

        const top = () => {
            labelElement.setAttribute('y', pt.y + fontSize / 2);
            labelElement.setAttribute('dominant-baseline', 'hanging');
        };

        const bot = () => {
            labelElement.setAttribute('y', pt.y - fontSize / 2);
            labelElement.setAttribute('dominant-baseline', 'alphabetic');
        };

        const left = () => {
            labelElement.setAttribute('x', pt.x + fontSize / 2);
            labelElement.setAttribute('text-anchor', 'start');
        };

        const right = () => {
            labelElement.setAttribute('x', pt.x - fontSize / 2);
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

    /**
     * Define a method to display a tooltip.
     */
    function Tooltip(x, y, color, text, clear) {
        // Perform some error checking.
        Validate('nnssb', arguments);

        // Clear any existing tooltips.
        if (clear) {
            clearTip();
        }

        // Define the padding and SVG elements.
        const PADDING = 10,
            tooltipElement = document.createElementNS(NS, 'g'),
            tooltipBackground = document.createElementNS(NS, 'rect'),
            labelElements = [];

        // Determine if font color needs to be white or black
        const light = w3color(color).lightness > 0.5;

        // Generate the array of label elements.
        const lines = text.split('\n');
        for (let i in lines) {
            labelElements.push(Label(new Point(0, i * fontSize), Anchor.NW, lines[i], false, '', light ? '#000' : '#fff'));
        }

        // Append the tooltip element to the label group and append the background to the element
        ttGroup.appendChild(tooltipElement);
        tooltipElement.appendChild(tooltipBackground);

        // Determine the width of the tooltip background
        let maxWidth = 0, currWidth, maxHeight = fontSize * lines.length + PADDING;
        for (let i in labelElements) {
            tooltipElement.appendChild(labelElements[i]);
            currWidth = labelElements[i].getBBox().width + PADDING;
            if (currWidth > maxWidth) {
                maxWidth = currWidth;
            }
        }

        // Set the attributes of the tooltip background
        tooltipBackground.setAttribute('stroke', lineColor);
        tooltipBackground.setAttribute('fill', color);
        tooltipBackground.setAttribute('x', 0);
        tooltipBackground.setAttribute('y', 0);
        tooltipBackground.setAttribute('width', maxWidth);
        tooltipBackground.setAttribute('height', maxHeight);
        tooltipBackground.setAttribute('rx', 2);
        tooltipBackground.setAttribute('stroke-width', '1px');

        // Append this to the label layer and adjust position if out of bounds
        if (x + maxWidth + PADDING > width) { x -= (maxWidth + PADDING); } else { x += PADDING; }
        if (y + maxHeight + PADDING > height) { y -= (maxHeight + PADDING); } else { y += PADDING; }
        tooltipElement.setAttribute('transform', 'translate(' + x + ',' + y + ')')
    }

    Object.freeze(this);
}
