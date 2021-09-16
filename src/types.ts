type UnitSystem = 'IP' | 'SI';
type MeasurementType = 'dbwb' | 'dbrh' | 'dbdp';
type RelHumType = 'p' | 'f';

export interface SimpleOptions {
  unitSystem: UnitSystem;
  measurements: MeasurementType;
  dryBulb: string;
  wetBulb: string;
  relHum: string;
  relHumType: RelHumType;
}
