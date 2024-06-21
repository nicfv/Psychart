import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { Layout, PsyOptions } from 'types';
import { Container } from 'container';
import { format, getFieldList } from 'formatter';
import { Psychart } from 'psychart';

export const PsyPanel: React.FC<PanelProps<PsyOptions>> = ({ options, data, width, height }) => {
  const isDarkTheme = useTheme2().isDark,
    errorColor = useTheme2().colors.error.text;
  try {
    const layout: Layout = { padding: { x: 40, y: 20 }, size: { x: width, y: height } },
      style = Psychart.getDefaultStyleOptions(isDarkTheme),
      psychart: Psychart = new Psychart(layout, options, style),
      formatted = format(data.series),
      fieldList = getFieldList(formatted),
      startTime = data.timeRange.from.unix() * 1e3,
      endTime = data.timeRange.to.unix() * 1e3;
    for (const t in formatted) {
      for (const f in options.series || {}) {
        if (options.series[f].legend && fieldList.includes(options.series[f].dryBulb) && fieldList.includes(options.series[f].other)) {
          psychart.plot({ db: formatted[t][options.series[f].dryBulb], other: formatted[t][options.series[f].other], measurement: options.series[f].measurement }, +f, +t, startTime, endTime);
        }
      }
    }
    return <Container child={psychart.getElement()} />;
  } catch (ex: any) {
    return (
      <div style={{
        color: errorColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
        <h3>{ex.name + ': ' + ex.message}</h3>
      </div>
    );
  }
};
