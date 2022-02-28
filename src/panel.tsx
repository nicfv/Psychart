import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { State } from 'state';
import { Container } from 'container';
import { format } from 'formatter';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const isLightTheme = useTheme().isLight,
    formatted = format(data);
  console.log(data, formatted);
  let state = new State();
  state.initPsyChart(width, height, options, isLightTheme);
  state.plot(formatted);
  return <Container child={state.getElement()} />;
};
