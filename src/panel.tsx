import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { state } from 'state';
import { Container } from 'container';
import { format } from 'formatter';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const isLightTheme = useTheme().isLight,
    formatted = format(data);
  console.log(data, formatted);
  state.initPsyChart(width, height, options, isLightTheme, formatted);
  return <Container child={state.getElement()} />;
};
