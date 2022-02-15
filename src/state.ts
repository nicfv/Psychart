import { Psychart } from 'psychart';
import { UnitSystem } from 'types';

class State {
  ps: any;
  width: number;
  height: number;
  unitSystem: UnitSystem;
  dbMin: number;
  dbMax: number;
  dpMax: number;
  isLightTheme: boolean;

  constructor() {
    this.ps = null;
    this.width = 0;
    this.height = 0;
    this.unitSystem = 'SI';
    this.dbMin = 0;
    this.dbMax = 0;
    this.dpMax = 0;
    this.isLightTheme = false;
  }
  initPsyChart(
    width: number,
    height: number,
    unitSystem: UnitSystem,
    dbMin: number,
    dbMax: number,
    dpMax: number,
    isLightTheme: boolean,
    data: { [index: string]: { [index: string]: number } }
  ) {
    if (
      this.width !== width ||
      this.height !== height ||
      this.unitSystem !== unitSystem ||
      this.dbMin !== dbMin ||
      this.dbMax !== dbMax ||
      this.dpMax !== dpMax ||
      this.isLightTheme !== isLightTheme
    ) {
      this.width = width;
      this.height = height;
      this.unitSystem = unitSystem;
      this.dbMin = dbMin;
      this.dbMax = dbMax;
      this.dpMax = dpMax;
      this.isLightTheme = isLightTheme;
      this.ps = new Psychart(
        this.width,
        this.height,
        this.unitSystem === 'IP' ? 1 : 2,
        this.dbMin,
        this.dbMax,
        this.dpMax,
        this.isLightTheme ? '#CCC' : '#666',
        this.isLightTheme ? '#666' : '#CCC'
      );
    }
    for (let t in data) {
      this.ps.plotDbRh(t, data[t]['A::Dry Bulb [F]'], data[t]['A::Relative Humidity [0.0-1.0]']);
    }
  }
  getElement() {
    return this.ps.el();
  }
}

export var state = new State();
