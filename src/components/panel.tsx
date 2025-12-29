import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { GrafanaDataOptions, GrafanaPsychartOptions } from '../types';
import { Container } from './container';
import { format, getFieldList } from '../formatter';
import { Psychart } from 'psychart';
import { getColors } from '../defaults';
import { PanelDataErrorView } from '@grafana/runtime';

export const PsyPanel: React.FC<PanelProps<GrafanaPsychartOptions>> = (props) => {
  const isDarkTheme = useTheme2().isDark;
  try {
    const psychart: Psychart = new Psychart(
      {
        altitude: props.options.altitude,
        colors: getColors(isDarkTheme),
        dAxis: props.options.mollier ? 'h' : 'wb',
        dbMax: props.options.dbMax,
        dbMin: props.options.dbMin,
        dpMax: props.options.dpMax,
        flipGradients: isDarkTheme,
        flipXY: props.options.mollier,
        legend: props.options.showLegend ? {
          title: 'Legend',
          margin: { x: 0, y: 0 },
          size: { x: props.width / 3, y: props.height / 3 },
        } : false,
        major: props.options.major,
        regions: props.options.regions,
        size: { x: props.width, y: props.height },
        unitSystem: props.options.unitSystem,
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
          psychart.plot({ db: formatted[t][dataOpts.dryBulb], other: formatted[t][dataOpts.other], measurement: dataOpts.measurement },
            {
              advanced: dataOpts.advanced,
              gradient: dataOpts.gradient,
              line: dataOpts.line,
              pointRadius: dataOpts.pointRadius,
              relHumType: dataOpts.relHumType,
              name: props.replaceVariables(dataOpts.seriesName),
              time: { now: +t, start: startTime, end: endTime }
            });
        }
      }
    }
    // eslint-disable-next-line
    return <Container child={psychart.getElement()} />;
  } catch (ex: any) {
    return <PanelDataErrorView panelId={props.id} data={props.data} message={'' + ex} />;
  }
};
