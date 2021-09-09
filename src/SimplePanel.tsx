import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();
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
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`0 -${height / 2} ${width} ${height}`}
      >
        <g fill={color}>
          {radii.map((radius, index) => {
            // blank lines
            // blah
            const step = width / radii.length;
            return <circle key={index} r={radius} transform={`translate(${index * step + step / 2}, 0)`} />;
          })}
        </g>
      </svg>

      <div className={styles.textBox}>
        {options.showSeriesCount && (
          <div
            className={css`
              font-size: ${theme.typography.size[options.seriesCountSize]};
            `}
          >
            Number of series: {data.series.length}
          </div>
        )}
        <div>Text option value: {options.text}</div>
      </div>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
