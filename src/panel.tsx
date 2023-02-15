import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { ChartOptions, DisplayOptions, Layout, PsyOptions, StyleOptions } from './types';
// import { State } from './state';
import { Container } from './container';
import { format } from './formatter';
import { PsyState } from './psystate';
import { Psychart } from './psychart';
import { Color } from './color';

interface Props extends PanelProps<PsyOptions> { }

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const isLightTheme = useTheme2().isLight;
  try {
    // return <pre>{JSON.stringify(new PsyState({ db: 80, dp: 70 }, 'IP', 0))}</pre>;
    const layout = {} as Layout;
    layout.padding = 30;
    layout.size = { x: width, y: height };
    const chartOpts = options as ChartOptions,
      config = {} as StyleOptions;
    config.fontColor = new Color(255, 255, 255);
    config.fontSize = 12;
    config.lineColor = new Color(255, 0, 0);
    config.major = 10;
    config.resolution = 0.5;
    const displayOpts = {} as DisplayOptions;
    displayOpts.advanced = true;
    displayOpts.gradient = 'viridis';
    displayOpts.lineWidth = 1;
    displayOpts.pointRadius = 5;
    const psychart = new Psychart(layout, chartOpts, config);
    // psychart.plot({ db: 60, dp: 40 }, displayOpts);
    // psychart.plot({ db: 70, wb: 50 }, displayOpts);
    // psychart.plot({ db: 80, rh: .3 }, displayOpts);
    // psychart.drawRegion([
    //   { db: 50, rh: .3 },
    //   { db: 80, rh: .3 },
    //   { db: 80, dp: 60 },
    //   { db: 75, dp: 60 },
    // ], new Color(0, 255, 80, 50), 'Testing!\nhello!');
    psychart.drawRegions(['dca4', 'dca3', 'dca2', 'dca1', 'dclo', 'dchi'], [new Color(255, 255, 0), new Color(0, 0, 255)]);
    return <Container child={psychart.getElement()} />;
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
