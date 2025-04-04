import { Palette, PaletteName } from 'viridis';
import { GrafanaDataOptions, GrafanaPsychartOptions } from './types';
import { PsychartOptions } from 'psychart';

/**
 * Get the default colors for this theme.
 */
export function getColors(darkTheme: boolean): PsychartOptions['colors'] {
    return {
        axis: darkTheme ? '#303030' : '#E0E0E0',
        font: darkTheme ? '#D0D0D0' : '#202020',
        regionGradient: 'Purplish',
    };
}

/**
 * The list of all selectable gradient names.
 */
export const GradientNames: PaletteName[] = Object.keys(Palette).filter(name => name !== getColors(false).regionGradient).map(name => name as PaletteName);

/**
 * Default options for Psychart.
 */
export const defaultGrafanaOptions: GrafanaPsychartOptions = {
    altitude: 0,
    count: 0,
    dbMax: 120,
    dbMin: 20,
    dpMax: 90,
    major: {
        humRat: 10,
        relHum: 10,
        temp: 10,
    },
    mollier: false,
    regions: [],
    series: [],
    showLegend: true,
    unitSystem: 'IP',
};

/**
 * Default options for a data series.
 */
export const defaultDataOptions: GrafanaDataOptions = {
    advanced: false,
    dryBulb: '',
    gradient: 'Viridis',
    line: true,
    measurement: 'dbrh',
    other: '',
    pointRadius: 5,
    relHumType: 'percent',
    seriesName: '',
};
