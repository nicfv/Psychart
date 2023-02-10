import { Color } from './color';
import { Point } from './point';
import { PsyState } from './psystate';
import { UnitSystem } from './types';

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
     * Defines the chart bounds (dry bulb on the `x` axis and humidity ratio on the `y` axis.)
     */
    private readonly bounds = {
        db: {
            min: 0,
            max: 0,
        },
        hr: {
            min: 0,
            max: 0,
        },
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
    constructor(size: Point, unitSystem: UnitSystem, dbMin: number, dbMax: number, dpMax: number, altitude: number, advanced: boolean, lineColor: Color, textColor: Color) {
        // Set the chart's viewport size.
        this.base.setAttribute('viewBox', '0 0 ' + size.x + ' ' + size.y)
        // Sets the displayed units based on the unit system.
        console.log(this.units, typeof this.units, JSON.stringify(this.units));
        this.units.temp = '\u00B0' + (unitSystem === 'IP' ? 'F' : 'C');
        this.units.hr = (unitSystem === 'IP' ? 'lbw/lba' : 'kgw/kga');
        this.units.vp = (unitSystem === 'IP' ? 'Psi' : 'Pa');
        this.units.h = (unitSystem === 'IP' ? 'Btu/lb' : 'J/kg');
        this.units.v = (unitSystem === 'IP' ? 'ft\u00B3/lb' : 'm\u00B3/kg');
        // Calculate the bounds of the graph, including
        // the maximum humidity ratio to display.
        this.bounds.db.min = dbMin;
        this.bounds.db.max = dbMax;
        this.bounds.hr.min = 0;
        this.bounds.hr.max = new PsyState({ db: 0, dp: dpMax }, unitSystem, altitude).hr;
        // Create new SVG groups, and append all the
        // layers into the chart.
        for (let groupName in this.g) {
            this.base.appendChild(this.g[groupName]);
        }
        // Draw constant dry bulb vertical lines.
        for (let db = this.bounds.db.min; db <= this.bounds.db.max; db += 10) {
            const data: Point[] = [];
        }
    }
    /**
     * Draw a line using an absolute coordinate system.
     */
    private drawLine(data: Point[], color: Color, weight: number) {
        const line = document.createElementNS(NS, 'path');
        this.g.axes.appendChild(line);
        line.setAttribute('stroke', color.toString());
        line.setAttribute('stroke-width', weight + 'px');
        line.setAttribute('vector-effect', 'non-scaling-stroke');
        line.setAttribute('d', 'M ' + data.map(point => point.toString()).join(' '));
    }
    /**
     * Return the element to append on the parent.
     */
    getElement() {
        return this.base;
    }
}