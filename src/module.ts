import { PanelPlugin, SelectableValue } from '@grafana/data';
import { DataOptions, PsyOptions } from './types';
import { PsyPanel } from './panel';
import { Psychart } from 'psychart';
import { icons } from 'icons';
import { format, getFieldList } from 'formatter';
import { JMath } from 'jmath';
import { cleanOptions } from 'validator';

export const plugin = new PanelPlugin<PsyOptions>(PsyPanel).setPanelOptions((builder, context) => {
  cleanOptions(context.options);
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
        options: Psychart.getRegionNamesAndTips().map(([name, tip]) => {
          return {
            value: name,
            label: name,
            description: tip,
          };
        }),
      },
    })
    .addNumberInput({
      path: 'count',
      name: 'Series Count',
      description: 'Define the number of data series to show.',
      defaultValue: 0,
      settings: {
        integer: true,
        min: 0,
        max: 26,
        step: 1,
      },
      category: ['Data options'],
    })
    .addNestedOptions<DataOptions[]>({
      path: 'series',
      category: ['Data options'],
      build(subbuilder) {
        const fieldOptions: Array<SelectableValue<string>> = getFieldList(format(context.data)).map(f => {
          return {
            label: f,
            value: f,
          };
        });
        for (let i = 0; i < (context.options?.count ?? 0); i++) {
          // Delete data options that shouldn't be rendered
          context.options!.series = context.options?.series || {};
          Object.keys(context.options!.series).forEach(key => {
            if (+key >= context.options!.count) {
              delete context.options?.series[+key];
            }
          });
          const subcategory: string = 'Series ' + JMath.itoa(i);
          subbuilder
            .addTextInput({
              path: i + '.legend',
              name: 'Legend',
              description: 'Add a label to this data series.',
              category: [subcategory],
              settings: {
                maxLength: 50,
                placeholder: subcategory,
              }
            })
            .addSelect({
              path: i + '.measurements',
              name: 'Measurements',
              description: 'Select which series are being measured.',
              defaultValue: 'dbwb',
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: true,
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
              showIf: (x) => !!(x?.[i]?.legend),
            })
            .addSelect({
              path: i + '.dryBulb',
              name: 'Dry Bulb Series',
              description: 'Select a series that measures the dry bulb temperature.',
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: true,
                options: fieldOptions,
              },
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements),
            })
            .addSelect({
              path: i + '.wetBulb',
              name: 'Wet Bulb Series',
              description: 'Select a series that measures the wet bulb temperature.',
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: true,
                options: fieldOptions,
              },
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements === 'dbwb'),
            })
            .addSelect({
              path: i + '.dewPoint',
              name: 'Dew Point Series',
              description: 'Select a series that measures the dew point temperature.',
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: true,
                options: fieldOptions,
              },
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements === 'dbdp'),
            })
            .addSelect({
              path: i + '.relHum',
              name: 'Relative Humidity Series',
              description: 'Select a series that measures the relative humidity.',
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: true,
                options: fieldOptions,
              },
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements === 'dbrh'),
            })
            .addRadio({
              path: i + '.relHumType',
              name: 'Relative Humidity Type',
              description: 'Choose how relative humidity is actively being measured.',
              category: [subcategory],
              defaultValue: 'percent',
              settings: {
                allowCustomValue: false,
                isClearable: false,
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
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements === 'dbrh'),
            })
            .addSliderInput({
              path: i + '.pointRadius',
              name: 'Point Size',
              description: 'Enter the point radius, in pixels.',
              defaultValue: 5,
              category: [subcategory],
              settings: {
                min: 1,
                max: 10,
                step: 1,
              },
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements),
            })
            .addBooleanSwitch({
              path: i + '.line',
              name: 'Show Line',
              description: 'Connect data points with a line?',
              defaultValue: true,
              category: [subcategory],
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements),
            })
            .addSelect({
              path: i + '.gradient',
              name: 'Gradient',
              description: 'The series color gradient.',
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                options: Psychart.getGradientNames().map(name => {
                  return {
                    value: name,
                    label: name,
                    imgUrl: icons[name],
                  };
                }),
              },
              defaultValue: 'Viridis',
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements),
            })
            .addBooleanSwitch({
              path: i + '.advanced',
              name: 'Show Advanced State Variables',
              description: 'Additionally show humidity ratio, vapor pressure, enthalpy, and specific volume on hover.',
              defaultValue: false,
              category: [subcategory],
              showIf: (x) => !!(x?.[i]?.legend && x?.[i]?.measurements),
            });
        }
      },
    });
});
