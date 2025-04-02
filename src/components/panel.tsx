import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { GrafanaDataOptions, GrafanaPsychartOptions } from '../types';
import { Container } from './container';
import { format, getFieldList } from '../formatter';
import { Psychart } from 'psychart';
import { getAxisColor, getFontColor } from '../defaults';
import { PanelDataErrorView } from '@grafana/runtime';

export const PsyPanel: React.FC<PanelProps<GrafanaPsychartOptions>> = (props) => {
  const isDarkTheme = useTheme2().isDark,
    legendHeight = 0.10 * props.height;
  try {
    const psychart: Psychart = new Psychart(
      {
        ...props.options,
        size: { x: props.width, y: props.height - legendHeight - 10 },
        colors: {
          axis: getAxisColor(isDarkTheme),
          font: getFontColor(isDarkTheme),
          regionGradient: 'Purplish',
        },
        flipGradients: isDarkTheme,
        flipXY: props.options.mollier,
        yAxis: props.options.mollier ? 'hr' : 'dp',
      }
    ),
      formatted = format(props.data.series),
      fieldList = getFieldList(formatted),
      startTime = props.data.timeRange.from.unix() * 1e3,
      endTime = props.data.timeRange.to.unix() * 1e3;
    for (const t in formatted) {
      for (const f in props.options.series || {}) {
        const dataOpts: GrafanaDataOptions = props.options.series[f];
        if (dataOpts.seriesName && fieldList.includes(dataOpts.dryBulb) && fieldList.includes(dataOpts.other)) {
          psychart.plot({ db: formatted[t][dataOpts.dryBulb], other: formatted[t][dataOpts.other], measurement: dataOpts.measurement }, { ...dataOpts, time: { now: +t, start: startTime, end: endTime } });
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
    return <PanelDataErrorView panelId={props.id} data={props.data} message={'' + ex} />;
  }
};
