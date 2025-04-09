import { DataOptions, PsychartOptions } from 'psychart';

export type DataSeries = { [index: number]: GrafanaDataOptions };

export interface GrafanaPsychartOptions {
    readonly altitude: PsychartOptions['altitude'];
    readonly dbMax: PsychartOptions['dbMax'];
    readonly dbMin: PsychartOptions['dbMin'];
    readonly dpMax: PsychartOptions['dpMax'];
    readonly major: PsychartOptions['major'];
    readonly regions: PsychartOptions['regions'];
    readonly unitSystem: PsychartOptions['unitSystem'];
    readonly showLegend: boolean;
    readonly mollier: boolean;
    readonly count: number;
    readonly series: DataSeries;
}

export interface GrafanaDataOptions {
    readonly advanced: DataOptions['advanced'];
    readonly gradient: DataOptions['gradient'];
    readonly line: DataOptions['line'];
    readonly pointRadius: DataOptions['pointRadius'];
    readonly relHumType: DataOptions['relHumType'];
    readonly seriesName: DataOptions['name'];
    readonly dryBulb: string;
    readonly other: string;
    readonly measurement: 'dbwb' | 'dbdp' | 'dbrh';
}
