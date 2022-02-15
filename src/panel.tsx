import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { State } from 'state';
import { Container } from 'container';
import { format } from 'formatter';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme(),
    formatted = format(data);
  console.log(formatted);
  State.initPsyChart(
    width,
    height,
    options.unitSystem,
    options.dbMin,
    options.dbMax,
    options.dpMax,
    theme.isLight,
    formatted
  );
  return <Container>{State.getElement()}</Container>;
};
