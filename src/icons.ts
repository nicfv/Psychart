import { GradientName } from 'types';

import viridis from './img/viridis.png';
import inferno from './img/inferno.png';
import magma from './img/magma.png';
import plasma from './img/plasma.png';

export const icons: { [K in GradientName]: string } = {
    Viridis: viridis,
    Inferno: inferno,
    Magma: magma,
    Plasma: plasma,
    Blue: '',
};
