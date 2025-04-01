import { GrafanaDataOptions, GrafanaPsychartOptions } from './types';

export function getAxisColor(darkTheme: boolean): string {
    return darkTheme ? '#303030' : '#E0E0E0';
}

export function getFontColor(darkTheme: boolean): string {
    return darkTheme ? '#D0D0D0' : '#202020';
}

export const defaultGrafanaOptions: GrafanaPsychartOptions = {
    altitude: 0,
    colors: {
        axis: '#E0E0E0',
        font: '#202020',
        regionGradient: 'Purplish',
    },
    count: 0,
    dbMax: 120,
    dbMin: 20,
    dpMax: 90,
    flipGradients: false,
    flipXY: false,
    font: {
        family: 'sans-serif',
        size: 12,
    },
    lineHeight: 1.25,
    major: {
        humRat: 10,
        relHum: 10,
        temp: 10,
    },
    mollier: false,
    padding: { x: 40, y: 20 },
    regions: [],
    resolution: 0.5,
    series: [],
    showUnits: {
        axis: true,
        tooltip: true,
    },
    size: { x: 0, y: 0 },
    unitSystem: 'IP',
    yAxis: 'dp',
};

export const defaultDataOptions: GrafanaDataOptions = {
    advanced: false,
    color: '#000000',
    dryBulb: '',
    enabled: true,
    gradient: 'Viridis',
    line: true,
    measurement: 'dbrh',
    other: '',
    pointName: '',
    pointRadius: 5,
    relHumType: 'percent',
    seriesName: '',
    time: {
        now: NaN,
        start: NaN,
        end: NaN,
    },
};
