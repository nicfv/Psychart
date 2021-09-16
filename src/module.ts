import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addRadio({
      path: 'unitSystem',
      name: 'Unit System',
      description: 'Select a unit system.',
      defaultValue: 'IP',
      settings: {
        options: [
          {
            value: 'IP',
            label: 'Imperial',
          },
          {
            value: 'SI',
            label: 'SI Units',
          },
        ],
      },
    })
    .addRadio({
      path: 'measurements',
      name: 'Measurements',
      description: 'Select which series are being measured.',
      defaultValue: 'dbwb',
      settings: {
        options: [
          {
            value: 'dbwb',
            label: 'Dry Bulb & Wet Bulb',
          },
          {
            value: 'dbdp',
            label: 'Dry Bulb & Dew Point',
          },
          {
            value: 'dbrh',
            label: 'Dry Bulb & Rel. Humidity',
          },
        ],
      },
    })
    .addFieldNamePicker({
      path: 'dryBulb',
      name: 'Dry Bulb Series',
      description: 'Select a series that measures the dry bulb temperature.',
    })
    .addFieldNamePicker({
      path: 'wetBulb',
      name: 'Wet Bulb Series',
      description: 'Select a series that measures the wet bulb temperature.',
      showIf: (x) => x.measurements === 'dbwb',
    })
    .addFieldNamePicker({
      path: 'dewPoint',
      name: 'Dew Point Series',
      description: 'Select a series that measures the dew point temperature.',
      showIf: (x) => x.measurements === 'dbdp',
    })
    .addFieldNamePicker({
      path: 'relHum',
      name: 'Relative Humidity Series',
      description: 'Select a series that measures the relative humidity.',
      showIf: (x) => x.measurements === 'dbrh',
    })
    .addRadio({
      path: 'relHumType',
      name: 'Relative Humidity Type',
      description: 'Choose how relative humidity is actively being measured.',
      defaultValue: 'p',
      settings: {
        options: [
          {
            value: 'p',
            label: '100%',
          },
          {
            value: 'f',
            label: '0.0-1.0',
          },
        ],
      },
      showIf: (x) => x.measurements === 'dbrh',
    });
});
