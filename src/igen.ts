import fs from 'fs';
import { Psychart } from 'psychart';

for (const gradient of Psychart.getGradientNames()) {
    fs.writeFileSync(
        'src/img/' + gradient.toLowerCase() + '.svg',
        Psychart.generateGradientIcon(gradient));
}
