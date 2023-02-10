import { Color } from './color';
import { Point } from './point';
import { PsyState } from './psystate';
import { ChartOptions, Layout, StyleOptions } from './types';

const NS = 'http://www.w3.org/2000/svg';

export class Psychart {
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
     * Layout settings for Psychart.
     */
    private readonly layout = {} as Layout;
    /**
     * Configuration options for Psychart.
     */
    private readonly chartOpts = {} as ChartOptions;
    /**
     * Configuration options for Psychart.
     */
    private readonly style = {} as StyleOptions;
    /**
     * Construct a new instance of `Psychart` given various configuration properties.
     */
    constructor(newLayout: Layout, newChartOptions: ChartOptions, newStyleOptions: StyleOptions) {
        // Set internal variables.
        this.layout = newLayout;
        this.chartOpts = newChartOptions;
        this.style = newStyleOptions;
        // Set the chart's viewport size.
        this.base.setAttribute('viewBox', '0 0 ' + this.layout.size.x + ' ' + this.layout.size.y)
        // Sets the displayed units based on the unit system.
        this.units.temp = '\u00B0' + (this.chartOpts.unitSystem === 'IP' ? 'F' : 'C');
        this.units.hr = (this.chartOpts.unitSystem === 'IP' ? 'lbw/lba' : 'kgw/kga');
        this.units.vp = (this.chartOpts.unitSystem === 'IP' ? 'Psi' : 'Pa');
        this.units.h = (this.chartOpts.unitSystem === 'IP' ? 'Btu/lb' : 'J/kg');
        this.units.v = (this.chartOpts.unitSystem === 'IP' ? 'ft\u00B3/lb' : 'm\u00B3/kg');
        // Create new SVG groups, and append all the
        // layers into the chart.
        for (let groupName in this.g) {
            this.base.appendChild(this.g[groupName]);
        }
        // Draw constant dry bulb vertical lines.
        for (let db = this.chartOpts.dbMin; db <= this.chartOpts.dbMax; db += this.style.major) {
            const data: PsyState[] = [];
            // The lower point is on the X-axis (rh = 0%)
            data.push(new PsyState({ db: db, rh: 0 }, this.chartOpts));
            // The upper point is on the saturation line (rh = 100%)
            data.push(new PsyState({ db: db, rh: 1 }, this.chartOpts));
            this.drawLine(data, this.style.lineColor, 1.5);
        }
        // Draw constant dew point horizontal lines.
        for (let dp = 0; dp <= this.chartOpts.dpMax; dp += this.style.major) {
            const data: PsyState[] = [];
            // The left point is on the saturation line (db = dp)
            data.push(new PsyState({ db: dp, dp: dp }, this.chartOpts));
            // The right point is at the maximum dry bulb temperature
            data.push(new PsyState({ db: this.chartOpts.dbMax, dp: dp }, this.chartOpts));
            this.drawLine(data, this.style.lineColor, 1.5);
        }
    }
    /**
     * Draw an axis line using an absolute coordinate system.
     */
    private drawLine(data: PsyState[], color: Color, weight: number) {
        const line = document.createElementNS(NS, 'path');
        this.g.axes.appendChild(line);
        line.setAttribute('stroke', color.toString());
        line.setAttribute('stroke-width', weight + 'px');
        line.setAttribute('vector-effect', 'non-scaling-stroke');
        line.setAttribute('d', 'M ' + data.map(psy => psy.toXY(this.layout, this.chartOpts).toString()).join(' '));
    }
    /**
     * Return the SVG element to append on the parent.
     */
    getElement() {
        return this.base;
    }
}