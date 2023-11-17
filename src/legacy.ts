import { getDefaultDataOptions } from 'defaults';
import { GradientName, Measurement, PsyOptions } from 'types';
import { cleanPsyOptions } from 'validator';

/**
 * @deprecated Converts old legacy panel editor options into the new format.
 */
export function legacyOptions(old: { [index: string]: any }): PsyOptions {
    const clean = cleanPsyOptions(old);
    // Determine if the options are legacy based on whether it contains `measurements`
    if (typeof old.measurements === 'undefined') {
        console.log('Using clean slate.');
        return clean;
    }
    console.log('Upgrading legacy options.');
    clean.count = 1;
    clean.series[0] = getDefaultDataOptions();
    if (typeof old.dryBulb === 'string') {
        clean.series[0].dryBulb = old.dryBulb;
    }
    switch (old?.measurements as Measurement) {
        case ('dbdp'): {
            clean.series[0].measurement = 'dbdp';
            if (typeof old.dewPoint === 'string') {
                clean.series[0].other = old.dewPoint;
            }
            break;
        }
        case ('dbwb'): {
            clean.series[0].measurement = 'dbwb';
            if (typeof old.wetBulb === 'string') {
                clean.series[0].other = old.wetBulb;
            }
            break;
        }
        case ('dbrh'): {
            clean.series[0].measurement = 'dbrh';
            if (typeof old.relHum === 'string') {
                clean.series[0].other = old.relHum;
            }
            if (typeof old.relHumType === 'string') {
                clean.series[0].relHumType = old.relHumType as 'percent' | 'float';
            }
            break;
        }
        default: {
            console.log('Old measurement type = ' + old.measurements);
        }
    }
    if (typeof old.pointRadius === 'number') {
        clean.series[0].pointRadius = old.pointRadius;
    }
    if (typeof old.line === 'boolean') {
        clean.series[0].line = old.line;
    }
    if (typeof old.gradient === 'string') {
        clean.series[0].gradient = old.gradient as GradientName;
    }
    if (typeof old.advanced === 'boolean') {
        clean.series[0].advanced = old.advanced;
    }
    // delete old.measurements;
    console.log(JSON.stringify(old, null, 2), JSON.stringify(clean, null, 2));
    return clean;
}
