'use strict';

var ps;

window.onload = () => {
    const width = 800, height = 600;
    const container = document.getElementById('svg-container');
    ps = new Psychart(width, height, false, 20, 120, 90, 0, true, '#DDD', '#222');
    container.appendChild(ps.el());
    ps.el().addEventListener('updatePsychart', function () {
        // container.innerHTML = ps.el().outerHTML;
        console.log('Updated!');
    }, false);
    console.log('Loaded script!');
};

const generateRandomData = (n) => {
    const ran = (min, max) => Math.random() * (max - min) + min;
    const clamp = (x, min, max) => Math.min(Math.max(min, x), max);
    if (ps instanceof Psychart) {
        let ranDb = ran(30, 110), ranRh = ran(0, 1);
        for (let i = 0; i < n; i++) {
            ranDb += ran(-2, 2);
            ranRh += ran(-0.1, 0.1);
            ranRh = clamp(ranRh, 0, 1);
            ps.plotDbRh(ranDb, ranRh, i + ' sec', 'rgb(' + i + ', ' + (255 - i) + ', ' + i + ')', 5, 1);
        }
        const minDb = ran(30, 50), maxDb = ran(60, 110), minRh = ran(0.0, 0.4), maxRh = ran(0.6, 1.0);
        ps.newRegion('A1\nASHRAE comfort zone', '#0f6');
        ps.regionDbRh(minDb, minRh);
        ps.regionDbRh(maxDb, minRh);
        ps.regionDbRh(maxDb, maxRh);
        ps.regionDbRh(minDb, maxRh);
        ps.buildRegion();
    }
};