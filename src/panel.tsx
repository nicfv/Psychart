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
    const layout = { padding: 30, size: { x: width, y: height } } as Layout,
      style = Psychart.getDefaultStyleOptions(isDarkTheme),
      psychart = new Psychart(layout, options, style),
      formatted = format(data.series),
      fieldList = getFieldList(formatted),
      startTime = data.timeRange.from.unix() * 1e3,
      endTime = data.timeRange.to.unix() * 1e3;
    for (let t in formatted) {
      for (let f in options.series || {}) {
        // Skip unset series
        if (!options.series[f].legend) {
          continue;
        }
        switch (options.series[f].measurements) {
          case ('dbwb'): {
            if (fieldList.includes(options.series[f].dryBulb) && fieldList.includes(options.series[f].wetBulb)) {
              psychart.plot({ db: formatted[t][options.series[f].dryBulb], wb: formatted[t][options.series[f].wetBulb] }, +f, +t, startTime, endTime);
            }
            break;
          }
          case ('dbrh'): {
            if (fieldList.includes(options.series[f].dryBulb) && fieldList.includes(options.series[f].relHum)) {
              psychart.plot({ db: formatted[t][options.series[f].dryBulb], rh: formatted[t][options.series[f].relHum] }, +f, +t, startTime, endTime);
            }
            break;
          }
          case ('dbdp'): {
            if (fieldList.includes(options.series[f].dryBulb) && fieldList.includes(options.series[f].dewPoint)) {
              psychart.plot({ db: formatted[t][options.series[f].dryBulb], dp: formatted[t][options.series[f].dewPoint] }, +f, +t, startTime, endTime);
            }
            break;
          }
          default: {
            throw new Error('Invalid measurement type for series ' + options.series[f].legend + '.');
          }
        }
      }
    }
    return <Container child={psychart.getElement()} />;
  } catch (ex: any) {
    console.error(ex); // TODO: Delete (testing only)
    return (
      <div className="panel-empty">
        <p>{ex.name + ': ' + ex.message}</p>
      </div>
    );
  }
};
