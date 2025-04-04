import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { GrafanaDataOptions, GrafanaPsychartOptions } from '../types';
import { Container } from './container';
import { format, getFieldList } from '../formatter';
import { Point, Psychart } from 'psychart';
import { getAxisColor, getFontColor, regionGradient } from '../defaults';
import { PanelDataErrorView } from '@grafana/runtime';

export const PsyPanel: React.FC<PanelProps<GrafanaPsychartOptions>> = (props) => {
  const [psy, setPsy] = useState({ psychart: new Psychart(), opts: '' });
  const isDarkTheme = useTheme2().isDark,
    legendSize: Point = props.options.showLegend ? { x: props.width / 3, y: props.height / 3 } : { x: 0, y: 0 };
  try {
    const currentOptions: string = JSON.stringify({ ...props.options, width: props.width, height: props.height });
    if (psy.opts !== currentOptions) {
      console.log('Re-initializing Psychart: ' + props.title);
      console.log(currentOptions);
      setPsy({
        opts: currentOptions,
        psychart: new Psychart(
          {
            // ...props.options,
            size: { x: props.width, y: props.height },
            legend: {
              placement: (props.options.mollier ? { x: props.width - legendSize.x, y: props.height - legendSize.y } : { x: 0, y: 0 }),
              size: legendSize,
            },
            colors: {
              axis: getAxisColor(isDarkTheme),
              font: getFontColor(isDarkTheme),
              regionGradient: regionGradient,
            },
            flipGradients: isDarkTheme,
            flipXY: props.options.mollier,
            yAxis: props.options.mollier ? 'hr' : 'dp',
          }),
      });
    }
    console.log('Clearing data.');
    psy.psychart.clearData();
    const
      formatted = format(props.data.series),
      fieldList = getFieldList(formatted),
      startTime = props.data.timeRange.from.unix() * 1e3,
      endTime = props.data.timeRange.to.unix() * 1e3;
    console.log('Plotting data: ' + props.title);
    for (const t in formatted) {
      for (const f in props.options.series || {}) {
        const dataOpts: GrafanaDataOptions = props.options.series[f];
        if (dataOpts.seriesName && fieldList.includes(dataOpts.dryBulb) && fieldList.includes(dataOpts.other)) {
          psy.psychart.plot({ db: formatted[t][dataOpts.dryBulb], other: formatted[t][dataOpts.other], measurement: dataOpts.measurement }, { ...dataOpts, time: { now: +t, start: startTime, end: endTime } });
        }
      }
    }
    return <Container child={psy.psychart.getElement()} />;
  } catch (ex: any) {
    return <PanelDataErrorView panelId={props.id} data={props.data} message={'' + ex} />;
  }
};
