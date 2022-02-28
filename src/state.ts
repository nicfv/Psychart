import { Psychart } from 'psychart';
import { PsyOptions } from 'types';

export class State {
  ps: any;
  width: number;
  height: number;
  options: PsyOptions;
  isLightTheme: boolean;
  data: { [index: string]: { [index: string]: number } };

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
    this.data = {};
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

  // Return the full series name that corresponds to the selected field name.
  getInternalSeriesName = (name: string) =>
    [
      ...new Set(
        Object.keys(this.data)
          .map((key) => Object.keys(this.data[key]))
          .flat()
      ),
    ].find((x) => x.substring(0, name.length) === name || x.substring(x.length - name.length) === name);

  initPsyChart(width: number, height: number, options: PsyOptions, isLightTheme: boolean) {
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
    // Clear data to trigger a re-plot
    this.data = {};
  }

  plot(data: { [index: string]: { [index: string]: number } }) {
    const oldKeys = Object.keys(this.data),
      newKeys = Object.keys(data),
      lastOldKey = oldKeys[oldKeys.length - 1],
      lastNewKey = newKeys[newKeys.length - 1];
    if (lastOldKey === lastNewKey) {
      // Final timestamps are the same.
      return;
    }
    this.data = data;
    let dbSeries = this.getInternalSeriesName(this.options.dryBulb),
      rhSeries = this.getInternalSeriesName(this.options.relHum);
    if (!dbSeries) {
      throw 'No series called ' + this.options.dryBulb;
    }
    if (!rhSeries) {
      throw 'No series called ' + this.options.relHum;
    }
    this.ps.clearData();
    for (let t in data) {
      this.ps.plotDbRh(data[t][dbSeries], data[t][rhSeries], t, '#03c', 5, 1);
    }
  }

  getElement() {
    return this.ps.el();
  }
}
