import { Color } from './color';

/**
 * Represents an `(x,y)` cartesian coordinate pair.
 */
export class Point {
    /**
     * The x-coordinate (horizontal)
     */
    x: number;
    /**
     * The y-coordinate (vertical)
     */
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    toString(): string {
        return this.x + ',' + this.y;
    }
}

export interface Layout {
    /**
     * The outer size of Psychart, in pixels.
     */
    size: Point;
    /**
     * The padding in pixels.
     */
    padding: number;
}

export interface Datum {
    /**
     * Dry Bulb (Required)
     */
    db: number;
    /**
     * Relative Humidity (Optional)
     */
    rh?: number;
    /**
     * Wet Bulb (Optional)
     */
    wb?: number;
    /**
     * Dew Point (Optional)
     */
    dp?: number;
}

export interface StyleOptions {
    /**
     * The font color.
     */
    fontColor: Color;
    /**
     * The axis color.
     */
    lineColor: Color;
    /**
     * The font size, in pixels.
     */
    fontSize: number;
    /**
     * The chart resolution, in units.
     */
    resolution: number;
    /**
     * The major axis interval.
     */
    major: number;
    /**
     * The minor axis interval. (Optional)
     */
    minor?: number;
}

export interface ChartOptions {
    /**
     * Represents the unit system, in either US (IP) or metric (SI)
     */
    unitSystem: 'IP' | 'SI';
    /**
     * The altitude of measurements taken.
     */
    altitude: number;
    /**
     * The minimum value on the dry bulb axis.
     */
    dbMin: number;
    /**
     * The maximum value on the dry bulb axis.
     */
    dbMax: number;
    /**
     * The maximum value on the dew point axis.
     */
    dpMax: number;
}

export interface DataOptions {
    /**
     * The type of measurements that were taken.
     */
    measurements: 'dbwb' | 'dbrh' | 'dbdp';
    /**
     * The name of the dry bulb series.
     */
    dryBulb: string;
    /**
     * The name of the wet bulb series.
     */
    wetBulb: string;
    /**
     * The name of the dew point series.
     */
    dewPoint: string;
    /**
     * The name of the relative humidity series.
     */
    relHum: string;
    /**
     * The relative humidity measurement type, in percent [0-100] or float [0.0-1.0]
     */
    relHumType: 'percent' | 'float';
}

export interface DisplayOptions {
    /**
     * The point radius, in pixels.
     */
    pointRadius: number;
    /**
     * Determines whether or not to connect points with a line.
     */
    lineWidth: number;
    /**
     * Determines the color gradient for time series plots.
     */
    gradient: 'viridis' | 'inferno' | 'magma' | 'plasma';
    /**
     * Defines whether or not to show advanced state variables.
     */
    advanced: boolean;
}

export interface PsyOptions extends ChartOptions, DataOptions, DisplayOptions {
    // unitSystem: UnitSystem;
    // altitude: number;
    // dbMin: number;
    // dbMax: number;
    // dpMax: number;
    // measurements: MeasurementType;
    // dryBulb: string;
    // wetBulb: string;
    // dewPoint: string;
    // relHum: string;
    // relHumType: RelHumType;
    regions: string[];
    // ptr: number;
    // line: boolean;
    // gradient: Gradient;
    // advanced: boolean;
}