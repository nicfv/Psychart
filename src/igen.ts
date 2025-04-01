import fs from 'fs';
import { GradientNames } from './defaults';
import { Gradient, Palette } from 'viridis';

for (const name of GradientNames) {
    const gradient: Gradient = Palette[name],
        base: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        icon: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    base.append(gradient.toSVG('grad'), icon);
    icon.setAttribute('fill', 'url(#grad)');
    base.setAttribute('viewBox', '0 0 10 10');
    icon.setAttribute('x', '0');
    icon.setAttribute('y', '0');
    icon.setAttribute('width', '10');
    icon.setAttribute('height', '10');
    icon.setAttribute('rx', '2');
    fs.writeFileSync('src/img/' + name.toLowerCase() + '.svg', base.outerHTML);
}
