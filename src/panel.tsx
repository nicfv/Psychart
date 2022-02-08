import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { State } from 'state';
// import { VanillaChildren } from 'VanillaChildren';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const values = data.series
    .map((serie) => serie.fields)
    .flat()
    .map((field) => {
      return { name: field.name, values: field.values };
    });
  console.log(values);
  console.log(typeof values);
  console.log(JSON.stringify(values, null, 2));
  State.initPsyChart(width, height, options.unitSystem, options.dbMin, options.dbMax, options.dpMax, theme.isLight);
  return <div ref={(ref) => ref!.appendChild(State.getElement())}></div>;
};
