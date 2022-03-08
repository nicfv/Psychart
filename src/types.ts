type UnitSystem = 'IP' | 'SI';
type MeasurementType = 'dbwb' | 'dbrh' | 'dbdp';
type RelHumType = 'p' | 'f';
type Gradient = 'v' | 'hc';

export interface PsyOptions {
  unitSystem: UnitSystem;
  altitude: number;
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
  ptr: number;
  line: number;
  gradient: Gradient;
}
