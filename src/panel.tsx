import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { Layout, PsyOptions, StyleOptions } from './types';
import { Container } from './container';
import { format } from './formatter';
import { Psychart } from './psychart';
import { Color } from './color';

interface Props extends PanelProps<PsyOptions> { }

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const isLightTheme = useTheme2().isLight;
  try {
    const layout = { padding: 30, size: { x: width, y: height } } as Layout,
      style = {
        darkTheme: !isLightTheme,
        fontColor: isLightTheme ? new Color(32, 32, 32) : new Color(208, 208, 208),
        lineColor: isLightTheme ? new Color(224, 224, 224) : new Color(48, 48, 48),
        fontSize: 12,
        resolution: 0.5,
        major: 10,
      } as StyleOptions,
      psychart = new Psychart(layout, options, style),
      formatted = format(data),
      startTime = data.timeRange.from.unix() * 1e3,
      endTime = data.timeRange.to.unix() * 1e3;
    for (let t in formatted) {
      switch (options.measurements) {
        case ('dbwb'): {
          psychart.plot({ db: formatted[t][options.dryBulb], wb: formatted[t][options.wetBulb] }, +t, startTime, endTime);
          break;
        }
        case ('dbrh'): {
          psychart.plot({ db: formatted[t][options.dryBulb], rh: formatted[t][options.relHum] }, +t, startTime, endTime);
          break;
        }
        case ('dbdp'): {
          psychart.plot({ db: formatted[t][options.dryBulb], dp: formatted[t][options.dewPoint] }, +t, startTime, endTime);
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
