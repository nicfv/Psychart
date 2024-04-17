import { SMath } from 'smath';
import { PsyOptions, Datum, Layout, Point } from 'types';
const Psychrolib = require('psychrolib');

/**
 * Represents a single air condition using several states.
 */
export class PsyState {
    /**
     * Dry Bulb
     */
    public readonly db: number;
    /**
     * Relative Humidity
     */
    public readonly rh: number = 0;
    /**
     * Wet Bulb
     */
    public readonly wb: number = 0;
    /**
     * Dew Point
     */
    public readonly dp: number = 0;
    /**
     * Humidity Ratio
     */
    public readonly hr: number = 0;
    /**
     * Vapor Pressure
     */
    public readonly vp: number = 0;
    /**
     * Moist Air Enthalpy
     */
    public readonly h: number = 0;
    /**
     * Moist Air Volume
     */
    public readonly v: number = 0;
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
     * Psychart panel size
     */
    private static size: Point;
    /**
     * Psychart panel padding
     */
    private static padding: Point;
    /**
     * Render a Mollier diagram instead
     */
    private static flipXY: boolean;
    /**
     * Compute a first-time initialization of psychrolib.
     */
    public static initialize(layout: Layout, config: PsyOptions): void {
        PsyState.size = layout.size;
        PsyState.padding = layout.padding;
        PsyState.flipXY = config.flipXY;
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
    public toXY(): Point {
        if (PsyState.flipXY) {
            return {
                x: SMath.clamp(SMath.translate(this.hr, 0, PsyState.hrMax, PsyState.padding.x, PsyState.size.x - PsyState.padding.x), PsyState.padding.x, PsyState.size.x - PsyState.padding.x),
                y: SMath.clamp(SMath.translate(this.db, PsyState.dbMin, PsyState.dbMax, PsyState.size.y - PsyState.padding.y, PsyState.padding.y), PsyState.padding.y, PsyState.size.y - PsyState.padding.y)
            }
        } else {
            return {
                x: SMath.clamp(SMath.translate(this.db, PsyState.dbMin, PsyState.dbMax, PsyState.padding.x, PsyState.size.x - PsyState.padding.x), PsyState.padding.x, PsyState.size.x - PsyState.padding.x),
                y: SMath.clamp(SMath.translate(this.hr, 0, PsyState.hrMax, PsyState.size.y - PsyState.padding.y, PsyState.padding.y), PsyState.padding.y, PsyState.size.y - PsyState.padding.y)
            };
        }
    }
}
