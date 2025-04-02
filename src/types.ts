import { PsychartOptions, DataOptions } from 'psychart';

export type DataSeries = { [index: number]: GrafanaDataOptions };

export interface GrafanaPsychartOptions extends PsychartOptions {
    readonly mollier: boolean;
    readonly count: number;
    readonly series: DataSeries;
}

export interface GrafanaDataOptions extends DataOptions {
    readonly dryBulb: string;
    readonly other: string;
    readonly measurement: 'dbwb' | 'dbdp' | 'dbrh';
}
