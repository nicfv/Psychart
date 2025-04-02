import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { GrafanaPsychartOptions } from '../types';
import { Container } from './container';
import { format, getFieldList } from '../formatter';
import { Psychart } from 'psychart';
import { getAxisColor, getFontColor } from '../defaults';

export const PsyPanel: React.FC<PanelProps<GrafanaPsychartOptions>> = ({ options, data, width, height }) => {
  const isDarkTheme = useTheme2().isDark,
    errorColor = useTheme2().colors.error.text,
    legendHeight = 0.10 * height;
  try {
    const psychart: Psychart = new Psychart(
      {
        ...options,
        size: { x: width, y: height - legendHeight - 10 },
        colors: {
          axis: getAxisColor(isDarkTheme),
          font: getFontColor(isDarkTheme),
          regionGradient: 'Purplish',
        },
        flipGradients: isDarkTheme,
        flipXY: options.mollier,
        yAxis: options.mollier ? 'hr' : 'dp',
      }
    ),
      formatted = format(data.series),
      fieldList = getFieldList(formatted),
      startTime = data.timeRange.from.unix() * 1e3,
      endTime = data.timeRange.to.unix() * 1e3;
    for (const t in formatted) {
      for (const f in options.series || {}) {
        if (options.series[f].seriesName && fieldList.includes(options.series[f].dryBulb) && fieldList.includes(options.series[f].other)) {
          psychart.plot({ db: formatted[t][options.series[f].dryBulb], other: formatted[t][options.series[f].other], measurement: options.series[f].measurement }, { ...options.series[f], time: { now: +t, start: startTime, end: endTime } });
        }
      }
    }
    return <div>
      <Container child={psychart.getElement()} />
      <div style={{
        height: legendHeight + 'px',
        overflowX: 'hidden', overflowY: 'auto',
        border: '1px solid ' + getAxisColor(isDarkTheme),
      }}>
        <Container child={psychart.getLegend()} />
      </div>
    </div>;
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
