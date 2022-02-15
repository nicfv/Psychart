export type UnitSystem = 'IP' | 'SI';
export type MeasurementType = 'dbwb' | 'dbrh' | 'dbdp';
export type RelHumType = 'p' | 'f';

export interface PsyOptions {
  unitSystem: UnitSystem;
  dbMin: number;
  dbMax: number;
  dpMax: number;
  measurements: MeasurementType;
  dryBulb: string;
  wetBulb: string;
  dewPoint: string;
  relHum: string;
  relHumType: RelHumType;
}
