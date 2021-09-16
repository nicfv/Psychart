import React from 'react';
import { PanelProps } from '@grafana/data';
import { PsyOptions } from 'types';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const psModule = require('psychart.js'),
    ps = new psModule.Psychart(width, height, 1, 20, 120, 90);
  return <div dangerouslySetInnerHTML={{ __html: ps.el().outerHTML }}></div>;
};
