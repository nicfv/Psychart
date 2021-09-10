import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { useTheme } from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  // Start Psychrolib Test
  const psychrolib = require('psychrolib.js');
  psychrolib.SetUnitSystem(psychrolib.IP);
  let dp = psychrolib.GetTDewPointFromRelHum(75.0, 0.8);
  console.log('Dew point at 75F, 80%rh = ' + dp + 'F');
  // End Psychrolib Test
  const theme = useTheme();
  let color: string;
  switch (options.color) {
    case 'red': {
      color = theme.palette.redBase;
      break;
    }
    case 'green': {
      color = theme.palette.greenBase;
      break;
    }
    case 'blue': {
      color = theme.palette.blue95;
      break;
    }
  }
  const radii = data.series
    .map((series) => series.fields.find((field) => field.type === 'number'))
    .map((field) => field?.values.get(field.values.length - 1));
  return (
    <div>
      <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 -${height / 2} ${width} ${height}`}
      >
        <g fill={color}>
          {radii.map((radius, index) => {
            const step = width / radii.length;
            return <circle key={index} r={radius} transform={`translate(${index * step + step / 2}, 0)`} />;
          })}
        </g>
      </svg>
    </div>
  );
};
