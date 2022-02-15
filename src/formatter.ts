import { PanelData } from '@grafana/data';

export function format(data: PanelData): { [index: string]: { [index: string]: number } } {
  const formatted: { [index: string]: { [index: string]: number } } = {};
  data.series.forEach((frame) => {
    frame.fields
      .find((field) => field.type === 'time')
      ?.values.toArray()
      .forEach((t: number, i: number) => {
        const time = new Date(t).toLocaleString();
        frame.fields
          .filter((field) => field.type === 'number')
          .forEach((numberField) => {
            formatted[time] = formatted[time] || {};
            formatted[time][frame.name + '.' + numberField.name] = numberField.values.get(i);
          });
      });
  });
  return formatted;
}
