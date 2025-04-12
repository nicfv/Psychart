import { getColors } from 'defaults';
import { DataOptions, Psychart } from 'psychart';

let ps: Psychart;

const setVisibility = (id: string, visible: boolean): string => document.getElementById(id)!.style.display = visible ? 'block' : 'none',
    getCheckedState = (id: string): boolean => (document.getElementById(id) as HTMLInputElement)?.checked,
    getNumericValue = (id: string): number => +(document.getElementById(id) as HTMLInputElement)?.value,
    getStringValue = (id: string): string => (document.getElementById(id) as HTMLInputElement)?.value,
    setOnClick = (id: string, onclick: () => void): void => document.getElementById(id)?.addEventListener('click', onclick),
    isDarkTheme = (): boolean => window.matchMedia("(prefers-color-scheme: dark)").matches;

setVisibility('svg-container', false);
setVisibility('data-input', false);

// Set the window icon
document.querySelector('link[rel=icon]')
    ?.setAttribute('href', require('img/logo.svg'));

// Create region checkboxes
Psychart.getRegionNamesAndTips().forEach(([name, tip]) => {
    const checkbox = document.createElement('input'),
        label = document.createElement('label'),
        linebreak = document.createElement('br');
    checkbox.type = 'checkbox';
    checkbox.id = name;
    label.setAttribute('for', name);
    label.textContent = name;
    label.title = tip;
    let parent: HTMLElement | null = null;
    if (name.match(/(Summer|Winter).*/)) {
        parent = document.getElementById('ashrae-55-container');
    } else if (name.match(/Givoni.*/)) {
        parent = document.getElementById('givoni-container');
    } else if (name.match(/Data Center.*/)) {
        parent = document.getElementById('ashrae-dc-container');
    } else if (name.match(/IBM TS4500.*/)) {
        parent = document.getElementById('ibm-ts4500-container');
    }
    parent?.appendChild(checkbox);
    parent?.appendChild(label);
    parent?.appendChild(linebreak);
});

setOnClick('btnGenerate', () => {
    const dbMin = getNumericValue('db_min'),
        dbMax = getNumericValue('db_max'),
        dpMax = getNumericValue('dp_max');
    if (dbMin >= dbMax) {
        alert('Dry bulb min should be less than dry bulb max.');
    } else if (dpMax > dbMax) {
        alert('Dew point max should be less than or equal to dry bulb max.');
    } else {
        ps = new Psychart({
            altitude: getNumericValue('alt'),
            dbMax: dbMax,
            dbMin: dbMin,
            dpMax: dpMax,
            flipXY: getCheckedState('flip'),
            yAxis: getCheckedState('flip') ? 'hr' : 'dp',
            regions: Psychart.getRegionNamesAndTips().map(([name,]) => name).filter(name => getCheckedState(name)),
            colors: getColors(isDarkTheme()),
            flipGradients: isDarkTheme(),
            major: getCheckedState('unitSystem_SI') ? { humRat: 5, relHum: 10, temp: 5 } : { humRat: 5, relHum: 10, temp: 10 },
            unitSystem: getCheckedState('unitSystem_SI') ? 'SI' : 'IP',
        });
        document.getElementById('svg-container')?.appendChild(ps.getElement());
        setVisibility('generator', false);
        setVisibility('svg-container', true);
        setVisibility('data-input', true);
    }
});

setOnClick('btnPlot', () => {
    const db: number = getNumericValue('db'),
        state2: number = getNumericValue('state2');
    const dataOpts: Partial<DataOptions> = {
        advanced: getCheckedState('adv'),
        color: getStringValue('color'),
        line: getCheckedState('ptLine'),
        name: getStringValue('name'),
        pointRadius: getNumericValue('ptRad'),
        relHumType: 'percent',
    };
    if (getCheckedState('measurementType_dbwb')) {
        if (state2 > db) {
            alert('Wet bulb is greater than dry bulb temperature!');
        } else {
            ps.plot({ db: db, other: state2, measurement: 'dbwb' }, dataOpts);
        }
    } else if (getCheckedState('measurementType_dbdp')) {
        if (state2 > db) {
            alert('Dew point is greater than dry bulb temperature!');
        } else {
            ps.plot({ db: db, other: state2, measurement: 'dbdp' }, dataOpts);
        }
    } else if (getCheckedState('measurementType_dbrh')) {
        if (state2 < 0 || state2 > 100) {
            alert('Relative humidity is out of bounds! [0%-100%]');
        } else {
            ps.plot({ db: db, other: state2, measurement: 'dbrh' }, dataOpts);
        }
    }
});

setOnClick('btnClear', () => {
    if (confirm('This will clear ALL data. Are you sure?')) {
        ps.clearData();
    }
});
