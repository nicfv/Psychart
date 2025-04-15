import { GradientNames } from './defaults';
import { Gradient, Palette } from 'viridis';

const sizePx = 10;

for (const name of GradientNames) {
    const safeName: string = name.toLowerCase().replaceAll(' ', '_'),
        gradient: Gradient = Palette[name],
        base: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        icon: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
        header: HTMLHeadingElement = document.createElement('h1'),
        code: HTMLElement = document.createElement('code');
    base.setAttribute('width', sizePx.toString());
    base.setAttribute('height', sizePx.toString());
    base.setAttribute('viewBox', '0 0 ' + sizePx + ' ' + sizePx);
    base.append(gradient.toSVG(safeName), icon);
    icon.setAttribute('fill', 'url(#' + safeName + ')');
    icon.setAttribute('x', '0');
    icon.setAttribute('y', '0');
    icon.setAttribute('width', sizePx.toString());
    icon.setAttribute('height', sizePx.toString());
    icon.setAttribute('rx', '2');
    header.textContent = name + ' (' + safeName + ')';
    code.textContent = base.outerHTML;
    document.body.append(header, base, code);
}
