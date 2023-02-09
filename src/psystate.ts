import { Point } from './point';
import { JMath } from './jmath';
import * as Psychrolib from './psychrolib';

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
    private readonly atm: number;
    /**
     * Initialize a new psychrometric state.
     */
    constructor(state: { db: number, rh?: number, wb?: number, dp?: number }, unitSystem: 'IP' | 'SI', altitude: number) {
        Psychrolib.SetUnitSystem(unitSystem === 'IP' ? Psychrolib.IP : Psychrolib.SI);
        this.atm = Psychrolib.GetStandardAtmPressure(altitude);
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
    toXY(width: number, height: number, padding: number, db_min: number, db_max: number, hr_min: number, hr_max: number): Point {
        return new Point(
            JMath.translate(this.db, db_min, db_max, padding, width - padding),
            height - JMath.translate(this.hr, hr_min, hr_max, padding, height - padding)
        );
    }
}