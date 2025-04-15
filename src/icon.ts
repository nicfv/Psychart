import { Gradient, Palette, PaletteName } from 'viridis';

/**
 * Generate and get the URL of a gradient icon.
 */
export function getURL(name: PaletteName, sizePx: number, cornerRadiusPx: number): string {
    const safeName: string = name.toLowerCase().replaceAll(' ', '_'),
        gradient: Gradient = Palette[name],
        base: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
        icon: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    base.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    base.setAttribute('width', sizePx.toString());
    base.setAttribute('height', sizePx.toString());
    base.setAttribute('viewBox', '0 0 ' + sizePx + ' ' + sizePx);
    base.append(gradient.toSVG(safeName), icon);
    icon.setAttribute('fill', 'url(#' + safeName + ')');
    icon.setAttribute('x', '0');
    icon.setAttribute('y', '0');
    icon.setAttribute('width', sizePx.toString());
    icon.setAttribute('height', sizePx.toString());
    icon.setAttribute('rx', cornerRadiusPx.toString());
    return URL.createObjectURL(new Blob([base.outerHTML], { type: 'image/svg+xml' }));
}
