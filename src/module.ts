import { PanelPlugin, SelectableValue } from '@grafana/data';
import { PsyOptions } from './types';
import { PsyPanel } from './panel';
import { Psychart } from 'psychart';
import { icons } from 'icons';
import { format, getFieldList } from 'formatter';
import { JMath } from 'jmath';
import { cleanDataOptions, cleanPsyOptions } from 'validator';

export const plugin = new PanelPlugin<PsyOptions>(PsyPanel).setPanelOptions((builder, context) => {
  context.options = cleanPsyOptions(context.options || {});
  builder
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
    .addNumberInput({
      path: 'altitude',
      name: 'Altitude',
      description: 'Enter the altitude from sea level in feet or meters.',
      defaultValue: context.options.altitude,
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
      defaultValue: context.options.dbMin,
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
      defaultValue: context.options.dbMax,
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
      defaultValue: context.options.dpMax,
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
          } as SelectableValue<string>;
        }),
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
        max: 26,
        step: 1,
      },
    });
  // Generate a list of valid field options
  const fieldOptions: Array<SelectableValue<string>> = getFieldList(format(context.data)).map(f => {
    return {
      label: f,
      value: f,
    };
  });
  // Delete data options that shouldn't be rendered
  for (let key in context.options.series) {
    if (+key >= context.options.count) {
      delete context.options.series[+key];
    }
  }
  // Generate controls for data series
  for (let i = 0; i < context.options!.count; i++) {
    const subcategory: string = 'Series ' + JMath.itoa(i);
    context.options.series[i] = cleanDataOptions(context.options.series[i] || {});
    builder
      .addTextInput({
        path: 'series.' + i + '.legend',
        name: 'Legend',
        description: 'Add a label to this data series.',
        defaultValue: undefined,
        category: [subcategory],
        settings: {
          maxLength: 50,
          placeholder: subcategory,
        }
      })
      .addSelect({
        path: 'series.' + i + '.measurements',
        name: 'Measurements',
        description: 'Select which series are being measured.',
        defaultValue: context.options.series[i].measurements,
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
        showIf: (x) => !!(x.series?.[i]?.legend),
      })
      .addSelect({
        path: 'series.' + i + '.dryBulb',
        name: 'Dry Bulb Series',
        description: 'Select a series that measures the dry bulb temperature.',
        defaultValue: context.options.series[i].dryBulb,
        category: [subcategory],
        settings: {
          allowCustomValue: false,
          isClearable: true,
          options: fieldOptions,
        },
        showIf: (x) => !!(x.series?.[i]?.legend),
      })
      .addSelect({
        path: 'series.' + i + '.wetBulb',
        name: 'Wet Bulb Series',
        description: 'Select a series that measures the wet bulb temperature.',
        defaultValue: context.options.series[i].wetBulb,
        category: [subcategory],
        settings: {
          allowCustomValue: false,
          isClearable: true,
          options: fieldOptions,
        },
        showIf: (x) => !!(x.series?.[i]?.legend && x.series?.[i]?.measurements === 'dbwb'),
      })
      .addSelect({
        path: 'series.' + i + '.dewPoint',
        name: 'Dew Point Series',
        description: 'Select a series that measures the dew point temperature.',
        defaultValue: context.options.series[i].dewPoint,
        category: [subcategory],
        settings: {
          allowCustomValue: false,
          isClearable: true,
          options: fieldOptions,
        },
        showIf: (x) => !!(x.series?.[i]?.legend && x.series?.[i]?.measurements === 'dbdp'),
      })
      .addSelect({
        path: 'series.' + i + '.relHum',
        name: 'Relative Humidity Series',
        description: 'Select a series that measures the relative humidity.',
        defaultValue: context.options.series[i].relHum,
        category: [subcategory],
        settings: {
          allowCustomValue: false,
          isClearable: true,
          options: fieldOptions,
        },
        showIf: (x) => !!(x.series?.[i]?.legend && x.series?.[i]?.measurements === 'dbrh'),
      })
      .addRadio({
        path: 'series.' + i + '.relHumType',
        name: 'Relative Humidity Type',
        description: 'Choose how relative humidity is actively being measured.',
        category: [subcategory],
        defaultValue: context.options.series[i].relHumType,
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
        showIf: (x) => !!(x.series?.[i]?.legend && x.series?.[i]?.measurements === 'dbrh'),
      })
      .addSliderInput({
        path: 'series.' + i + '.pointRadius',
        name: 'Point Size',
        description: 'Enter the point radius, in pixels.',
        defaultValue: context.options.series[i].pointRadius,
        category: [subcategory],
        settings: {
          min: 1,
          max: 10,
          step: 1,
        },
        showIf: (x) => !!(x.series?.[i]?.legend),
      })
      .addBooleanSwitch({
        path: 'series.' + i + '.line',
        name: 'Show Line',
        description: 'Connect data points with a line?',
        defaultValue: context.options.series[i].line,
        category: [subcategory],
        showIf: (x) => !!(x.series?.[i]?.legend),
      })
      .addSelect({
        path: 'series.' + i + '.gradient',
        name: 'Gradient',
        description: 'The series color gradient.',
        defaultValue: context.options.series[i].gradient,
        category: [subcategory],
        settings: {
          allowCustomValue: false,
          isClearable: false,
          options: Psychart.getGradientNames().map(name => {
            return {
              value: name,
              label: name,
              imgUrl: icons[name],
            };
          }),
        },
        showIf: (x) => !!(x.series?.[i]?.legend),
      })
      .addBooleanSwitch({
        path: 'series.' + i + '.advanced',
        name: 'Show Advanced State Variables',
        description: 'Additionally show humidity ratio, vapor pressure, enthalpy, and specific volume on hover.',
        defaultValue: context.options.series[i].advanced,
        category: [subcategory],
        showIf: (x) => !!(x.series?.[i]?.legend),
      });
  }
});
