import { GradientName } from 'types';

import viridis from 'img/viridis.svg';
import inferno from 'img/inferno.svg';
import magma from 'img/magma.svg';
import plasma from 'img/plasma.svg';

export const icons: { [K in GradientName]: string } = {
    Viridis: viridis,
    Inferno: inferno,
    Magma: magma,
    Plasma: plasma,
    Blue: '',
};
