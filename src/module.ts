import { PanelPlugin, SelectableValue } from '@grafana/data';
import { GrafanaPsychartOptions } from './types';
import { PsyPanel } from './components/panel';
import { Psychart } from 'psychart';
import { clean, format, getFieldList, migrate } from './formatter';
import { defaultDataOptions, defaultGrafanaOptions, Gradients } from './defaults';
import { PaletteName } from 'viridis';

export const plugin = new PanelPlugin<GrafanaPsychartOptions>(PsyPanel).setPanelOptions((builder, context) => {
  context.options = clean(context.options ?? {}, defaultGrafanaOptions);
  // Generate a list of valid field options
  const fieldOptions: Array<SelectableValue<string>> = getFieldList(format(context.data)).map(f => {
    return {
      label: f,
      value: f,
    } as SelectableValue;
  });
  // Delete data options that shouldn't be rendered
  for (const key in context.options.series) {
    if (+key >= context.options.count) {
      delete context.options.series[+key];
    }
  }
  return builder
    .addRadio({
      path: 'unitSystem',
      name: 'Unit System',
      description: 'Select a unit system.',
      defaultValue: context.options.unitSystem,
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
    .addBooleanSwitch({
      path: 'showLegend',
      name: 'Show Legend',
      description: 'Display the legend in the panel.',
      defaultValue: context.options.showLegend,
      category: ['Chart options'],
    })
    .addNumberInput({
      path: 'altitude',
      name: 'Altitude',
      description: 'Enter the altitude from sea level in feet or meters.',
      defaultValue: context.options.altitude,
      category: ['Chart options'],
      settings: {
        step: 1,
        integer: true,
        placeholder: context.options.altitude.toString(),
      },
    })
    .addNumberInput({
      path: 'dbMin',
      name: 'Minimum Dry Bulb Temperature',
      description: 'Enter the minimum dry bulb temperature to display, or the lower x-bound.',
      defaultValue: context.options.dbMin,
      category: ['Chart options'],
      settings: {
        step: 10,
        integer: true,
        placeholder: context.options.dbMin.toString(),
      },
    })
    .addNumberInput({
      path: 'dbMax',
      name: 'Maximum Dry Bulb Temperature',
      description: 'Enter the maximum dry bulb temperature to display, or the upper x-bound.',
      defaultValue: context.options.dbMax,
      category: ['Chart options'],
      settings: {
        step: 10,
        integer: true,
        min: context.options.dpMax,
        placeholder: context.options.dbMax.toString(),
      },
    })
    .addNumberInput({
      path: 'dpMax',
      name: 'Maximum Dew Point Temperature',
      description: 'Enter the maximum dew point temperature to display, or the upper y-bound.',
      defaultValue: context.options.dpMax,
      category: ['Chart options'],
      settings: {
        step: 10,
        integer: true,
        max: context.options.dbMax,
        placeholder: context.options.dpMax.toString(),
      },
    })
    .addBooleanSwitch({
      path: 'mollier',
      name: 'Mollier',
      description: 'Render a Mollier diagram (EU) instead of a standard (US) psychrometric chart.',
      defaultValue: context.options.mollier,
      category: ['Chart options'],
    })
    .addMultiSelect({
      path: 'regions',
      name: 'Comfort Regions',
      description: 'Select which comfort regions to display.',
      category: ['Chart options'],
      settings: {
        allowCustomValue: false,
        options: Psychart.getRegionNamesAndTips().map(([name, tip]) => {
          return {
            value: name,
            label: name,
            description: tip,
          } as SelectableValue<string>;
        }),
      },
    })
    .addNestedOptions<GrafanaPsychartOptions['major']>({
      path: 'major',
      category: ['Chart options'],
      build(subbuilder, subcontext) {
        subcontext.options = subcontext.options || defaultGrafanaOptions.major;
        subbuilder
          .addNumberInput({
            path: 'temp',
            name: 'Temperature',
            description: 'The major interval between temperature axes in the units provided.',
            defaultValue: subcontext.options.temp,
            category: ['Axis Intervals'],
            settings: {
              step: 1,
              min: 1,
              max: 100,
              placeholder: subcontext.options.temp.toString(),
            },
          })
          .addNumberInput({
            path: 'humRat',
            name: 'Humidity Ratio',
            description: 'The major interval between humidity ratio axes in the units provided.',
            defaultValue: subcontext.options.humRat,
            category: ['Axis Intervals'],
            settings: {
              step: 1,
              min: 1,
              max: 100,
              placeholder: subcontext.options.humRat.toString(),
            },
            showIf: (x) => context.options!.mollier
          })
          .addNumberInput({
            path: 'relHum',
            name: 'Relative Humidity',
            description: 'The major interval between relative humidity axes in percent.',
            defaultValue: subcontext.options.relHum,
            category: ['Axis Intervals'],
            settings: {
              step: 1,
              min: 1,
              max: 100,
              placeholder: subcontext.options.relHum.toString(),
            },
          });
      },
    })
    .addNumberInput({
      path: 'count',
      name: 'Series Count',
      description: 'Define the number of data series to show.',
      category: ['Data options'],
      defaultValue: context.options.count,
      settings: {
        integer: true,
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'Number of series',
      },
    })
    .addNestedOptions<GrafanaPsychartOptions['series']>({
      path: 'series',
      category: ['Data options'],
      build(subbuilder, subcontext) {
        subcontext.options = subcontext.options || {};
        // Generate controls for data series
        for (let i = 0; i < context.options!.count; i++) {
          // Force clean data options
          subcontext.options[i] = clean(subcontext.options[i] || {}, defaultDataOptions);
          // Use legend as subcategory or default string if none exists
          const subcategory: string = subcontext.options[i].seriesName || 'Series ' + (i + 1);
          subbuilder
            .addTextInput({
              path: i + '.seriesName',
              name: 'Legend',
              description: 'Add a label to this data series.',
              defaultValue: subcontext.options[i].seriesName,
              category: [subcategory],
              settings: {
                maxLength: 50,
                placeholder: subcategory,
              }
            })
            .addSelect({
              path: i + '.measurement',
              name: 'Measurements',
              description: 'Select which series are being measured.',
              defaultValue: subcontext.options[i].measurement,
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: false,
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
              showIf: (x) => !!(x[i].seriesName),
            })
            .addSelect({
              path: i + '.dryBulb',
              name: 'Dry Bulb Series',
              description: 'Select a series that measures the dry bulb temperature.',
              defaultValue: subcontext.options[i].dryBulb,
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: true,
                options: fieldOptions,
              },
              showIf: (x) => !!(x[i].seriesName),
            })
            .addSelect({
              path: i + '.other',
              name: 'Other Series',
              description: 'Select a series that measures the secondary state variable.',
              defaultValue: subcontext.options[i].other,
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: true,
                options: fieldOptions,
              },
              showIf: (x) => !!(x[i].seriesName),
            })
            .addRadio({
              path: i + '.relHumType',
              name: 'Relative Humidity Type',
              description: 'Choose how relative humidity is actively being measured.',
              category: [subcategory],
              defaultValue: subcontext.options[i].relHumType,
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
              showIf: (x) => !!(x[i].seriesName && x[i].measurement === 'dbrh'),
            })
            .addSliderInput({
              path: i + '.pointRadius',
              name: 'Point Size',
              description: 'Enter the point radius, in pixels.',
              defaultValue: subcontext.options[i].pointRadius,
              category: [subcategory],
              settings: {
                min: 1,
                max: 10,
                step: 1,
              },
              showIf: (x) => !!(x[i].seriesName),
            })
            .addBooleanSwitch({
              path: i + '.line',
              name: 'Show Line',
              description: 'Connect data points with a line?',
              defaultValue: subcontext.options[i].line as boolean,
              category: [subcategory],
              showIf: (x) => !!(x[i].seriesName),
            })
            .addSelect({
              path: i + '.gradient',
              name: 'Gradient',
              description: 'The series color gradient.',
              defaultValue: subcontext.options[i].gradient,
              category: [subcategory],
              settings: {
                allowCustomValue: false,
                isClearable: false,
                options: Gradients.map(grad => {
                  return {
                    value: grad.name,
                    label: grad.name,
                    imgUrl: grad.url,
                  } as SelectableValue<PaletteName>;
                }),
              },
              showIf: (x) => !!(x[i].seriesName),
            })
            .addBooleanSwitch({
              path: i + '.advanced',
              name: 'Show Advanced State Variables',
              description: 'Additionally show humidity ratio, vapor pressure, enthalpy, and specific volume on hover.',
              defaultValue: subcontext.options[i].advanced,
              category: [subcategory],
              showIf: (x) => !!(x[i].seriesName),
            });
        }
      },
    });
}).setMigrationHandler(migrate);
