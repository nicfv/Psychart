import { PanelPlugin, Field } from '@grafana/data';
import { PsyOptions } from './types';
import { PsyPanel } from './panel';

const inferno = 'public/plugins/ventura-psychrometric-panel/img/inferno.png',
  magma = 'public/plugins/ventura-psychrometric-panel/img/magma.png',
  plasma = 'public/plugins/ventura-psychrometric-panel/img/plasma.png',
  viridis = 'public/plugins/ventura-psychrometric-panel/img/viridis.png';

// TODO: update the paths

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
            label: 'Recommended (High)',
            value: 'dc01',
            description: 'The "recommended" ASHRAE comfort zone for data centers with conditions with high pollutants.',
          },
          {
            label: 'Recommended (Low)',
            value: 'dc02',
            description: 'The "recommended" ASHRAE comfort zone for data centers with conditions with low pollutants.',
          },
          {
            label: 'A1',
            value: 'dca1',
            description: 'The A1 ASHRAE data center comfort zone. Typically a data center with mission-critical operations.',
          },
          {
            label: 'A2',
            value: 'dca2',
            description: 'The A2 ASHRAE data center comfort zone. Typically an IT space with strict environmental requirements.',
          },
          {
            label: 'A3',
            value: 'dca3',
            description: 'The A3 ASHRAE data center comfort zone. Typically an IT space with normal environmental requirements.',
          },
          {
            label: 'A4',
            value: 'dca4',
            description: 'The A4 ASHRAE data center comfort zone. Typically an IT space with low environmental requirements.',
          },
          {
            label: 'Summer (seated)',
            value: 'h10s',
            description: 'The ASHRAE-55 human comfort zone for a typical indoor space where most of the occupants are seated.',
          },
          {
            label: 'Summer (walking)',
            value: 'h15s',
            description: 'The ASHRAE-55 human comfort zone for a typical indoor space where most of the occupants are walking around.',
          },
          {
            label: 'Summer (light work)',
            value: 'h20s',
            description: 'The ASHRAE-55 human comfort zone for a typical indoor space where most of the occupants are performing light work.',
          },
          {
            label: 'Winter (seated)',
            value: 'h10w',
            description: 'The ASHRAE-55 human comfort zone for a typical indoor space where most of the occupants are seated.',
          },
          {
            label: 'Winter (walking)',
            value: 'h15w',
            description: 'The ASHRAE-55 human comfort zone for a typical indoor space where most of the occupants are walking around.',
          },
          {
            label: 'Winter (light work)',
            value: 'h20w',
            description: 'The ASHRAE-55 human comfort zone for a typical indoor space where most of the occupants are performing light work.',
          },
        ],
      },
    })
    .addSelect({
      path: 'measurements',
      name: 'Measurements',
      description: 'Select which series are being measured.',
      defaultValue: 'dbwb',
      category: ['Data options'],
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
      category: ['Data options'],
      settings: {
        filter: (f: Field) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
    })
    .addFieldNamePicker({
      path: 'wetBulb',
      name: 'Wet Bulb Series',
      description: 'Select a series that measures the wet bulb temperature.',
      category: ['Data options'],
      settings: {
        filter: (f: Field) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
      showIf: (x) => x.measurements === 'dbwb',
    })
    .addFieldNamePicker({
      path: 'dewPoint',
      name: 'Dew Point Series',
      description: 'Select a series that measures the dew point temperature.',
      category: ['Data options'],
      settings: {
        filter: (f: Field) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
      showIf: (x) => x.measurements === 'dbdp',
    })
    .addFieldNamePicker({
      path: 'relHum',
      name: 'Relative Humidity Series',
      description: 'Select a series that measures the relative humidity.',
      category: ['Data options'],
      settings: {
        filter: (f: Field) => f.type === 'number',
        noFieldsMessage: 'No valid fields found',
      },
      showIf: (x) => x.measurements === 'dbrh',
    })
    .addRadio({
      path: 'relHumType',
      name: 'Relative Humidity Type',
      description: 'Choose how relative humidity is actively being measured.',
      category: ['Data options'],
      defaultValue: 'percent',
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'percent',
            label: '100%',
          },
          {
            value: 'float',
            label: '0.0-1.0',
          },
        ],
      },
      showIf: (x) => x.measurements === 'dbrh',
    })
    .addSliderInput({
      path: 'pointRadius',
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
    .addBooleanSwitch({
      path: 'line',
      name: 'Show Line',
      description: 'Connect data points with a line?',
      defaultValue: true,
      category: ['Display options'],
    })
    .addRadio({
      path: 'gradient',
      name: 'Gradient',
      description: 'The series color gradient.',
      category: ['Display options'],
      defaultValue: 'v',
      settings: {
        allowCustomValue: false,
        options: [
          {
            value: 'viridis',
            label: 'Viridis',
            imgUrl: viridis,
          },
          {
            value: 'inferno',
            label: 'Inferno',
            imgUrl: inferno,
          },
          {
            value: 'magma',
            label: 'Magma',
            imgUrl: magma,
          },
          {
            value: 'plasma',
            label: 'Plasma',
            imgUrl: plasma,
          },
        ],
      },
    })
    .addBooleanSwitch({
      path: 'advanced',
      name: 'Show Advanced State Variables',
      description: 'Additionally show humidity ratio, vapor pressure, enthalpy, and specific volume on hover.',
      defaultValue: false,
      category: ['Display options'],
    });
});
