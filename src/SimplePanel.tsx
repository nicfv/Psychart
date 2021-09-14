import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const psModule = require('psychart.js'),
    ps = new psModule.Psychart(width, height, 1, 20, 120, 90);
  return <div dangerouslySetInnerHTML={{ __html: ps.el().outerHTML }}></div>;
};
