import { Psychart } from 'psychart';
import { PsyOptions } from 'types';
import { CtoF, translate2 } from 'helper';

export function State(
  width: number,
  height: number,
  options: PsyOptions,
  isLightTheme: boolean,
  data: { [index: string]: { [index: string]: number } }
) {
  // **** Determine the unit system **** //
  const SI = options.unitSystem === 'SI';
  // **** Generate new Psychart **** //
  const ps = new Psychart(
    width,
    height,
    SI,
    options.dbMin,
    options.dbMax,
    options.dpMax,
    options.altitude,
    isLightTheme ? '#DDD' : '#333',
    isLightTheme ? '#222' : '#CCD'
  );
  // **** Obtain minimum and maximum numeric timestamps **** //
  const numericTimestamps = Object.keys(data).map((t) => data[t]['time']),
    minTime = Math.min(...numericTimestamps),
    maxTime = Math.max(...numericTimestamps);
  // **** Plot data based on measurement type **** //
  const dbSeries = getInternalSeriesName(options.dryBulb, data);
  if (!!dbSeries) {
    switch (options.measurements) {
      case 'dbwb': {
        const wbSeries = getInternalSeriesName(options.wetBulb, data);
        if (!!wbSeries) {
          for (let t in data) {
            const color: string = GetColor(data[t]['time'], minTime, maxTime, options.gradient);
            ps.plotDbWb(data[t][dbSeries], data[t][wbSeries], t, color, options.ptr, options.line);
          }
        } else if (!!options.wetBulb) {
          throw new Error('Dry bulb series "' + options.wetBulb + '" not found.');
        }
        break;
      }
      case 'dbrh': {
        const rhSeries = getInternalSeriesName(options.relHum, data),
          d = options.relHumType === 'p' ? 100 : 1;
        if (!!rhSeries) {
          for (let t in data) {
            const color: string = GetColor(data[t]['time'], minTime, maxTime, options.gradient);
            ps.plotDbRh(data[t][dbSeries], data[t][rhSeries] / d, t, color, options.ptr, options.line);
          }
        } else if (!!options.relHum) {
          throw new Error('Relative humidity series "' + options.relHum + '" not found.');
        }
        break;
      }
      case 'dbdp': {
        const dpSeries = getInternalSeriesName(options.dewPoint, data);
        if (!!dpSeries) {
          for (let t in data) {
            const color: string = GetColor(data[t]['time'], minTime, maxTime, options.gradient);
            ps.plotDbDp(data[t][dbSeries], data[t][dpSeries], t, color, options.ptr, options.line);
          }
        } else if (options.dewPoint) {
          throw new Error('Dew point series "' + options.dewPoint + '" not found.');
        }
        break;
      }
      default: {
        throw new Error('Measurement type ' + options.measurements + ' unsupported.');
      }
    }
  } else if (!!options.dryBulb) {
    throw new Error('Dry bulb series "' + options.dryBulb + '" not found.');
  }
  // **** Render ASHRAE regions **** //
  if (options.regions?.includes('A4')) {
    ps.newRegion('A4\nASHRAE comfort zone', isLightTheme ? '#cde' : '#123');
    ps.regionDbDp(SI ? 5 : CtoF(5), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 45 : CtoF(45), 0.08);
    ps.regionDbDp(SI ? 45 : CtoF(45), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 29 : CtoF(29), 0.9);
    ps.regionDbRh(SI ? 5 : CtoF(5), 0.9);
    ps.buildRegion();
  }
  if (options.regions?.includes('A3')) {
    ps.newRegion('A3\nASHRAE comfort zone', isLightTheme ? '#bcd' : '#234');
    ps.regionDbDp(SI ? 5 : CtoF(5), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 40 : CtoF(40), 0.08);
    ps.regionDbDp(SI ? 40 : CtoF(40), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 30 : CtoF(30), 0.85);
    ps.regionDbRh(SI ? 5 : CtoF(5), 0.85);
    ps.buildRegion();
  }
  if (options.regions?.includes('A2')) {
    ps.newRegion('A2\nASHRAE comfort zone', isLightTheme ? '#abc' : '#345');
    ps.regionDbDp(SI ? 10 : CtoF(10), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 35 : CtoF(35), 0.08);
    ps.regionDbDp(SI ? 35 : CtoF(35), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 31 : CtoF(31), 0.8);
    ps.regionDbRh(SI ? 10 : CtoF(10), 0.8);
    ps.buildRegion();
  }
  if (options.regions?.includes('A1')) {
    ps.newRegion('A1\nASHRAE comfort zone', isLightTheme ? '#9ab' : '#456');
    ps.regionDbDp(SI ? 15 : CtoF(15), SI ? -12 : CtoF(-12));
    ps.regionDbRh(SI ? 22 : CtoF(22), 0.08);
    ps.regionDbRh(SI ? 32 : CtoF(32), 0.08);
    ps.regionDbDp(SI ? 32 : CtoF(32), SI ? 27 : CtoF(27));
    ps.regionDbRh(SI ? 31 : CtoF(31), 0.8);
    ps.regionDbRh(SI ? 15 : CtoF(15), 0.8);
    ps.buildRegion();
  }
  if (options.regions?.includes('A0')) {
    ps.newRegion('Recommended ASHRAE conditions', isLightTheme ? '#89a' : '#567');
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
  !!name
    ? [
        ...new Set(
          Object.keys(data)
            .map((key) => Object.keys(data[key]))
            .flat()
        ),
      ].find((x) => x.substring(0, name.length) === name || x.substring(x.length - name.length) === name)
    : undefined;

const GetColor = (t: number, minTime: number, maxTime: number, gradient: string) => {
  let r: number[], g: number[], b: number[];
  switch (gradient) {
    case 'v': {
      // viridis
      r = [68, 59, 33, 94, 253];
      g = [1, 82, 145, 201, 231];
      b = [84, 139, 140, 98, 137];
      break;
    }
    case 'i': {
      // inferno
      r = [0, 87, 188, 249, 252];
      g = [0, 16, 55, 142, 255];
      b = [4, 110, 84, 9, 164];
      break;
    }
    case 'm': {
      // magma
      r = [0, 81, 183, 252, 252];
      g = [0, 18, 55, 187, 253];
      b = [4, 124, 121, 97, 191];
      break;
    }
    case 'p': {
      // plasma
      r = [13, 126, 204, 248, 240];
      g = [8, 3, 71, 149, 249];
      b = [135, 168, 120, 64, 33];
      break;
    }
    default: {
      throw new Error('Unsupported gradient type ' + gradient + '.');
    }
  }
  return (
    'rgb(' +
    translate2(t, minTime, maxTime, r) +
    ',' +
    translate2(t, minTime, maxTime, g) +
    ',' +
    translate2(t, minTime, maxTime, b) +
    ')'
  );
};
