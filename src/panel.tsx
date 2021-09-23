import React from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme(),
    psModule = require('psychart.js'),
    ps = new psModule.Psychart(
      width,
      height,
      1,
      20,
      120,
      90,
      theme.isLight ? '#CCC' : '#666',
      theme.isLight ? '#666' : '#CCC'
    );
  return <div dangerouslySetInnerHTML={{ __html: ps.el().outerHTML }}></div>;
};
