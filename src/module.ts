import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder.addRadio({
    path: 'color',
    defaultValue: 'green',
    name: 'Circle Color',
    settings: {
      options: [
        {
          value: 'red',
          label: 'Red',
        },
        {
          value: 'green',
          label: 'Green',
        },
        {
          value: 'blue',
          label: 'Blue',
        },
      ],
    },
  });
});
