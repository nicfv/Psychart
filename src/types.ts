import { PsychartOptions, DataOptions } from 'psychart';

export interface PsychartGrafanaOptions extends PsychartOptions {
    readonly series: Array<DataOptions>;
}
