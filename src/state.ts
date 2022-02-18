import { Psychart } from 'psychart';
import { PsyOptions } from 'types';

class State {
  ps: any;
  width: number;
  height: number;
  options: PsyOptions;
  isLightTheme: boolean;

  constructor() {
    this.ps = null;
    this.width = 0;
    this.height = 0;
    this.options = {
      unitSystem: 'IP',
      dbMin: 0,
      dbMax: 0,
      dpMax: 0,
      measurements: 'dbwb',
      dryBulb: '',
      wetBulb: '',
      dewPoint: '',
      relHum: '',
      relHumType: 'p',
    };
    this.isLightTheme = false;
  }

  // Compare options `a` and `b` and return true if they are the same.
  optionsEqual(a: PsyOptions, b: PsyOptions) {
    return (
      a.unitSystem === b.unitSystem &&
      a.dbMin === b.dbMin &&
      a.dbMax === b.dbMax &&
      a.dpMax === b.dpMax &&
      a.measurements === b.measurements &&
      a.dryBulb === b.dryBulb &&
      a.wetBulb === b.wetBulb &&
      a.dewPoint === b.dewPoint &&
      a.relHum === b.relHum &&
      a.relHumType === b.relHumType
    );
  }

  initPsyChart(
    width: number,
    height: number,
    options: PsyOptions,
    isLightTheme: boolean,
    data: { [index: string]: { [index: string]: number } }
  ) {
    if (
      this.width !== width ||
      this.height !== height ||
      !this.optionsEqual(this.options, options) ||
      this.isLightTheme !== isLightTheme
    ) {
      this.width = width;
      this.height = height;
      this.options = options;
      this.isLightTheme = isLightTheme;
      this.ps = new Psychart(
        this.width,
        this.height,
        this.options.unitSystem === 'IP' ? 1 : 2,
        this.options.dbMin,
        this.options.dbMax,
        this.options.dpMax,
        this.isLightTheme ? '#DDD' : '#333',
        this.isLightTheme ? '#222' : '#CCD'
      );
    }
    this.ps.clearData();
    for (let t in data) {
      this.ps.plotDbRh(
        data[t][this.options.dryBulb + '::Value'],
        data[t][this.options.relHum + '::Value'],
        t,
        '#03c',
        5,
        1
      );
    }
  }

  getElement() {
    return this.ps.el();
  }
}

export var state = new State();
