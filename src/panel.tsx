import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { Layout, PsyOptions } from './types';
import { Container } from './container';
import { format } from './formatter';
import { Psychart } from './psychart';

export const PsyPanel: React.FC<PanelProps<PsyOptions>> = ({ options, data, width, height }) => {
  const isDarkTheme = useTheme2().isDark;
  try {
    const layout = { padding: 30, size: { x: width, y: height } } as Layout,
      style = Psychart.getDefaultStyleOptions(isDarkTheme),
      psychart = new Psychart(layout, options, style),
      formatted = format(data),
      startTime = data.timeRange.from.unix() * 1e3,
      endTime = data.timeRange.to.unix() * 1e3;
    for (let t in formatted) {
      switch (options.measurements) {
        case ('dbwb'): {
          if (typeof options.dryBulb === 'string' && typeof options.wetBulb === 'string') {
            psychart.plot({ db: formatted[t][options.dryBulb], wb: formatted[t][options.wetBulb] }, +t, startTime, endTime);
          }
          break;
        }
        case ('dbrh'): {
          if (typeof options.dryBulb === 'string' && typeof options.relHum === 'string') {
            psychart.plot({ db: formatted[t][options.dryBulb], rh: formatted[t][options.relHum] }, +t, startTime, endTime);
          }
          break;
        }
        case ('dbdp'): {
          if (typeof options.dryBulb === 'string' && typeof options.dewPoint === 'string') {
            psychart.plot({ db: formatted[t][options.dryBulb], dp: formatted[t][options.dewPoint] }, +t, startTime, endTime);
          }
          break;
        }
        default: {
          throw new Error('Invalid measurement type.');
        }
      }
    }
    return <Container child={psychart.getElement()} />;
  } catch (ex: any) {
    return (
      <div className="panel-empty">
        <p>{ex.name + ': ' + ex.message}</p>
      </div>
    );
  }
};
