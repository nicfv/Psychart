import Color from 'color';
import JMath from 'jmath';
import PsyState from 'psystate';
import { PsyOptions, Datum, Layout, Point, Region, StyleOptions, GradientName, RegionName, DataOptions } from './types';

const NS = 'http://www.w3.org/2000/svg';

/**
 * Generates an interactive psychrometric chart with plotting capabilities.
 */
export default class Psychart {
    /**
     * Defines the string representations of the current unit system.
     */
    private readonly units = {
        temp: '',
        hr: '',
        vp: '',
        h: '',
        v: '',
    };
    /**
     * Defines the base element to attach to the viewing window.
     */
    private readonly base: SVGElement = document.createElementNS(NS, 'svg');
    /**
     * Defines all the groups in the SVG ordered by layer.
     */
    private readonly g = {
        regions: document.createElementNS(NS, 'g'),
        axes: document.createElementNS(NS, 'g'),
        text: document.createElementNS(NS, 'g'),
        trends: document.createElementNS(NS, 'g'),
        points: document.createElementNS(NS, 'g'),
        tooltips: document.createElementNS(NS, 'g'),
    };
    /**
     * Gradient source: https://waldyrious.net/viridis-palette-generator/
     */
    private static readonly gradients: { [K in GradientName]: Color[] } = {
        Viridis: [
            new Color(68, 1, 84),
            new Color(59, 82, 139),
            new Color(33, 145, 140),
            new Color(94, 201, 98),
            new Color(253, 231, 37),
        ],
        Inferno: [
            new Color(0, 0, 4),
            new Color(87, 16, 110),
            new Color(188, 55, 84),
            new Color(249, 142, 9),
            new Color(252, 255, 164),
        ],
        Magma: [
            new Color(0, 0, 4),
            new Color(81, 18, 124),
            new Color(183, 55, 121),
            new Color(252, 137, 97),
            new Color(252, 253, 191),
        ],
        Plasma: [
            new Color(13, 8, 135),
            new Color(126, 3, 168),
            new Color(204, 71, 120),
            new Color(248, 149, 64),
            new Color(240, 249, 33),
        ],
        Emerald: [
            new Color(7, 64, 80),
            new Color(76, 155, 130),
            new Color(211, 242, 163),
        ],
        Mint: [
            new Color(13, 88, 95),
            new Color(99, 166, 160),
            new Color(228, 241, 225),
        ],
        Sunset: [
            new Color(92, 83, 165),
            new Color(235, 127, 134),
            new Color(243, 231, 155),
        ],
        Dusk: [
            new Color(124, 29, 111),
            new Color(227, 79, 111),
            new Color(252, 222, 156),
        ],
        Blue: [
            new Color(193, 231, 255),
            new Color(105, 150, 179),
            new Color(0, 76, 109),
        ],
    };
    /**
     * Predefined regions source: 2021 Equipment Thermal Guidelines for Data Processing Environments
     * ASHRAE-55 source: https://comfort.cbe.berkeley.edu/
     */
    private static readonly regions: { [K in RegionName]: Region } = {
        'Summer (sitting)': {
            tooltip: 'ASHRAE-55 (Human comfort)\nAir speed = 0.1 m/s\nMET = 1.0 (seated)\nCLO = 0.5 (summer clothing)',
            data: [
                { db: 32.8, other: 0, measurement: 'dbrh' },
                { db: 27.2, other: 1, measurement: 'dbrh' },
                { db: 22.7, other: 1, measurement: 'dbrh' },
                { db: 26.9, other: 0, measurement: 'dbrh' },
            ],
        },
        'Summer (walking)': {
            tooltip: 'ASHRAE-55 (Human comfort)\nAir speed = 0.1 m/s\nMET = 1.5 (walking)\nCLO = 0.5 (summer clothing)',
            data: [
                { db: 31.2, other: 0, measurement: 'dbrh' },
                { db: 25.8, other: 1, measurement: 'dbrh' },
                { db: 20.3, other: 1, measurement: 'dbrh' },
                { db: 23.2, other: 0, measurement: 'dbrh' },
            ],
        },
        'Summer (light work)': {
            tooltip: 'ASHRAE-55 (Human comfort)\nAir speed = 0.1 m/s\nMET = 2.0 (light work)\nCLO = 0.5 (summer clothing)',
            data: [
                { db: 30.4, other: 0, measurement: 'dbrh' },
                { db: 24.8, other: 1, measurement: 'dbrh' },
                { db: 19.2, other: 1, measurement: 'dbrh' },
                { db: 22.0, other: 0, measurement: 'dbrh' },
            ],
        },
        'Winter (sitting)': {
            tooltip: 'ASHRAE-55 (Human comfort)\nAir speed = 0.1 m/s\nMET = 1.0 (seated)\nCLO = 1.0 (winter clothing)',
            data: [
                { db: 28.6, other: 0, measurement: 'dbrh' },
                { db: 22.7, other: 1, measurement: 'dbrh' },
                { db: 17.1, other: 1, measurement: 'dbrh' },
                { db: 20.5, other: 0, measurement: 'dbrh' },
            ],
        },
        'Winter (walking)': {
            tooltip: 'ASHRAE-55 (Human comfort)\nAir speed = 0.1 m/s\nMET = 1.5 (walking)\nCLO = 1.0 (winter clothing)',
            data: [
                { db: 26.8, other: 0, measurement: 'dbrh' },
                { db: 21.5, other: 1, measurement: 'dbrh' },
                { db: 14.5, other: 1, measurement: 'dbrh' },
                { db: 17.2, other: 0, measurement: 'dbrh' },
            ],
        },
        'Winter (light work)': {
            tooltip: 'ASHRAE-55 (Human comfort)\nAir speed = 0.1 m/s\nMET = 2.0 (light work)\nCLO = 1.0 (winter clothing)',
            data: [
                { db: 25.6, other: 0, measurement: 'dbrh' },
                { db: 20.4, other: 1, measurement: 'dbrh' },
                { db: 13.1, other: 1, measurement: 'dbrh' },
                { db: 15.5, other: 0, measurement: 'dbrh' },
            ],
        },
        'Data Center A4': {
            tooltip: 'The A4 ASHRAE data center\ncomfort zone. Typically\nan IT space with low\nenvironmental requirements.',
            data: [
                { db: 5, other: -12, measurement: 'dbdp' },
                { db: 22.5, other: 0.08, measurement: 'dbrh' },
                { db: 45.0, other: 0.08, measurement: 'dbrh' },
                { db: 45.0, other: 24, measurement: 'dbdp' },
                { db: 25.8, other: 0.90, measurement: 'dbrh' },
                { db: 5, other: 0.90, measurement: 'dbrh' },
            ],
        },
        'Data Center A3': {
            tooltip: 'The A3 ASHRAE data center\ncomfort zone. Typically\nan IT space with normal\nenvironmental requirements.',
            data: [
                { db: 5, other: -12, measurement: 'dbdp' },
                { db: 22.5, other: 0.08, measurement: 'dbrh' },
                { db: 40.0, other: 0.08, measurement: 'dbrh' },
                { db: 40.0, other: 24, measurement: 'dbdp' },
                { db: 26.7, other: 0.85, measurement: 'dbrh' },
                { db: 5, other: 0.85, measurement: 'dbrh' },
            ],
        },
        'Data Center A2': {
            tooltip: 'The A2 ASHRAE data center\ncomfort zone. Typically\nan IT space with strict\nenvironmental requirements.',
            data: [
                { db: 10.0, other: -12, measurement: 'dbdp' },
                { db: 22.5, other: 0.08, measurement: 'dbrh' },
                { db: 35.0, other: 0.08, measurement: 'dbrh' },
                { db: 35.0, other: 21, measurement: 'dbdp' },
                { db: 24.7, other: 0.80, measurement: 'dbrh' },
                { db: 10.0, other: 0.80, measurement: 'dbrh' },
            ],
        },
        'Data Center A1': {
            tooltip: 'The A1 ASHRAE data\ncenter comfort zone.\nTypically a data center with\nmission-critical operations.',
            data: [
                { db: 15.0, other: -12, measurement: 'dbdp' },
                { db: 22.5, other: 0.08, measurement: 'dbrh' },
                { db: 32.0, other: 0.08, measurement: 'dbrh' },
                { db: 32.0, other: 17, measurement: 'dbdp' },
                { db: 20.6, other: 0.80, measurement: 'dbrh' },
                { db: 15.0, other: 0.80, measurement: 'dbrh' },
            ],
        },
        'Data Center Recommended (low pollutants)': {
            tooltip: 'The "recommended" ASHRAE\ncomfort zone for data centers\nwith conditions with low\nconcentration of pollutants.',
            data: [
                { db: 18.0, other: -9, measurement: 'dbdp' },
                { db: 27.0, other: -9, measurement: 'dbdp' },
                { db: 27.0, other: 15, measurement: 'dbdp' },
                { db: 20.7, other: 0.70, measurement: 'dbrh' },
                { db: 18.0, other: 0.70, measurement: 'dbrh' },
            ],
        },
        'Data Center Recommended (high pollutants)': {
            tooltip: 'The "recommended" ASHRAE\ncomfort zone for data centers\nwith conditions with high\nconcentration of pollutants.',
            data: [
                { db: 18.0, other: -9, measurement: 'dbdp' },
                { db: 27.0, other: -9, measurement: 'dbdp' },
                { db: 27.0, other: 15, measurement: 'dbdp' },
                { db: 26.2, other: 0.50, measurement: 'dbrh' },
                { db: 18.0, other: 0.50, measurement: 'dbrh' },
            ],
        },
    };
    /**
     * The last states plotted on Psychart for each series.
     */
    private lastState: { [index: number]: PsyState } = {};
    /**
     * The timestamp of which Psychart was initialized. For plotting, this represents the origin.
     */
    private readonly startTime: number;
    /**
     * The timestamp that's used as the final time for plotting. By default, this is 1 hour after `startTime`
     */
    private readonly endTime: number;
    /**
     * Return an array of all gradient names.
     */
    static getGradientNames(): GradientName[] {
        return Object.keys(this.gradients).filter(name => name !== 'Blue') as GradientName[];
    }
    /**
     * Return an array of region names and their corresponding tooltips.
     */
    static getRegionNamesAndTips(): Array<[RegionName, string]> {
        return Object.entries(this.regions).map(([name, region]) => [name as RegionName, region.tooltip]);
    }
    /**
     * Return some suggested style options based on if the current display is dark or light theme.
     */
    static getDefaultStyleOptions(isDarkTheme: boolean): StyleOptions {
        return {
            darkTheme: isDarkTheme,
            fontColor: isDarkTheme ? new Color(208, 208, 208) : new Color(32, 32, 32),
            lineColor: isDarkTheme ? new Color(48, 48, 48) : new Color(224, 224, 224),
            fontSize: 12,
            resolution: 0.5,
            major: 10,
            timeSpan: 60 * 60 * 1e3,
        } as StyleOptions;
    }
    /**
     * Generate an SVG element to use as this gradient's icon.
     * Returns the outer HTML string to be saved in a file.
     */
    static generateGradientIcon(gradient: GradientName): string {
        const maxColorIndex: number = this.gradients[gradient].length - 1;
        return '<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">' +
            this.gradients[gradient].map((color, i) => '<stop style="stop-color:' + color.toString() + '" offset="' + JMath.normalize(i, 0, maxColorIndex) + '" />').join('') +
            '</linearGradient></defs><rect style="fill:url(#grad);stroke:none" width="10" height="10" x="0" y="0" rx="2" ry="2" /></svg>';
    }
    /**
     * Returns the path to the gradient icon.
     */
    static getGradientIcon(gradient: GradientName): string {
        return require('img/' + gradient.toLowerCase() + '.svg');
    }
    /**
     * Construct a new instance of `Psychart` given various configuration properties.
     */
    constructor(private readonly layout: Layout, private readonly config: PsyOptions, private readonly style: StyleOptions) {
        // Compute a first-time initialization of psychrolib
        PsyState.initialize(layout, config);
        // Check to make sure that dpMax is less than dbMax
        if (config.dpMax > config.dbMax) {
            throw new Error('Dew point maximum is greater than dry bulb range!');
        }
        // Set the starting and ending timestamps
        this.startTime = Date.now();
        this.endTime = this.startTime + this.style.timeSpan;
        // Set the chart's viewport size.
        this.base.setAttribute('viewBox', '0 0 ' + this.layout.size.x + ' ' + this.layout.size.y);
        // Sets the displayed units based on the unit system.
        this.units.temp = '\u00B0' + (this.config.unitSystem === 'IP' ? 'F' : 'C');
        this.units.hr = (this.config.unitSystem === 'IP' ? 'lbw/lba' : 'kgw/kga');
        this.units.vp = (this.config.unitSystem === 'IP' ? 'Psi' : 'Pa');
        this.units.h = (this.config.unitSystem === 'IP' ? 'Btu/lb' : 'J/kg');
        this.units.v = (this.config.unitSystem === 'IP' ? 'ft\u00B3/lb' : 'm\u00B3/kg');
        // Create new SVG groups, and append all the
        // layers into the chart.
        Object.values(this.g).forEach(group => this.base.appendChild(group));
        // Draw constant dry bulb vertical lines.
        for (let db = this.config.dbMin; db <= this.config.dbMax; db += this.style.major) {
            const data: PsyState[] = [];
            // The lower point is on the X-axis (rh = 0%)
            data.push(new PsyState({ db: db, other: 0, measurement: 'dbrh' }));
            // The upper point is on the saturation line (rh = 100%)
            data.push(new PsyState({ db: db, other: 1, measurement: 'dbrh' }));
            // Draw the axis and the label
            this.drawAxis(data);
            this.drawLabel(db + this.units.temp, data[0], TextAnchor.N, 'Dry Bulb');
        }
        // Draw constant dew point horizontal lines.
        for (let dp = 0; dp <= this.config.dpMax; dp += this.style.major) {
            const data: PsyState[] = [];
            // The left point is on the saturation line (db = dp)
            data.push(new PsyState({ db: dp, other: dp, measurement: 'dbdp' }));
            // The right point is at the maximum dry bulb temperature
            data.push(new PsyState({ db: this.config.dbMax, other: dp, measurement: 'dbdp' }));
            // Draw the axis and the label
            this.drawAxis(data);
            this.drawLabel(dp + this.units.temp, data[1], TextAnchor.W, 'Dew Point');
        }
        // Draw constant wet bulb diagonal lines.
        for (let wb = this.config.dbMin; wb <= this.config.dpMax; wb += this.style.major) {
            const data: PsyState[] = [];
            // Dry bulb is always equal or greater than wet bulb.
            for (let db = wb; db <= this.config.dbMax; db += this.style.resolution) {
                data.push(new PsyState({ db: db, other: wb, measurement: 'dbwb' }));
            }
            // Draw the axis and the label
            this.drawAxis(data);
            this.drawLabel(wb + this.units.temp, data[0], TextAnchor.SE, 'Wet Bulb');
        }
        // Draw constant relative humidity lines.
        for (let rh = 0; rh <= 100; rh += this.style.major) {
            const data: PsyState[] = [];
            let preferredAnchor: TextAnchor = TextAnchor.NE;
            // Must iterate through all dry bulb temperatures to calculate each Y-coordinate
            for (let db = this.config.dbMin; db <= this.config.dbMax; db += this.style.resolution) {
                data.push(new PsyState({ db: db, other: rh / 100, measurement: 'dbrh' }));
                // Stop drawing when the line surpasses the bounds of the chart
                if (data[data.length - 1].dp >= this.config.dpMax) {
                    preferredAnchor = TextAnchor.S;
                    break;
                }
            }
            // Draw the axis and the label
            this.drawAxis(data);
            if (rh > 0 && rh < 100) {
                this.drawLabel(rh + '%', data[data.length - 1], preferredAnchor, 'Relative Humidity');
            }
        }
        // Draw any regions, if applicable
        let regionIndex = 0;
        Object.entries(Psychart.regions)
            .filter(([name,]) => config.regions?.includes(name as RegionName))
            .forEach(([, region]) => {
                const maxRegion = this.config.regions.length - 1,
                    normalized = this.style.darkTheme ? JMath.normalize(regionIndex, maxRegion, 0) : JMath.normalize(regionIndex, 0, maxRegion),
                    data = this.deepCopy(region.data);
                if (this.config.unitSystem === 'IP') {
                    // Convert from SI to US units
                    data.forEach(datum => {
                        datum.db = JMath.CtoF(datum.db);
                        if (datum.measurement === 'dbdp' || datum.measurement === 'dbwb') {
                            datum.other = JMath.CtoF(datum.other);
                        }
                    });
                }
                this.drawRegion(data, Color.gradient(normalized, Psychart.gradients.Blue), region.tooltip);
                regionIndex++;
            });
    }
    /**
     * Generate SVG path data from an array of psychrometric states.
     */
    private setPathData(path: SVGPathElement, psystates: PsyState[], closePath: boolean): void {
        path.setAttribute('d', 'M ' + psystates.map(psy => {
            const xy = psy.toXY();
            return xy.x + ',' + xy.y;
        }).join(' ') + (closePath ? ' z' : ''));
    }
    /**
     * Draw an axis line given an array of psychrometric states.
     */
    private drawAxis(data: PsyState[]): void {
        this.g.axes.appendChild(this.createLine(data, this.style.lineColor, 1.0));
    }
    /**
     * Create a line to append onto a parent element.
     */
    private createLine(data: PsyState[], color: Color, weight: number): SVGPathElement {
        const line = document.createElementNS(NS, 'path');
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', color.toString());
        line.setAttribute('stroke-width', weight + 'px');
        line.setAttribute('vector-effect', 'non-scaling-stroke');
        // Convert the array of psychrometric states into an array of (x,y) points.
        this.setPathData(line, data, false);
        return line;
    }
    /**
     * Draw an axis label.
     */
    private drawLabel(text: string, location: PsyState, anchor: TextAnchor, tooltip?: string): void {
        const label = this.createLabel(text, location.toXY(), this.style.fontColor, anchor);
        this.g.text.appendChild(label);
        if (!!tooltip) {
            label.addEventListener('mouseover', e => this.drawTooltip(tooltip, { x: e.offsetX, y: e.offsetY }, this.style.fontColor));
            label.addEventListener('mouseleave', () => this.clearChildren(this.g.tooltips));
        }
    }
    /**
     * Create a label to append onto a parent element.
     */
    private createLabel(text: string, location: Point, color: Color, anchor: TextAnchor): SVGTextElement {
        const label = document.createElementNS(NS, 'text');
        label.setAttribute('fill', color.toString());
        label.setAttribute('font-family', 'sans-serif');
        label.setAttribute('font-size', this.style.fontSize + 'px');
        // Use the `x`, `y`, `text-anchor`, and `dominant-baseline` properties to set the text anchor
        switch (anchor) {
            case (TextAnchor.NW): {
                label.setAttribute('x', (location.x + this.style.fontSize / 2).toString());
                label.setAttribute('y', (location.y + this.style.fontSize / 2).toString());
                label.setAttribute('text-anchor', 'start');
                label.setAttribute('dominant-baseline', 'hanging');
                break;
            }
            case (TextAnchor.N): {
                label.setAttribute('x', location.x.toString());
                label.setAttribute('y', (location.y + this.style.fontSize / 2).toString());
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('dominant-baseline', 'hanging');
                break;
            }
            case (TextAnchor.NE): {
                label.setAttribute('x', (location.x - this.style.fontSize / 2).toString());
                label.setAttribute('y', (location.y + this.style.fontSize / 2).toString());
                label.setAttribute('text-anchor', 'end');
                label.setAttribute('dominant-baseline', 'hanging');
                break;
            }
            case (TextAnchor.E): {
                label.setAttribute('x', (location.x - this.style.fontSize / 2).toString());
                label.setAttribute('y', location.y.toString());
                label.setAttribute('text-anchor', 'end');
                label.setAttribute('dominant-baseline', 'middle');
                break;
            }
            case (TextAnchor.SE): {
                label.setAttribute('x', (location.x - this.style.fontSize / 2).toString());
                label.setAttribute('y', (location.y - this.style.fontSize / 2).toString());
                label.setAttribute('text-anchor', 'end');
                label.setAttribute('dominant-baseline', 'alphabetic');
                break;
            }
            case (TextAnchor.S): {
                label.setAttribute('x', location.x.toString());
                label.setAttribute('y', (location.y - this.style.fontSize / 2).toString());
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('dominant-baseline', 'alphabetic');
                break;
            }
            case (TextAnchor.SW): {
                label.setAttribute('x', (location.x + this.style.fontSize / 2).toString());
                label.setAttribute('y', (location.y - this.style.fontSize / 2).toString());
                label.setAttribute('text-anchor', 'start');
                label.setAttribute('dominant-baseline', 'alphabetic');
                break;
            }
            case (TextAnchor.W): {
                label.setAttribute('x', (location.x + this.style.fontSize / 2).toString());
                label.setAttribute('y', location.y.toString());
                label.setAttribute('text-anchor', 'start');
                label.setAttribute('dominant-baseline', 'middle');
                break;
            }
            case (TextAnchor.C): {
                label.setAttribute('x', location.x.toString());
                label.setAttribute('y', location.y.toString());
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('dominant-baseline', 'middle');
                break;
            }
            default: {
                throw new Error('Text anchor ' + anchor + ' is invalid.');
            }
        }
        label.textContent = text;
        return label;
    }
    /**
     * Create a tooltip element.
     */
    private drawTooltip(text: string, location: Point, color: Color): void {
        const tooltipBase = document.createElementNS(NS, 'g'),
            labelElements: SVGTextElement[] = [],
            padding = 10,
            background = document.createElementNS(NS, 'rect');
        // Generate an array of SVGTextElement containing each line of this tooltip
        text.split('\n').forEach((line, i) => labelElements.push(this.createLabel(line, { x: 0, y: i * this.style.fontSize }, color.getContrastingColor(), TextAnchor.NW)));
        // Append the elements onto the window
        tooltipBase.appendChild(background);
        labelElements.forEach(element => tooltipBase.appendChild(element));
        this.g.tooltips.appendChild(tooltipBase);
        // Compute the maximum width of any line in this tooltip and height for the background
        const maxWidth = labelElements.map(element => element.getBBox().width).reduce((a, b) => Math.max(a, b)) + padding,
            maxHeight = labelElements.length * this.style.fontSize + padding;
        // Define styling properties for the tooltip background
        background.setAttribute('stroke', color.getContrastingColor().toString());
        background.setAttribute('fill', color.toString());
        background.setAttribute('x', '0');
        background.setAttribute('y', '0');
        background.setAttribute('width', maxWidth + 'px');
        background.setAttribute('height', maxHeight + 'px');
        background.setAttribute('rx', (padding / 2) + 'px');
        background.setAttribute('stroke-width', '1px');
        // Adjust the position if out-of-bounds
        if (location.x + padding + maxWidth > this.layout.size.x) {
            location.x -= (maxWidth + padding);
        } else {
            location.x += padding;
        }
        if (location.y + padding + maxHeight > this.layout.size.y) {
            location.y -= (maxHeight + padding);
        } else {
            location.y += padding;
        }
        tooltipBase.setAttribute('transform', 'translate(' + location.x + ',' + location.y + ')');
    }
    /**
     * Remove all the children from an element.
     */
    private clearChildren(element: Element): void {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
    /**
     * Produce a deep copy of an object.
     */
    private deepCopy<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
    /**
     * Plot one psychrometric state onto the psychrometric chart.
     */
    plot(state: Datum, id = 0, time: number = Date.now(), startTime: number = this.startTime, endTime: number = this.endTime): void {
        // Skip series that are missing a measurement point.
        if (typeof state.db !== 'number' || typeof state.other !== 'number') {
            return;
        }
        // Grab the corresponding data options
        const options: DataOptions = this.config.series[id];
        // Check for invalid timestamps.
        if (!Number.isFinite(time)) {
            throw new Error('Data timestamp is invalid for series ' + options.legend + '.');
        } else if (!Number.isFinite(startTime)) {
            throw new Error('Start timestamp is invalid for series ' + options.legend + '.');
        } else if (!Number.isFinite(endTime)) {
            throw new Error('End timestamp is invalid for series ' + options.legend + '.');
        }
        // Divide by 100 if relHumType is set to 'percent'
        if (state.measurement === 'dbrh' && options.relHumType === 'percent') {
            state.other /= 100;
        }
        const currentState = new PsyState(state),
            location = currentState.toXY();
        // Compute the current color to plot
        const normalized = JMath.normalize(time, startTime, endTime),
            color = Color.gradient(normalized, Psychart.gradients[options.gradient as GradientName] ?? Psychart.gradients.Viridis);
        // Determine whether to connect the states with a line
        if (!!this.lastState[id]) {
            this.g.trends.appendChild(this.createLine([this.lastState[id], currentState], color, +options.line));
        }
        this.lastState[id] = currentState;
        // Define a 0-length path element and assign its attributes.
        const point = document.createElementNS(NS, 'path');
        point.setAttribute('fill', 'none');
        point.setAttribute('stroke', color.toString());
        point.setAttribute('stroke-width', +options.pointRadius + 'px');
        point.setAttribute('stroke-linecap', 'round');
        point.setAttribute('vector-effect', 'non-scaling-stroke');
        point.setAttribute('d', 'M ' + location.x + ',' + location.y + ' h 0');
        this.g.points.appendChild(point);
        // Generate the text to display on mouse hover.
        const tooltipString: string = (options.legend ? options.legend + '\n' : '') +
            new Date(time).toLocaleString() + '\n' +
            JMath.round(currentState.db, 1) + this.units.temp + ' Dry Bulb\n' +
            JMath.round(currentState.rh * 100) + '% Rel. Hum.\n' +
            JMath.round(currentState.wb, 1) + this.units.temp + ' Wet Bulb\n' +
            JMath.round(currentState.dp, 1) + this.units.temp + ' Dew Point' +
            (options.advanced ? '\n' +
                JMath.round(currentState.hr, 2) + ' ' + this.units.hr + ' Hum. Ratio\n' +
                JMath.round(currentState.vp, 1) + ' ' + this.units.vp + ' Vap. Press.\n' +
                JMath.round(currentState.h, 1) + ' ' + this.units.h + ' Enthalpy\n' +
                JMath.round(currentState.v, 2) + ' ' + this.units.v + ' Volume' : '');
        // Set the behavior when the user interacts with this point
        point.addEventListener('mouseover', e => this.drawTooltip(tooltipString, { x: e.offsetX, y: e.offsetY }, color));
        point.addEventListener('mouseleave', () => this.clearChildren(this.g.tooltips));
    }
    /**
     * Draw a shaded region on Psychart.
     */
    drawRegion(states: Datum[], color: Color, tooltip?: string): void {
        // Add the first state to the data set
        const data: PsyState[] = [new PsyState(states[0])];
        for (let i = 1; i < states.length; i++) {
            const lastDatum = states[i - 1],
                currentDatum = states[i];
            // Check if iso-relative humidity (curved line)
            if (lastDatum.measurement === 'dbrh' && currentDatum.measurement === 'dbrh' && JMath.approx(lastDatum.other, currentDatum.other)) {
                const range = Math.abs(currentDatum.db - lastDatum.db);
                // Calculate several psychrometric states with a dry bulb step of `resolution`
                for (let i = 0; i < range; i += this.style.resolution) {
                    const db = JMath.translate(i, 0, range, lastDatum.db, currentDatum.db);
                    data.push(new PsyState({ db: db, other: lastDatum.other, measurement: 'dbrh' }));
                }
            }
            // Assume iso-dry bulb, wet bulb, or dew point (straight line)
            data.push(new PsyState(currentDatum));
        }
        // Create the SVG element to render the shaded region
        const region = document.createElementNS(NS, 'path');
        region.setAttribute('fill', color.toString());
        this.setPathData(region, data, true);
        this.g.regions.appendChild(region);
        // Optionally render a tooltip on mouse hover
        if (!!tooltip) {
            region.addEventListener('mouseover', e => this.drawTooltip(tooltip, { x: e.offsetX, y: e.offsetY }, color));
            region.addEventListener('mouseleave', () => this.clearChildren(this.g.tooltips));
        }
    }
    /**
     * Clear all plotted data from Psychart.
     */
    clearData(): void {
        this.lastState = {};
        this.clearChildren(this.g.points);
        this.clearChildren(this.g.trends);
    }
    /**
     * Clear all rendered regions from Psychart.
     */
    clearRegions(): void {
        this.clearChildren(this.g.regions);
    }
    /**
     * Return the SVG element to append on the parent.
     */
    getElement(): SVGElement {
        return this.base;
    }
}

/**
 * Represents where the origin is in relation to the text.
 */
enum TextAnchor {
    NW, N, NE, E, SE, S, SW, W, C
}
