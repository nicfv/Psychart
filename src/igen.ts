import fs from 'fs';
import Psychart from 'psychart';

for (let gradient of Psychart.getGradientNames()) {
    fs.writeFileSync(
        'src/img/' + gradient.toLowerCase() + '.svg',
        Psychart.getGradientIcon(gradient));
}