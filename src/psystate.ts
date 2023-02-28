import { JMath } from './jmath';
import { PsyOptions, Datum, Layout, Point } from './types';
const Psychrolib = require('psychrolib');

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
    readonly rh: number = 0;
    /**
     * Wet Bulb
     */
    readonly wb: number = 0;
    /**
     * Dew Point
     */
    readonly dp: number = 0;
    /**
     * Humidity Ratio
     */
    readonly hr: number = 0;
    /**
     * Vapor Pressure
     */
    readonly vp: number = 0;
    /**
     * Moist Air Enthalpy
     */
    readonly h: number = 0;
    /**
     * Moist Air Volume
     */
    readonly v: number = 0;
    /**
     * Standard Atmospheric Air Pressure
     */
    private static atm: number;
    /**
     * Minimum Dry Bulb
     */
    private static dbMin: number;
    /**
     * Maximum Dry Bulb
     */
    private static dbMax: number;
    /**
     * Maximum Humidity Ratio
     */
    private static hrMax: number;
    /**
     * Psychart panel width
     */
    private static width: number;
    /**
     * Psychart panel height
     */
    private static height: number;
    /**
     * Psychart panel padding
     */
    private static padding: number;
    /**
     * Compute a first-time initialization of psychrolib.
     */
    static initialize(layout: Layout, config: PsyOptions): void {
        PsyState.width = layout.size.x;
        PsyState.height = layout.size.y;
        PsyState.padding = layout.padding;
        Psychrolib.SetUnitSystem(config.unitSystem === 'IP' ? Psychrolib.IP : Psychrolib.SI);
        PsyState.atm = Psychrolib.GetStandardAtmPressure(config.altitude);
        PsyState.dbMin = config.dbMin;
        PsyState.dbMax = config.dbMax;
        PsyState.hrMax = Psychrolib.GetHumRatioFromTDewPoint(config.dpMax, PsyState.atm);
    }
    /**
     * Initialize a new psychrometric state.
     */
    constructor(state: Datum) {
        this.db = state.db;
        if (typeof state.rh === 'number') {
            const PSY_CALC = Psychrolib.CalcPsychrometricsFromRelHum(state.db, state.rh, PsyState.atm);
            this.rh = state.rh;
            this.wb = PSY_CALC[1];
            this.dp = PSY_CALC[2];
            this.hr = PSY_CALC[0];
            this.vp = PSY_CALC[3];
            this.h = PSY_CALC[4];
            this.v = PSY_CALC[5];
        }
        else if (typeof state.wb === 'number') {
            const PSY_CALC = Psychrolib.CalcPsychrometricsFromTWetBulb(state.db, state.wb, PsyState.atm);
            this.rh = PSY_CALC[2];
            this.wb = state.wb;
            this.dp = PSY_CALC[1];
            this.hr = PSY_CALC[0];
            this.vp = PSY_CALC[3];
            this.h = PSY_CALC[4];
            this.v = PSY_CALC[5];
        }
        else if (typeof state.dp === 'number') {
            const PSY_CALC = Psychrolib.CalcPsychrometricsFromTDewPoint(state.db, state.dp, PsyState.atm);
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
    toXY(): Point {
        return {
            x: JMath.clamp(JMath.translate(this.db, PsyState.dbMin, PsyState.dbMax, PsyState.padding, PsyState.width - PsyState.padding), PsyState.padding, PsyState.width - PsyState.padding),
            y: JMath.clamp(PsyState.height - JMath.translate(this.hr, 0, PsyState.hrMax, PsyState.padding, PsyState.height - PsyState.padding), PsyState.padding, PsyState.height - PsyState.padding)
        };
    }
}
