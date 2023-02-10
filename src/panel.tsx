import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { ChartOptions, Layout, PsyOptions, StyleOptions } from './types';
// import { State } from './state';
import { Container } from './container';
import { format } from './formatter';
import { PsyState } from './psystate';
import { Psychart } from './psychart';
import { Point } from './point';
import { Color } from './color';

interface Props extends PanelProps<PsyOptions> { }

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const isLightTheme = useTheme2().isLight;
  try {
    // return <pre>{JSON.stringify(new PsyState({ db: 80, dp: 70 }, 'IP', 0))}</pre>;
    const layout = {} as Layout;
    layout.padding = 30;
    layout.size = new Point(width, height);
    const chartOpts = options as ChartOptions,
      config = {} as StyleOptions;
    config.fontColor = new Color(255, 255, 255);
    config.fontSize = 12;
    config.lineColor = new Color(255, 0, 0);
    config.major = 10;
    config.resolution = 0.5;
    return <Container child={new Psychart(layout, chartOpts, config).getElement()} />;
    // return <Container child={State(width, height, options, isLightTheme, format(data))} />;
  } catch (ex: any) {
    console.error(ex); // TODO: remove (testing only)
    return (
      <div className="panel-empty">
        <p>{ex.name + ': ' + ex.message}</p>
      </div>
    );
  }
};
