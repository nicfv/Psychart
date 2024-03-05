import { SMath, Polate } from 'smath';
import { PsyOptions, Datum, Layout, Point } from 'types';
const Psychrolib = require('psychrolib');

/**
 * Represents a single air condition using several states.
 */
export default class PsyState {
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
        switch (state.measurement) {
            case ('dbrh'): {
                const PSY_CALC = Psychrolib.CalcPsychrometricsFromRelHum(state.db, state.other, PsyState.atm);
                this.rh = state.other;
                this.wb = PSY_CALC[1];
                this.dp = PSY_CALC[2];
                this.hr = PSY_CALC[0];
                this.vp = PSY_CALC[3];
                this.h = PSY_CALC[4];
                this.v = PSY_CALC[5];
                break;
            }
            case ('dbwb'): {
                const PSY_CALC = Psychrolib.CalcPsychrometricsFromTWetBulb(state.db, state.other, PsyState.atm);
                this.rh = PSY_CALC[2];
                this.wb = state.other;
                this.dp = PSY_CALC[1];
                this.hr = PSY_CALC[0];
                this.vp = PSY_CALC[3];
                this.h = PSY_CALC[4];
                this.v = PSY_CALC[5];
                break;
            }
            case ('dbdp'): {
                const PSY_CALC = Psychrolib.CalcPsychrometricsFromTDewPoint(state.db, state.other, PsyState.atm);
                this.rh = PSY_CALC[2];
                this.wb = PSY_CALC[1];
                this.dp = state.other;
                this.hr = PSY_CALC[0];
                this.vp = PSY_CALC[3];
                this.h = PSY_CALC[4];
                this.v = PSY_CALC[5];
                break;
            }
            default: {
                throw new Error('Invalid measurement type ' + state.measurement + '.');
            }
        }
    }
    /**
     * Convert this psychrometric state to an X-Y coordinate on a psychrometric chart.
     */
    toXY(): Point {
        return {
            x: SMath.clamp(Polate.translate(this.db, PsyState.dbMin, PsyState.dbMax, PsyState.padding, PsyState.width - PsyState.padding), PsyState.padding, PsyState.width - PsyState.padding),
            y: SMath.clamp(PsyState.height - Polate.translate(this.hr, 0, PsyState.hrMax, PsyState.padding, PsyState.height - PsyState.padding), PsyState.padding, PsyState.height - PsyState.padding)
        };
    }
}
