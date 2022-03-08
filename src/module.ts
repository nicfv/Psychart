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
      category: ['Chart options'],
      settings: {
        allowCustomValue: false,
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
      path: 'altitude',
      name: 'Altitude',
      description: 'Enter the altitude from sea level in feet or meters.',
      defaultValue: 0,
      category: ['Chart options'],
      settings: {
        step: 1,
        integer: true,
      },
    })
    .addNumberInput({
      path: 'dbMin',
      name: 'Minimum Dry Bulb Temperature',
      description: 'Enter the minimum dry bulb temperature to display, or the lower x-bound.',
      defaultValue: 20,
      category: ['Chart options'],
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
      category: ['Chart options'],
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
      category: ['Chart options'],
      settings: {
        step: 10,
        integer: true,
      },
    })
    .addMultiSelect({
      path: 'regions',
      name: 'ASHRAE Comfort Regions',
      description: 'Select which ASHRAE comfort regions to display.',
      category: ['Chart options'],
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
    .addSelect({
      path: 'measurements',
      name: 'Measurements',
      description: 'Select which series are being measured.',
      defaultValue: 'dbwb',
      category: ['Query options'],
      settings: {
        allowCustomValue: false,
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
      category: ['Query options'],
      settings: {
        filter: (f) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
    })
    .addFieldNamePicker({
      path: 'wetBulb',
      name: 'Wet Bulb Series',
      description: 'Select a series that measures the wet bulb temperature.',
      category: ['Query options'],
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
      category: ['Query options'],
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
      category: ['Query options'],
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
      category: ['Query options'],
      defaultValue: 'p',
      settings: {
        allowCustomValue: false,
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
    })
    .addSliderInput({
      path: 'ptr',
      name: 'Point Size',
      description: 'Enter the point radius, in pixels.',
      defaultValue: 5,
      category: ['Display options'],
      settings: {
        min: 1,
        max: 10,
        step: 1,
      },
    })
    .addSliderInput({
      path: 'line',
      name: 'Show Line',
      description: 'Connect data points with a line?',
      defaultValue: 1,
      category: ['Display options'],
      settings: {
        min: 0,
        max: 1,
        step: 1,
      },
    })
    .addSelect({
      path: 'gradient',
      name: 'Gradient',
      description: 'The series color gradient.',
      category: ['Display options'],
      defaultValue: 'v',
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'v',
            label: 'Viridis',
            imgUrl:
              'https://aws1.discourse-cdn.com/business7/uploads/grafana/original/2X/e/ef5308cc58c9e5a13187b5012eb99f406928462f.png',
          },
          {
            value: 'hc',
            label: 'Hot-Cold',
          },
        ],
      },
    });
});
