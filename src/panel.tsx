import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { Layout, PsyOptions } from 'types';
import { Container } from 'container';
import { format, getFieldList } from 'formatter';
import { Psychart } from 'psychart';

export const PsyPanel: React.FC<PanelProps<PsyOptions>> = ({ options, data, width, height }) => {
  const isDarkTheme = useTheme2().isDark;
  try {
    const layout = { padding: { x: 40, y: 20 }, size: { x: width, y: height } } as Layout,
      style = Psychart.getDefaultStyleOptions(isDarkTheme),
      psychart = new Psychart(layout, options, style),
      formatted = format(data.series),
      fieldList = getFieldList(formatted),
      startTime = data.timeRange.from.unix() * 1e3,
      endTime = data.timeRange.to.unix() * 1e3;
    for (let t in formatted) {
      for (let f in options.series || {}) {
        if (options.series[f].legend && fieldList.includes(options.series[f].dryBulb) && fieldList.includes(options.series[f].other)) {
          psychart.plot({ db: formatted[t][options.series[f].dryBulb], other: formatted[t][options.series[f].other], measurement: options.series[f].measurement }, +f, +t, startTime, endTime);
        }
      }
    }
    return <Container child={psychart.getElement()} />;
  } catch (ex: any) {
    return (
      <div className="panel-empty">
        <p>{ex.name + ': ' + ex.message}</p>
      </div>
    );
  }
};
