import { Math2 } from './Math2';
import { Point } from './Point';
import { Anchor } from './Anchor';
import { Psy } from './Psy';
import { Psychrometrics } from './psychrolib';
import { Color } from './Color';

// Define the SVG namespace.
const NS = 'http://www.w3.org/2000/svg';

/**
 * Generate a psychrometric chart as an svg element.
 */
export class Psychart {
    // Define the current region.
    region = undefined;
    // Define the last plotted point.
    lastPoint = undefined;
    constructor(width = 600, height = 400, SI, db_min, db_max, dp_max, altitude, advanced, lineColor, textColor) {
        // The resolution of the graph.
        this.res = 0.5;
        // The SVG element on which to draw lines, points, etc.
        this.chart = document.createElementNS(NS, 'svg');
        // Import the functionality of Psychrolib.js.
        this.psychrolib = new Psychrometrics();
        // Set the unit system.
        this.psychrolib.SetUnitSystem(SI ? this.psychrolib.SI : this.psychrolib.IP);
        // Atmospheric pressure at altitude [ft or m]
        this.atm = this.psychrolib.GetStandardAtmPressure(altitude);
        // Humidity ratio [grains of water per mass of dry air]
        this.hr_min = 0;
        // Humidity ratio [grains of water per mass of dry air]
        this.hr_max = psychrolib.GetHumRatioFromTDewPoint(dp_max, atm);
        // The font size, in px, of the chart
        this.fontSize = 12;
        // The padding, in px, of the chart
        this.padding = 30;
        // The temperature unit to display
        this.tempUnit = '\u00B0' + (psychrolib.isIP() ? 'F' : 'C');
        this.hrUnit = (psychrolib.isIP() ? 'lbw/lba' : 'kgw/kga');
        this.vpUnit = (psychrolib.isIP() ? 'Psi' : 'Pa');
        this.hUnit = (psychrolib.isIP() ? 'Btu/lb' : 'J/kg');
        this.vUnit = (psychrolib.isIP() ? 'ft\u00B3/lb' : 'm\u00B3/kg');
        // Set the chart's viewport size.
        this.chart.setAttribute('viewBox', '0 0 ' + width + ' ' + height);

        // Create a new SVG group for shaded regions.
        this.regGroup = document.createElementNS(NS, 'g');
        chart.appendChild(this.regGroup);

        // Create a new SVG group for axis lines.
        this.psyGroup = document.createElementNS(NS, 'g');
        chart.appendChild(this.psyGroup);

        // Create a new SVG group for labels.
        this.txtGroup = document.createElementNS(NS, 'g');
        chart.appendChild(this.txtGroup);

        // Create a new SVG group for trendlines.
        this.lineGroup = document.createElementNS(NS, 'g');
        chart.appendChild(this.lineGroup);

        // Create a new SVG group for points.
        this.ptGroup = document.createElementNS(NS, 'g');
        chart.appendChild(this.ptGroup);

        // Create a new SVG group for tooltips.
        this.ttGroup = document.createElementNS(NS, 'g');
        chart.appendChild(this.ttGroup);

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

    }

    /**
     * Dispatch the `updatePsychart` event on the SVG element.
     */
    #dispatch() {
        this.chart.dispatchEvent(new Event('updatePsychart'));
    }

    /**
     * Clear any existing tooltips.
     */
    #clearTip() {
        this.#clearChildren(this.ttGroup);
    }

    /**
     * Clear all regions.
     */
    #clearRegions() {
        this.#clearChildren(this.regGroup);
    }

    /**
     * Return a set of cartesian coordinates from a dry bulb and relative humidity.
     */
    #dr2xy(db, rh) {
        return new Point(
            Math2.translate(db, this.db_min, this.db_max, this.padding, this.width - this.padding),
            this.height - Math2.translate(this.#dr2psy(db, rh).hr, this.hr_min, this.hr_max, this.padding, this.height - this.padding));
    }

    /**
     * Return a set of cartesian coordinates from a dry bulb and wet bulb.
     */
    #dw2xy(db, wb) {
        return new Point(
            Math2.translate(db, this.db_min, this.db_max, this.padding, this.width - this.padding),
            this.height - Math2.translate(this.#dw2psy(db, wb).hr, this.hr_min, this.hr_max, this.padding, this.height - this.padding));
    }

    /**
     * Return a set of cartesian coordinates from a dry bulb and dew point.
     */
    #dd2xy(db, dp) {
        return new Point(
            Math2.translate(db, this.db_min, this.db_max, this.padding, this.width - this.padding),
            this.height - Math2.translate(this.#dd2psy(db, dp).hr, this.hr_min, this.hr_max, this.padding, this.height - this.padding));
    }

    /**
     * Return 5 air parameters from a dry bulb and relative humidity.
     */
    #dr2psy(db, rh) {
        const psy = this.psychrolib.CalcPsychrometricsFromRelHum(db, rh, this.atm);
        return new Psy(db, rh, psy[1], psy[2], psy[0], psy[3], psy[4], psy[5]);
    };

    /**
     * Return 5 air parameters from a dry bulb and wet bulb.
     */
    #dw2psy(db, wb) {
        const psy = this.psychrolib.CalcPsychrometricsFromTWetBulb(db, wb, this.atm);
        return new Psy(db, psy[2], wb, psy[1], psy[0], psy[3], psy[4], psy[5]);
    };

    /**
     * Return 5 air parameters from a dry bulb and dew point.
     */
    #dd2psy(db, dp) {
        const psy = this.psychrolib.CalcPsychrometricsFromTDewPoint(db, dp, this.atm);
        return new Psy(db, psy[2], psy[1], dp, psy[0], psy[3], psy[4], psy[5]);
    };

    /**
     * Remove all children from a node.
     */
    #clearChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    };

    /**
     * Plot a point using dry bulb and relative humidity.
     */
    plotDbRh(db, rh, t = '', color = '#f00', r = 5, lineWidth = 0) {
        PlotPoint(t, this.#dr2psy(db, rh), r, color, lineWidth);
    }

    /**
     * Plot a point using dry bulb and wet bulb.
     */
    plotDbWb(db, wb, t = '', color = '#f00', r = 5, lineWidth = 0) {
        PlotPoint(t, this.#dw2psy(db, wb), r, color, lineWidth);
    }

    /**
     * Plot a point using dry bulb and dew point.
     */
    plotDbDp(db, dp, t = '', color = '#f00', r = 5, lineWidth = 0) {
        PlotPoint(t, this.#dd2psy(db, dp), r, color, lineWidth);
    }

    /**
     * Create a new region.
     */
    newRegion(name = '', color = '#00f') {
        !(this.region instanceof Region) && (this.region = new Region(name, color));
    }

    /**
     * Add a corner to the region defined by a dry bulb and relative humidity.
     */
    regionDbRh(db, rh) {
        (this.region instanceof Region) && this.region.nextPsy(this.#dr2psy(db, rh));
    }

    /**
     * Add a corner to the region defined by a dry bulb and wet bulb.
     */
    regionDbWb(db, wb) {
        (this.region instanceof Region) && this.region.nextPsy(this.#dw2psy(db, wb));
    }

    /**
     * Add a corner to the region defined by a dry bulb and dew point.
     */
    regionDbDp(db, dp) {
        (this.region instanceof Region) && this.region.nextPsy(this.#dd2psy(db, dp));
    }

    /**
     * Draw the region onto the chart.
     */
    buildRegion() {
        if (this.region instanceof Region) {
            this.region.build();
            this.region = undefined;
        }
    };

    /**
     * Delete all regions from the psychrometric chart.
     */
    clearRegions() {
        !(this.region instanceof Region) && new Region('').clearAll();
    }

    /**
     * Delete all data in the graph.
     */
    clearData() {
        this.#clearChildren(this.ptGroup);
        this.#clearChildren(this.lineGroup);
        lastPoint = undefined;
        this.#dispatch();
    };

    /**
     * Return the SVG element to render to the screen.
     */
    get el() { return this.chart; }

    /**
     * Define a method to plot a point.
     */
    PlotPoint(t = '', psy = new Psy(), r = 0, color = new Color(), lineWidth = 0) {

        // Determine the spatial location of psy.
        const c = this.#dd2xy(psy.db, psy.dp);

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
            round(psy.dp, 1) + tempUnit + ' Dew Point' + (advanced ? '\n' +
                round(psy.hr, 2) + ' ' + hrUnit + ' Hum. Ratio\n' +
                round(psy.vp, 1) + ' ' + vpUnit + ' Vap. Press.\n' +
                round(psy.h, 1) + ' ' + hUnit + ' Enthalpy\n' +
                round(psy.v, 2) + ' ' + vUnit + ' Volume' : '');

        // Set the behavior when the user interacts with this point
        ptElement.onmouseover = () => Tooltip(c.x, c.y, color, tooltipString, true);

        // Set the behavior when the user interacts with this point
        ptElement.onmouseleave = () => clearTip();

        // Let the program know that the view needs to be updated.
        dispatch();
    }
}

/**
 * Define a method to plot a shaded region.
 */
class Region {
    d = 'M';
    first = undefined;
    state = undefined;
    constructor(name = '', color = new Color()) {
        this.name = name;
        this.color = color;
    }

    // Add an (x,y) coordinate pair to the outline of this region.
    addPoint(pt = new Point()) {
        this.d += ' ' + pt.toString();
    }

    /**
     * Draw a line going from the last psychrometric state to the current one.
     */
    nextPsy(psy = new Psy()) {
        if (this.state instanceof Psy) {
            const EPS = 0.001;
            if (Math2.approx(psy.rh, state.rh, EPS)) {
                // Iso relative humidity line (curved line)
                if (state.db < psy.db) {
                    // LTR
                    for (let db = state.db; db <= psy.db + EPS; db += res) {
                        this.addPoint(dr2xy(db, state.rh));
                    }
                } else {
                    // RTL
                    for (let db = state.db; db >= psy.db - EPS; db -= res) {
                        this.addPoint(dr2xy(db, state.rh));
                    }
                }
                this.addPoint(dr2xy(psy.db, psy.rh));
            } else {
                // Iso dry bulb, wet bulb, or dew point (straight line)
                this.addPoint(dd2xy(psy.db, psy.dp));
            }
        } else {
            // Set the first state and add the point.
            this.first = psy;
            this.addPoint(dd2xy(psy.db, psy.dp));
        }
        this.state = psy;
    }

    /**
     * Draw the region.
     */
    build() {
        if (first instanceof Psy) {
            // Close the path.
            this.nextPsy(first);
            // Define a path element for the shaded region.
            const regElement = document.createElementNS(NS, 'path');
            regElement.setAttribute('fill', color);
            regElement.setAttribute('stroke', 'none');
            regElement.setAttribute('d', d + ' z');
            regGroup.appendChild(regElement);
            if (!!this.name) {
                // Show a tooltip on mouse hover.
                let pt = dd2xy(first.db, first.dp);
                regElement.onmouseover = () => Tooltip(pt.x, pt.y, color, this.name, true);
                // Clear tooltips on mouse leave.
                regElement.onmouseleave = clearTip;
            }
            // Dispatch an event to show that the chart was updated.
            dispatch();
        }
    }
}

/**
 * Define a method to write a label.
 */
class Label {
    #el;
    constructor(pt = new Point(), anchor = Anchor.C, text = '', title = '', fontSize = 0, textColor = new Color()) {
        // Define a text element and assign its attributes.
        this.#el = document.createElementNS(NS, 'text');
        this.#el.setAttribute('fill', textColor);
        this.#el.setAttribute('x', pt.x);
        this.#el.setAttribute('y', pt.y);
        this.#el.setAttribute('font-family', 'sans-serif');
        this.#el.setAttribute('font-size', fontSize + 'px');
        this.#el.setAttribute('text-anchor', 'middle');
        this.#el.setAttribute('dominant-baseline', 'middle');
        this.#el.textContent = text;
        // Optionally include a tooltip.
        if (!!title) {
            this.#el.addEventListener('mouseover', () => Tooltip(pt.x, pt.y, textColor, title, true));
            this.#el.addEventListener('mouseleave', () => { /** TODO */ });
        }

        const top = () => {
            this.#el.setAttribute('y', pt.y + fontSize / 2);
            this.#el.setAttribute('dominant-baseline', 'hanging');
        };

        const bot = () => {
            this.#el.setAttribute('y', pt.y - fontSize / 2);
            this.#el.setAttribute('dominant-baseline', 'alphabetic');
        };

        const left = () => {
            this.#el.setAttribute('x', pt.x + fontSize / 2);
            this.#el.setAttribute('text-anchor', 'start');
        };

        const right = () => {
            this.#el.setAttribute('x', pt.x - fontSize / 2);
            this.#el.setAttribute('text-anchor', 'end');
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

    getElement() {
        return this.#el;
    }
}

/**
 * Define a method to display a tooltip.
 */
class Tooltip {
    #el;
    constructor(pt = new Point(), color = new Color(), text = '') {
        // Define the padding and SVG elements.
        const PADDING = 10,
            tooltipBackground = document.createElementNS(NS, 'rect'),
            labelElements = [];

        // Append the tooltip element to the label group and append the background to the element
        this.#el = document.createElementNS('g');
        this.#el.appendChild(tooltipBackground);

        // Determine if font color needs to be white or black
        const fontColor = color.getContrastingColor();

        // Generate the array of label elements.
        const lines = text.split('\n');
        for (let i in lines) {
            labelElements.push(new Label(new Point(0, i * fontSize), Anchor.NW, lines[i], false, '', fontColor));
        }

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
}

/**
 * Define a method to dynamically draw a line.
 */
class Line {
    #el;
    // This is the collection of (x,y) points that make up this path.
    #pts = [];
    constructor(weight = 0, parent) {
        // Define the path element and assign its attributes.
        this.#el = document.createElementNS(NS, 'path');
        this.#el.setAttribute('fill', 'none');
        this.#el.setAttribute('stroke', lineColor);
        this.#el.setAttribute('stroke-width', weight + 'px');
        this.#el.setAttribute('vector-effect', 'non-scaling-stroke');
        (parent instanceof Element) && parent.appendChild(this.#el);
    }
    /**
     * Add an (x,y) coordinate pair to the end of this line.
     */
    addPoint(pt = new Point()) {
        this.#pts.push(pt);
        pathElement.setAttribute('d', 'M ' + this.#pts.map(pt => pt.toString()).join(' '));
    }
}