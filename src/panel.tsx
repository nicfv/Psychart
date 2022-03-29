import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { State } from 'state';
import { Container } from 'container';
import { format } from 'formatter';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const isLightTheme = useTheme().isLight;
  try {
    return <Container child={State(width, height, options, isLightTheme, format(data))} />;
  } catch (ex) {
    return (
      <div>
        <h1 style={{ color: 'red', textAlign: 'center' }}>{ex.name}</h1>
        <h2>{ex.message}</h2>
      </div>
    );
  }
};
