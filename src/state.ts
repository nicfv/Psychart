import { Psychart } from 'psychart';
import { PsyOptions } from 'types';

export function State(
  width: number,
  height: number,
  options: PsyOptions,
  isLightTheme: boolean,
  data: { [index: string]: { [index: string]: number } }
) {
  // **** Generate new Psychart **** //
  const ps = new Psychart(
    width,
    height,
    options.unitSystem === 'IP' ? 1 : 2,
    options.dbMin,
    options.dbMax,
    options.dpMax,
    isLightTheme ? '#DDD' : '#333',
    isLightTheme ? '#222' : '#CCD'
  );
  // **** Plot data based on measurement type **** //
  const dbSeries = getInternalSeriesName(options.dryBulb, data);
  if (!dbSeries) {
    throw 'No series called ' + options.dryBulb;
  }
  switch (options.measurements) {
    case 'dbwb': {
      const wbSeries = getInternalSeriesName(options.wetBulb, data);
      if (!wbSeries) {
        throw 'No series called ' + options.wetBulb;
      }
      for (let t in data) {
        ps.plotDbWb(data[t][dbSeries], data[t][wbSeries], t, '#03c', 5, 1);
      }
      break;
    }
    case 'dbrh': {
      const rhSeries = getInternalSeriesName(options.relHum, data),
        d = options.relHumType === 'p' ? 100 : 1;
      if (!rhSeries) {
        throw 'No series called ' + options.relHum;
      }
      for (let t in data) {
        ps.plotDbRh(data[t][dbSeries], data[t][rhSeries] / d, t, '#03c', 5, 1);
      }
      break;
    }
    case 'dbdp': {
      const dpSeries = getInternalSeriesName(options.dewPoint, data);
      if (!dpSeries) {
        throw 'No series called ' + options.dewPoint;
      }
      for (let t in data) {
        ps.plotDbWb(data[t][dbSeries], data[t][dpSeries], t, '#03c', 5, 1);
      }
      break;
    }
    default: {
      throw 'Measurement type ' + options.measurements + ' unsupported.';
    }
  }
  return ps.el();
}

// Return the full series name that corresponds to the selected field name.
const getInternalSeriesName = (name: string, data: { [index: string]: { [index: string]: number } }) =>
  [
    ...new Set(
      Object.keys(data)
        .map((key) => Object.keys(data[key]))
        .flat()
    ),
  ].find((x) => x.substring(0, name.length) === name || x.substring(x.length - name.length) === name);
