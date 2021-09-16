type UnitSystem = 'IP' | 'SI';
type MeasurementType = 'dbwb' | 'dbrh' | 'dbdp';
type RelHumType = 'p' | 'f';

export interface PsyOptions {
  unitSystem: UnitSystem;
  measurements: MeasurementType;
  dryBulb: string;
  wetBulb: string;
  dewPoint: string;
  relHum: string;
  relHumType: RelHumType;
}
