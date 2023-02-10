import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { PsyOptions } from './types';
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
    return <Container child={new Psychart(new Point(width, height), 'IP', 20, 120, 90, 0, false, new Color(0, 0, 0), new Color(0, 0, 0)).getElement()} />;
    // return <Container child={State(width, height, options, isLightTheme, format(data))} />;
  } catch (ex: any) {
    return (
      <div className="panel-empty">
        <p>{ex.name + ': ' + ex.message}</p>
      </div>
    );
  }
};
