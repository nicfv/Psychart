import { Color } from './color';
import { PsyState } from './psystate';
import { ChartOptions, Layout, Point, StyleOptions } from './types';

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
        this.base.setAttribute('viewBox', '0 0 ' + this.layout.size.x + ' ' + this.layout.size.y);
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
            // Draw the axis and the label
            this.drawLine(data, this.style.lineColor, 1.0);
            this.drawLabel(db + this.units.temp, data[0], TextAnchor.N, 'Dry Bulb');
        }
        // Draw constant dew point horizontal lines.
        for (let dp = 0; dp <= this.chartOpts.dpMax; dp += this.style.major) {
            const data: PsyState[] = [];
            // The left point is on the saturation line (db = dp)
            data.push(new PsyState({ db: dp, dp: dp }, this.chartOpts));
            // The right point is at the maximum dry bulb temperature
            data.push(new PsyState({ db: this.chartOpts.dbMax, dp: dp }, this.chartOpts));
            // Draw the axis and the label
            this.drawLine(data, this.style.lineColor, 1.0);
            this.drawLabel(dp + this.units.temp, data[1], TextAnchor.W, 'Dew Point');
        }
        // Draw constant wet bulb diagonal lines.
        for (let wb = this.chartOpts.dbMin; wb <= this.chartOpts.dpMax; wb += this.style.major) {
            const data: PsyState[] = [];
            // Dry bulb is always equal or greater than wet bulb.
            for (let db = wb; db <= this.chartOpts.dbMax; db += this.style.resolution) {
                data.push(new PsyState({ db: db, wb: wb }, this.chartOpts));
            }
            // Draw the axis and the label
            this.drawLine(data, this.style.lineColor, 1.0);
            this.drawLabel(wb + this.units.temp, data[0], TextAnchor.SE, 'Wet Bulb');
        }
        // Draw constant relative humidity lines.
        for (let rh = 0; rh <= 100; rh += this.style.major) {
            const data: PsyState[] = [];
            let preferredAnchor: TextAnchor = TextAnchor.NE;
            // Must iterate through all dry bulb temperatures to calculate each Y-coordinate
            for (let db = this.chartOpts.dbMin; db <= this.chartOpts.dbMax; db += this.style.resolution) {
                data.push(new PsyState({ db: db, rh: rh / 100 }, this.chartOpts));
                // Stop drawing when the line surpasses the bounds of the chart
                if (data[data.length - 1].dp >= this.chartOpts.dpMax) {
                    preferredAnchor = TextAnchor.S;
                    break;
                }
            }
            // Draw the axis and the label
            this.drawLine(data, this.style.lineColor, 1.0);
            if (rh > 0 && rh < 100) {
                this.drawLabel(rh + '%', data[data.length - 1], preferredAnchor, 'Relative Humidity');
            }
        }
    }
    /**
     * Draw an axis line given an array of psychrometric states.
     */
    private drawLine(data: PsyState[], color: Color, weight: number): void {
        const line = document.createElementNS(NS, 'path');
        this.g.axes.appendChild(line);
        line.setAttribute('fill', 'none');
        line.setAttribute('stroke', color.toString());
        line.setAttribute('stroke-width', weight + 'px');
        line.setAttribute('vector-effect', 'non-scaling-stroke');
        // Convert the array of psychrometric states into an array of (x,y) points.
        line.setAttribute('d', 'M ' + data.map(psy => {
            const point = psy.toXY(this.layout, this.chartOpts);
            return point.x + ',' + point.y;
        }).join(' '));
    }
    /**
     * Draw an axis label.
     */
    private drawLabel(text: string, location: PsyState, anchor: TextAnchor, tooltip?: string): void {
        const label = this.createLabel(text, location.toXY(this.layout, this.chartOpts), this.style.fontColor, anchor);
        this.g.text.appendChild(label);
        if (!!tooltip) {
            label.addEventListener('mouseover', () => this.drawTooltip(tooltip, location.toXY(this.layout, this.chartOpts), this.style.fontColor));
            label.addEventListener('mouseleave', () => this.clearChildren(this.g.tooltips));
        }
    }
    /**
     * Create a label and append it onto the `parent` element.
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
     * Return the SVG element to append on the parent.
     */
    getElement() {
        return this.base;
    }
}

/**
 * Represents where the origin is in relation to the text.
 */
enum TextAnchor {
    NW, N, NE, E, SE, S, SW, W, C
}