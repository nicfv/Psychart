import { PsychartTypes } from 'psychart';

export interface GrafanaPsychartOptions {
    readonly altitude: PsychartTypes.Options['altitude'];
    readonly dbMax: PsychartTypes.Options['dbMax'];
    readonly dbMin: PsychartTypes.Options['dbMin'];
    readonly dpMax: PsychartTypes.Options['dpMax'];
    readonly major: PsychartTypes.Options['major'];
    readonly regions: PsychartTypes.Options['regions'];
    readonly unitSystem: PsychartTypes.Options['unitSystem'];
    readonly showLegend: boolean;
    readonly mollier: boolean;
    readonly count: number;
    readonly series: { [index: number]: GrafanaDataOptions };
}

export interface GrafanaDataOptions {
    readonly advanced: PsychartTypes.DataOptions['advanced'];
    readonly gradient: PsychartTypes.DataOptions['gradient'];
    readonly line: PsychartTypes.DataOptions['line'];
    readonly pointRadius: PsychartTypes.DataOptions['pointRadius'];
    readonly relHumType: PsychartTypes.DataOptions['relHumType'];
    readonly seriesName: PsychartTypes.DataOptions['name'];
    readonly dryBulb: string;
    readonly other: string;
    readonly measurement: PsychartTypes.State['measurement'];
}
