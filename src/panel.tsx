import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
import { State } from 'state';
import { Container } from 'container';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const formatted = new Map();
  data.series.forEach((serie) => {
    serie.fields
      .find((field) => field.type === 'time')
      ?.values?.forEach((t: any, i: any) => {
        serie.fields
          .filter((field) => field.type === 'number')
          .forEach((numberField) => {
            if (!formatted.get(t)) {
              formatted.set(t, new Map());
            }
            formatted.get(t).set(serie.name + '.' + numberField.name, numberField.values.get(i));
          });
      });
  });
  console.log(formatted);
  console.log(typeof formatted);
  console.log(JSON.stringify(formatted, null, 2));
  State.initPsyChart(width, height, options.unitSystem, options.dbMin, options.dbMax, options.dpMax, theme.isLight);
  return <Container>{State.getElement()}</Container>;
};