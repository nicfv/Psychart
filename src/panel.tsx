import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { State } from 'state';
import { Container } from 'container';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  data = JSON.parse(JSON.stringify(data));
  const formatted: { [index: string]: { [index: string]: any } } = {};
  data.series.forEach((serie) => {
    const vals = serie.fields.find((field) => field.type === 'time')?.values;
    if (Array.isArray(vals)) {
      vals?.forEach((t: any, i: any) => {
        const time = new Date(t).toLocaleString();
        serie.fields
          .filter((field) => field.type === 'number')
          .forEach((numberField) => {
            if (!formatted[time]) {
              formatted[time] = {};
            }
            if (Array.isArray(numberField.values)) {
              formatted[time][serie.name + '.' + numberField.name] = numberField.values[i];
            }
          });
      });
    }
  });
  console.log(formatted);
  console.log(typeof formatted);
  console.log(JSON.stringify(formatted, null, 2));
  State.initPsyChart(width, height, options.unitSystem, options.dbMin, options.dbMax, options.dpMax, theme.isLight);
  return <Container>{State.getElement()}</Container>;
};
