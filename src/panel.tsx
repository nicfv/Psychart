import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { State } from 'state';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  State.setSize(width, height);
  State.initPsyChart(options.unitSystem, options.dbMin, options.dbMax, options.dpMax, theme.isLight);
  return <div dangerouslySetInnerHTML={{ __html: State.getElement().outerHTML }}></div>;
};
