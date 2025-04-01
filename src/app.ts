// import { Psychart } from 'psychart';
// import { Layout, PsyOptions } from 'types';
// import { PaletteName } from 'viridis';

// let ps: Psychart;

// const setVisibility = (id: string, visible: boolean): string => document.getElementById(id)!.style.display = visible ? 'block' : 'none',
//     getCheckedState = (id: string): boolean => (document.getElementById(id) as HTMLInputElement)?.checked,
//     getNumericValue = (id: string): number => +(document.getElementById(id) as HTMLInputElement)?.value,
//     getStringValue = (id: string): string => (document.getElementById(id) as HTMLInputElement)?.value,
//     setOnClick = (id: string, onclick: () => void): void => document.getElementById(id)?.addEventListener('click', onclick),
//     isDarkTheme = (): boolean => window.matchMedia("(prefers-color-scheme: dark)").matches;

// setVisibility('svg-container', false);
// setVisibility('data-input', false);

// // Set the window icon
// document.querySelector('link[rel=icon]')
//     ?.setAttribute('href', require('img/logo.svg'));

// // Create region checkboxes
// Psychart.getRegionNamesAndTips().forEach(([name, tip]) => {
//     const checkbox = document.createElement('input'),
//         label = document.createElement('label'),
//         linebreak = document.createElement('br');
//     checkbox.type = 'checkbox';
//     checkbox.id = name;
//     label.setAttribute('for', name);
//     label.textContent = name;
//     label.title = tip;
//     let parent: HTMLElement | null = null;
//     if (name.match(/(Summer|Winter).*/)) {
//         parent = document.getElementById('ashrae-55-container');
//     } else if (name.match(/Givoni.*/)) {
//         parent = document.getElementById('givoni-container');
//     } else if (name.match(/Data Center.*/)) {
//         parent = document.getElementById('ashrae-dc-container');
//     } else if (name.match(/IBM TS4500.*/)) {
//         parent = document.getElementById('ibm-ts4500-container');
//     }
//     parent?.appendChild(checkbox);
//     parent?.appendChild(label);
//     parent?.appendChild(linebreak);
// });

// // Add gradient dropdown options
// Psychart.getGradientNames().forEach(name => {
//     const option = document.createElement('option');
//     option.value = name;
//     option.textContent = name;
//     document.getElementById('gradient')?.appendChild(option);
// });

// (document.getElementById('gradient') as HTMLSelectElement).addEventListener('change', updateIcon);

// // Define a function to update the icon associated with the gradient.
// function updateIcon(): void {
//     (document.getElementById('gradicon') as HTMLImageElement)
//         .setAttribute('src', Psychart.getGradientIcon(getStringValue('gradient') as PaletteName));
// }
// updateIcon();

// setOnClick('btnGenerate', () => {
//     const dbMin = getNumericValue('db_min'),
//         dbMax = getNumericValue('db_max'),
//         dpMax = getNumericValue('dp_max');
//     if (dbMin >= dbMax) {
//         alert('Dry bulb min should be less than dry bulb max.');
//     } else if (dpMax > dbMax) {
//         alert('Dew point max should be less than or equal to dry bulb max.');
//     } else {
//         ps = new Psychart(
//             {
//                 padding: { x: 40, y: 20 },
//                 size: { x: 800, y: 600 },
//             } as Layout,
//             {
//                 altitude: getNumericValue('alt'),
//                 count: 1,
//                 dbMax: dbMax,
//                 dbMin: dbMin,
//                 dpMax: dpMax,
//                 flipXY: getCheckedState('flip'),
//                 regions: Psychart.getRegionNamesAndTips().map(([name,]) => name).filter(name => getCheckedState(name)),
//                 series: {
//                     0: {
//                         advanced: getCheckedState('adv'),
//                         dryBulb: '',
//                         enabled: true,
//                         gradient: getStringValue('gradient'),
//                         legend: '',
//                         line: getCheckedState('ptLine'),
//                         measurement: 'dbdp',
//                         other: '',
//                         pointRadius: getNumericValue('ptRad'),
//                         relHumType: 'percent',
//                     }
//                 },
//                 unitSystem: getCheckedState('unitSystem_SI') ? 'SI' : 'IP',
//             } as PsyOptions,
//             Psychart.getDefaultStyleOptions(isDarkTheme()));
//         document.getElementById('svg-container')?.appendChild(ps.getElement());
//         setVisibility('generator', false);
//         setVisibility('svg-container', true);
//         setVisibility('data-input', true);
//     }
// });

// setOnClick('btnPlot', () => {
//     const db = getNumericValue('db'),
//         state2 = getNumericValue('state2');
//     if (getCheckedState('measurementType_dbwb')) {
//         if (state2 > db) {
//             alert('Wet bulb is greater than dry bulb temperature!');
//         } else {
//             ps.plot({ db: db, other: state2, measurement: 'dbwb' });
//         }
//     } else if (getCheckedState('measurementType_dbdp')) {
//         if (state2 > db) {
//             alert('Dew point is greater than dry bulb temperature!');
//         } else {
//             ps.plot({ db: db, other: state2, measurement: 'dbdp' });
//         }
//     } else if (getCheckedState('measurementType_dbrh')) {
//         if (state2 < 0 || state2 > 100) {
//             alert('Relative humidity is out of bounds! [0%-100%]');
//         } else {
//             ps.plot({ db: db, other: state2, measurement: 'dbrh' });
//         }
//     }
// });

// setOnClick('btnClear', () => {
//     if (confirm('This will clear ALL data. Are you sure?')) {
//         ps.clearData();
//     }
// });
