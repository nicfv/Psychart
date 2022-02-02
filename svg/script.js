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

const generateRandomData = (n) => {
    const ran = (min, max) => Math.random() * (max - min) + min;
    if (ps instanceof Psychart) {
        for (let i = 0; i < n; i++) {
            ps.plotDbRh(i + ' sec', ran(20, 120), ran(0, 1), 'rgb(' + ran(0, 255) + ',' + ran(0, 255) + ',' + ran(0, 255) + ')');
        }
        ps.newRegion('#0f0');
        ps.regionDbDp(ran(30, 40), ran(10, 20));
        ps.regionDbDp(ran(100, 110), ran(10, 20));
        ps.regionDbDp(ran(100, 110), ran(80, 90));
        ps.buildRegion();
    }
};