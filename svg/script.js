'use strict';

var ps;

window.onload = () => {
    const width = 800, height = 600;
    const container = document.getElementById('svg-container');
    ps = new Psychart(width, height, 1, 20, 120, 90, '#CCC', '#333');
    container.appendChild(ps.el());
    ps.el().addEventListener('updatePsychart', function () {
        // container.innerHTML = ps.el().outerHTML;
        console.log('Updated!');
    }, false);
    console.log('Loaded script!');
};