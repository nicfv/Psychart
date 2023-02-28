import { Psychart } from "psychart";
import { Layout, PsyOptions, StyleOptions } from "types";
import { Color } from "color";

const c = new Color(999, -5, 3);

console.log(c.toString());

// var ps, dbRange = { min: 0, max: 0 };

// window.onload = () => {
//     const dom = {
//         generator: document.getElementById('generator'),
//         container: document.getElementById('svg-container'),
//         dataInput: document.getElementById('data-input'),
//         btnGenerate: document.getElementById('btnGenerate'),
//         btnPlot: document.getElementById('btnPlot'),
//         btnClear: document.getElementById('btnClear'),
//         SI: () => !!(document.getElementById('unitSystem_SI') as HTMLInputElement).checked,
//         DbMin: () => +document.getElementById('db_min').value,
//         DbMax: () => +document.getElementById('db_max').value,
//         DpMax: () => +document.getElementById('dp_max').value,
//         Alt: () => +document.getElementById('alt').value,
//         Adv: () => !!document.getElementById('adv').checked,
//         RecHi: () => !!document.getElementById('rec_hi').checked,
//         RecLo: () => !!document.getElementById('rec_lo').checked,
//         A1: () => !!document.getElementById('a1').checked,
//         A2: () => !!document.getElementById('a2').checked,
//         A3: () => !!document.getElementById('a3').checked,
//         A4: () => !!document.getElementById('a4').checked,
//         DbWb: () => !!document.getElementById('measurementType_dbwb').checked,
//         DbDp: () => !!document.getElementById('measurementType_dbdp').checked,
//         DbRh: () => !!document.getElementById('measurementType_dbrh').checked,
//         Db: () => +document.getElementById('db').value,
//         State2: () => +document.getElementById('state2').value,
//         Color: () => document.getElementById('ptColor').value,
//         Rad: () => +document.getElementById('ptRad').value,
//         Line: () => !!document.getElementById('ptLine').checked ? 1 : 0,
//         Time: () => !!document.getElementById('ptTime').checked ? new Date().toLocaleString() : '',
//     };
//     Object.freeze(dom);
//     dom.container.style.display = 'none';
//     dom.dataInput.style.display = 'none';

//     dom.btnGenerate.onclick = () => {
//         if (dom.DbMin() >= dom.DbMax()) {
//             alert('Dry bulb min should be less than dry bulb max.');
//         } else if (dom.DpMax() > dom.DbMax()) {
//             alert('Dew point max should be less than or equal to dry bulb max.');
//         } else {
//             ps = new Psychart(800, 600, dom.SI(), dom.DbMin(), dom.DbMax(), dom.DpMax(), dom.Alt(), dom.Adv(),
//                 isDarkTheme() ? '#333' : '#DDD',
//                 isDarkTheme() ? '#CCD' : '#222');
//             // **** Render ASHRAE regions **** //
//             const SI = dom.SI();
//             if (dom.A4()) {
//                 ps.newRegion('A4\nASHRAE comfort zone', isDarkTheme() ? GetRegionColor(20) : GetRegionColor(80));
//                 ps.regionDbDp(SI ? 5 : CtoF(5), SI ? -12 : CtoF(-12));
//                 ps.regionDbRh(SI ? 22.5 : CtoF(22.5), 0.08);
//                 ps.regionDbRh(SI ? 45 : CtoF(45), 0.08);
//                 ps.regionDbDp(SI ? 45 : CtoF(45), SI ? 24 : CtoF(24));
//                 ps.regionDbRh(SI ? 25.8 : CtoF(25.8), 0.9);
//                 ps.regionDbRh(SI ? 5 : CtoF(5), 0.9);
//                 ps.buildRegion();
//             }
//             if (dom.A3()) {
//                 ps.newRegion('A3\nASHRAE comfort zone', isDarkTheme() ? GetRegionColor(30) : GetRegionColor(70));
//                 ps.regionDbDp(SI ? 5 : CtoF(5), SI ? -12 : CtoF(-12));
//                 ps.regionDbRh(SI ? 22.5 : CtoF(22.5), 0.08);
//                 ps.regionDbRh(SI ? 40 : CtoF(40), 0.08);
//                 ps.regionDbDp(SI ? 40 : CtoF(40), SI ? 24 : CtoF(24));
//                 ps.regionDbRh(SI ? 26.7 : CtoF(26.7), 0.85);
//                 ps.regionDbRh(SI ? 5 : CtoF(5), 0.85);
//                 ps.buildRegion();
//             }
//             if (dom.A2()) {
//                 ps.newRegion('A2\nASHRAE comfort zone', isDarkTheme() ? GetRegionColor(40) : GetRegionColor(60));
//                 ps.regionDbDp(SI ? 10 : CtoF(10), SI ? -12 : CtoF(-12));
//                 ps.regionDbRh(SI ? 22.5 : CtoF(22.5), 0.08);
//                 ps.regionDbRh(SI ? 35 : CtoF(35), 0.08);
//                 ps.regionDbDp(SI ? 35 : CtoF(35), SI ? 21 : CtoF(21));
//                 ps.regionDbRh(SI ? 24.7 : CtoF(24.7), 0.8);
//                 ps.regionDbRh(SI ? 10 : CtoF(10), 0.8);
//                 ps.buildRegion();
//             }
//             if (dom.A1()) {
//                 ps.newRegion('A1\nASHRAE comfort zone', isDarkTheme() ? GetRegionColor(50) : GetRegionColor(50));
//                 ps.regionDbDp(SI ? 15 : CtoF(15), SI ? -12 : CtoF(-12));
//                 ps.regionDbRh(SI ? 22.5 : CtoF(22.5), 0.08);
//                 ps.regionDbRh(SI ? 32 : CtoF(32), 0.08);
//                 ps.regionDbDp(SI ? 32 : CtoF(32), SI ? 17 : CtoF(17));
//                 ps.regionDbRh(SI ? 20.6 : CtoF(20.6), 0.8);
//                 ps.regionDbRh(SI ? 15 : CtoF(15), 0.8);
//                 ps.buildRegion();
//             }
//             if (dom.RecLo()) {
//                 ps.newRegion(
//                     'Recommended ASHRAE conditions\nfor low levels of pollutants',
//                     isDarkTheme() ? GetRegionColor(60) : GetRegionColor(40)
//                 );
//                 ps.regionDbDp(SI ? 18 : CtoF(18), SI ? -9 : CtoF(-9));
//                 ps.regionDbDp(SI ? 27 : CtoF(27), SI ? -9 : CtoF(-9));
//                 ps.regionDbDp(SI ? 27 : CtoF(27), SI ? 15 : CtoF(15));
//                 ps.regionDbRh(SI ? 20.7 : CtoF(20.7), 0.7);
//                 ps.regionDbRh(SI ? 18 : CtoF(18), 0.7);
//                 ps.buildRegion();
//             }
//             if (dom.RecHi()) {
//                 ps.newRegion(
//                     'Recommended ASHRAE conditions\nfor high levels of pollutants',
//                     isDarkTheme() ? GetRegionColor(70) : GetRegionColor(30)
//                 );
//                 ps.regionDbDp(SI ? 18 : CtoF(18), SI ? -9 : CtoF(-9));
//                 ps.regionDbDp(SI ? 27 : CtoF(27), SI ? -9 : CtoF(-9));
//                 ps.regionDbDp(SI ? 27 : CtoF(27), SI ? 15 : CtoF(15));
//                 ps.regionDbRh(SI ? 26.2 : CtoF(26.2), 0.5);
//                 ps.regionDbRh(SI ? 18 : CtoF(18), 0.5);
//                 ps.buildRegion();
//             }
//             dom.container.appendChild(ps.el());
//             ps.el().addEventListener('updatePsychart', function () {
//                 console.log('Updated!');
//             }, false);
//             dom.generator.style.display = 'none';
//             dom.container.style.display = 'block';
//             dom.dataInput.style.display = 'block';
//             dbRange = {
//                 min: dom.DbMin(),
//                 max: dom.DbMax(),
//             };
//         }
//     };

//     dom.btnPlot.onclick = () => {
//         console.log('plotting');
//         if (ps instanceof Psychart) {
//             if (dom.DbWb()) {
//                 if (dom.State2() > dom.Db()) {
//                     alert('Wet bulb is greater than dry bulb temperature!');
//                 } else {
//                     ps.plotDbWb(dom.Db(), dom.State2(), dom.Time(), dom.Color(), dom.Rad(), dom.Line());
//                 }
//             } else if (dom.DbDp()) {
//                 if (dom.State2() > dom.Db()) {
//                     alert('Dew point is greater than dry bulb temperature!');
//                 } else {
//                     ps.plotDbDp(dom.Db(), dom.State2(), dom.Time(), dom.Color(), dom.Rad(), dom.Line());
//                 }
//             } else if (dom.DbRh()) {
//                 if (dom.State2() < 0 || dom.State2() > 100) {
//                     alert('Relative humidity is out of bounds! [0%-100%]');
//                 } else {
//                     ps.plotDbRh(dom.Db(), dom.State2() / 100, dom.Time(), dom.Color(), dom.Rad(), dom.Line());
//                 }
//             }
//         }
//     };

//     dom.btnClear.onclick = () => {
//         if (confirm('This will clear ALL data. Are you sure?')) {
//             if (ps instanceof Psychart) {
//                 ps.clearData();
//             }
//         }
//     };
//     console.log('Loaded script!');
// };

// const generateRandomData = (n) => {
//     const ran = (min, max) => Math.random() * (max - min) + min;
//     const clamp = (x, min, max) => Math.min(Math.max(min, x), max);
//     if (ps instanceof Psychart) {
//         let ranDb = ran(dbRange.min, dbRange.max), ranRh = ran(0, 1);
//         for (let i = 0; i < n; i++) {
//             ranDb += ran(-2, 2);
//             ranDb = clamp(ranDb, dbRange.min, dbRange.max);
//             ranRh += ran(-0.05, 0.05);
//             ranRh = clamp(ranRh, 0, 1);
//             ps.plotDbRh(ranDb, ranRh, '', 'hsl(' + i + ',100%,' + (i / n * 60 + 20) + '%)', 5, 1);
//         }
//     }
// };

// const isDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

// const GetRegionColor = (l) => 'hsl(260, 20%, ' + l + '%)';

// // Convert from Celsius to Fahrenheit
// const CtoF = (C) => (9 / 5) * C + 32;