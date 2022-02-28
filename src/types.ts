type UnitSystem = 'IP' | 'SI';
type MeasurementType = 'dbwb' | 'dbrh' | 'dbdp';
type RelHumType = 'p' | 'f';

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
  regions: string[];
}
