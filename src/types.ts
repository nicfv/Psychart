import Color from 'color';

export type Measurement = 'dbwb' | 'dbrh' | 'dbdp';
export type RegionName = 'Summer (sitting)' | 'Summer (walking)' | 'Summer (light work)' | 'Winter (sitting)' | 'Winter (walking)' | 'Winter (light work)' | 'Data Center A4' | 'Data Center A3' | 'Data Center A2' | 'Data Center A1' | 'Data Center Recommended (low pollutants)' | 'Data Center Recommended (high pollutants)';
export type GradientName = 'Viridis' | 'Inferno' | 'Magma' | 'Plasma' | 'Emerald' | 'Mint' | 'Sunset' | 'Dusk' | 'Blue';
export type DataSeries = { [index: number]: DataOptions };

export interface Point {
    /**
     * The x-coordinate (horizontal)
     */
    x: number;
    /**
     * The y-coordinate (vertical)
     */
    y: number;
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
     * Dry Bulb
     */
    db: number;
    /**
     * One of these values, depending on `measurement`
     * - Relative Humidity
     * - Wet Bulb
     * - Dew Point
     */
    other: number;
    /**
     * The type of measurements that were taken.
     */
    measurement: Measurement;
}

export interface Region {
    /**
     * The text to display on mouse hover
     */
    tooltip: string;
    /**
     * The data that represents the boundary of this region
     */
    data: Datum[];
}

export interface StyleOptions {
    /**
     * Determines whether or not the user is using a dark theme.
     */
    darkTheme: boolean;
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
     * The default time span (ms) between the first and last plotted point.
     */
    timeSpan: number;
}

export interface PsyOptions {
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
    /**
     * Render pre-defined shaded regions.
     */
    regions: RegionName[];
    /**
     * The number of data series to render.
     */
    count: number;
    /**
     * The data series information.
     */
    series: DataSeries;
}

export interface DataOptions {
    /**
     * Add a label to this data series.
     */
    legend: string;
    /**
     * The type of measurements that were taken.
     */
    measurement: Measurement;
    /**
     * The name of the dry bulb series.
     */
    dryBulb: string;
    /**
     * The name of the wet bulb, dew point, or relative humidity series, depending on `measurement`.
     */
    other: string;
    /**
     * The relative humidity measurement type, in percent [0-100] or float [0.0-1.0]
     */
    relHumType: 'percent' | 'float';
    /**
     * The point radius, in pixels.
     */
    pointRadius: number;
    /**
     * Determines whether or not to connect points with a line.
     */
    line: boolean;
    /**
     * Determines the color gradient for time series plots.
     */
    gradient: GradientName;
    /**
     * Defines whether or not to show advanced state variables.
     */
    advanced: boolean;
}
