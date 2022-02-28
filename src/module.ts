import { PanelPlugin } from '@grafana/data';
import { PsyOptions } from './types';
import { PsyPanel } from './panel';

export const plugin = new PanelPlugin<PsyOptions>(PsyPanel).setPanelOptions((builder) => {
  return builder
    .addRadio({
      path: 'unitSystem',
      name: 'Unit System',
      description: 'Select a unit system.',
      defaultValue: 'IP',
      category: ['Meta Information'],
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
    .addNumberInput({
      path: 'dbMin',
      name: 'Minimum Dry Bulb Temperature',
      description: 'Enter the minimum dry bulb temperature to display, or the lower x-bound.',
      defaultValue: 20,
      category: ['Meta Information'],
      settings: {
        step: 10,
        integer: true,
      },
    })
    .addNumberInput({
      path: 'dbMax',
      name: 'Maximum Dry Bulb Temperature',
      description: 'Enter the maximum dry bulb temperature to display, or the upper x-bound.',
      defaultValue: 120,
      category: ['Meta Information'],
      settings: {
        step: 10,
        integer: true,
      },
    })
    .addNumberInput({
      path: 'dpMax',
      name: 'Maximum Dew Point Temperature',
      description: 'Enter the maximum dew point temperature to display, or the upper y-bound.',
      defaultValue: 90,
      category: ['Meta Information'],
      settings: {
        step: 10,
        integer: true,
      },
    })
    .addMultiSelect({
      path: 'regions',
      name: 'ASHRAE Comfort Regions',
      description: 'Select which ASHRAE comfort regions to display.',
      category: ['Meta Information'],
      settings: {
        allowCustomValue: false,
        options: [
          {
            label: 'Recommended',
            value: 'A0',
            description: 'The "recommended" ASHRAE comfort zone.',
          },
          {
            label: 'A1',
            value: 'A1',
            description: 'The A1 ASHRAE comfort zone.',
          },
          {
            label: 'A2',
            value: 'A2',
            description: 'The A2 ASHRAE comfort zone.',
          },
          {
            label: 'A3',
            value: 'A3',
            description: 'The A3 ASHRAE comfort zone.',
          },
          {
            label: 'A4',
            value: 'A4',
            description: 'The A4 ASHRAE comfort zone.',
          },
        ],
      },
    })
    .addRadio({
      path: 'measurements',
      name: 'Measurements',
      description: 'Select which series are being measured.',
      defaultValue: 'dbwb',
      category: ['Query Information'],
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
      category: ['Query Information'],
      settings: {
        filter: (f) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
    })
    .addFieldNamePicker({
      path: 'wetBulb',
      name: 'Wet Bulb Series',
      description: 'Select a series that measures the wet bulb temperature.',
      category: ['Query Information'],
      settings: {
        filter: (f) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
      showIf: (x) => x.measurements === 'dbwb',
    })
    .addFieldNamePicker({
      path: 'dewPoint',
      name: 'Dew Point Series',
      description: 'Select a series that measures the dew point temperature.',
      category: ['Query Information'],
      settings: {
        filter: (f) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
      showIf: (x) => x.measurements === 'dbdp',
    })
    .addFieldNamePicker({
      path: 'relHum',
      name: 'Relative Humidity Series',
      description: 'Select a series that measures the relative humidity.',
      category: ['Query Information'],
      settings: {
        filter: (f) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
      showIf: (x) => x.measurements === 'dbrh',
    })
    .addRadio({
      path: 'relHumType',
      name: 'Relative Humidity Type',
      description: 'Choose how relative humidity is actively being measured.',
      category: ['Query Information'],
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
