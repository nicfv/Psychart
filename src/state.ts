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
  // **** Obtain minimum and maximum numeric timestamps **** //
  const numericTimestamps = Object.keys(data).map((t) => data[t]['time']),
    minTime = Math.min(...numericTimestamps),
    maxTime = Math.max(...numericTimestamps);
  console.log(minTime, maxTime);
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
        ps.plotDbDp(data[t][dbSeries], data[t][dpSeries], t, '#03c', 5, 1);
      }
      break;
    }
    default: {
      throw 'Measurement type ' + options.measurements + ' unsupported.';
    }
  }
  // **** Render ASHRAE regions **** //
  const SI = options.unitSystem === 'SI';
  if (options.regions.includes('A4')) {
    ps.newRegion(isLightTheme ? '#cde' : '#123');
    ps.regionDbDp(SI ? 5 : CtoF(5), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 45 : CtoF(45), 0.08);
    ps.regionDbDp(SI ? 45 : CtoF(45), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 29 : CtoF(29), 0.9);
    ps.regionDbRh(SI ? 5 : CtoF(5), 0.9);
    ps.buildRegion();
  }
  if (options.regions.includes('A3')) {
    ps.newRegion(isLightTheme ? '#bcd' : '#234');
    ps.regionDbDp(SI ? 5 : CtoF(5), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 40 : CtoF(40), 0.08);
    ps.regionDbDp(SI ? 40 : CtoF(40), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 30 : CtoF(30), 0.85);
    ps.regionDbRh(SI ? 5 : CtoF(5), 0.85);
    ps.buildRegion();
  }
  if (options.regions.includes('A2')) {
    ps.newRegion(isLightTheme ? '#abc' : '#345');
    ps.regionDbDp(SI ? 10 : CtoF(10), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 35 : CtoF(35), 0.08);
    ps.regionDbDp(SI ? 35 : CtoF(35), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 31 : CtoF(31), 0.8);
    ps.regionDbRh(SI ? 10 : CtoF(10), 0.8);
    ps.buildRegion();
  }
  if (options.regions.includes('A1')) {
    ps.newRegion(isLightTheme ? '#9ab' : '#456');
    ps.regionDbDp(SI ? 15 : CtoF(15), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 32 : CtoF(32), 0.08);
    ps.regionDbDp(SI ? 32 : CtoF(32), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 31 : CtoF(31), 0.8);
    ps.regionDbRh(SI ? 15 : CtoF(15), 0.8);
    ps.buildRegion();
  }
  if (options.regions.includes('A0')) {
    ps.newRegion(isLightTheme ? '#89a' : '#567');
    ps.regionDbDp(SI ? 18 : CtoF(18), SI ? -9 : CtoF(-9));
    ps.regionDbDp(SI ? 27 : CtoF(27), SI ? -9 : CtoF(-9));
    ps.regionDbDp(SI ? 27 : CtoF(27), SI ? 15 : CtoF(15));
    ps.regionDbRh(SI ? 23 : CtoF(23), 0.6);
    ps.regionDbRh(SI ? 18 : CtoF(18), 0.6);
    ps.buildRegion();
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

// Convert from Celsius to Fahrenheit
const CtoF = (C: number) => (9 / 5) * C + 32;

// // Convert from Fahrenheit to Celsius
// const FtoC = (F) => (5 / 9) * (F - 32);
