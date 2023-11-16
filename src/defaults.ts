import { DataOptions, PsyOptions } from 'types';

export function getDefaultPsyOptions(): PsyOptions {
    return {
        altitude: 0,
        count: 0,
        dbMax: 120,
        dbMin: 20,
        dpMax: 90,
        regions: [],
        series: {},
        unitSystem: 'IP',
    };
}

export function getDefaultDataOptions(legend = ''): DataOptions {
    return {
        advanced: false,
        dryBulb: '',
        gradient: 'Viridis',
        legend: legend,
        line: true,
        measurement: 'dbwb',
        other: '',
        pointRadius: 5,
        relHumType: 'percent',
    };
}
