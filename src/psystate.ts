import { JMath } from './jmath';
import * as Psychrolib from './psychrolib';
import { ChartOptions, Datum, Layout, Point } from './types';

/**
 * Represents a single air condition using several states.
 */
export class PsyState {
    /**
     * Dry Bulb
     */
    readonly db: number;
    /**
     * Relative Humidity
     */
    readonly rh: number;
    /**
     * Wet Bulb
     */
    readonly wb: number;
    /**
     * Dew Point
     */
    readonly dp: number;
    /**
     * Humidity Ratio
     */
    readonly hr: number;
    /**
     * Vapor Pressure
     */
    readonly vp: number;
    /**
     * Moist Air Enthalpy
     */
    readonly h: number;
    /**
     * Moist Air Volume
     */
    readonly v: number;
    /**
     * Standard Atmospheric Air Pressure
     */
    readonly atm: number;
    /**
     * Initialize a new psychrometric state.
     */
    constructor(state: Datum, chartOpts: ChartOptions) {
        Psychrolib.SetUnitSystem(chartOpts.unitSystem === 'IP' ? Psychrolib.IP : Psychrolib.SI);
        this.atm = Psychrolib.GetStandardAtmPressure(chartOpts.altitude);
        if (typeof state.rh === 'number') {
            const PSY_CALC = Psychrolib.CalcPsychrometricsFromRelHum(state.db, state.rh, this.atm);
            this.db = state.db;
            this.rh = state.rh;
            this.wb = PSY_CALC[1];
            this.dp = PSY_CALC[2];
            this.hr = PSY_CALC[0];
            this.vp = PSY_CALC[3];
            this.h = PSY_CALC[4];
            this.v = PSY_CALC[5];
        }
        else if (typeof state.wb === 'number') {
            const PSY_CALC = Psychrolib.CalcPsychrometricsFromTWetBulb(state.db, state.wb, this.atm);
            this.db = state.db;
            this.rh = PSY_CALC[2];
            this.wb = state.wb;
            this.dp = PSY_CALC[1];
            this.hr = PSY_CALC[0];
            this.vp = PSY_CALC[3];
            this.h = PSY_CALC[4];
            this.v = PSY_CALC[5];
        }
        else if (typeof state.dp === 'number') {
            const PSY_CALC = Psychrolib.CalcPsychrometricsFromTDewPoint(state.db, state.dp, this.atm);
            this.db = state.db;
            this.rh = PSY_CALC[2];
            this.wb = PSY_CALC[1];
            this.dp = state.dp;
            this.hr = PSY_CALC[0];
            this.vp = PSY_CALC[3];
            this.h = PSY_CALC[4];
            this.v = PSY_CALC[5];
        }
    }
    /**
     * Convert this psychrometric state to an X-Y coordinate on a psychrometric chart.
     */
    toXY(layout: Layout, chartOpts: ChartOptions): Point {
        const HR_MAX = Psychrolib.GetHumRatioFromTDewPoint(chartOpts.dpMax, this.atm);
        return new Point(
            JMath.clamp(JMath.translate(this.db, chartOpts.dbMin, chartOpts.dbMax, layout.padding, layout.size.x - layout.padding), layout.padding, layout.size.x - layout.padding),
            JMath.clamp(layout.size.y - JMath.translate(this.hr, 0, HR_MAX, layout.padding, layout.size.y - layout.padding), layout.padding, layout.size.y - layout.padding));
    }
}