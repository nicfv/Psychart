import { Color } from "color";
import { Psychart } from "psychart";
import { Layout, PsyOptions, StyleOptions } from "types";

let ps: Psychart;

const setVisibility = (id: string, visible: boolean): string => document.getElementById(id)!.style.display = visible ? 'block' : 'none',
    getCheckedState = (id: string): boolean => (document.getElementById(id) as HTMLInputElement)?.checked,
    getNumericValue = (id: string): number => +(document.getElementById(id) as HTMLInputElement)?.value,
    getStringValue = (id: string): string => (document.getElementById(id) as HTMLInputElement)?.value,
    setOnClick = (id: string, onclick: () => void): void => document.getElementById(id)?.addEventListener('click', onclick),
    isDarkTheme = (): boolean => window.matchMedia("(prefers-color-scheme: dark)").matches;

window.addEventListener('load', () => {
    setVisibility('svg-container', false);
    setVisibility('data-input', false);

    // Create region checkboxes
    Object.entries(Psychart.regions).forEach(([id, region]) => {
        const checkbox = document.createElement('input'),
            label = document.createElement('label'),
            linebreak = document.createElement('br');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        label.setAttribute('for', id);
        label.textContent = region.name;
        label.title = region.tooltip;
        let parent: HTMLElement | null = null;
        if (id.match(/h[0-9]{2}[sw]/)) {
            parent = document.getElementById('ashrae-55-container');
        } else if (id.match(/dc[a0][0-9]/)) {
            parent = document.getElementById('ashrae-dc-container');
        }
        parent?.appendChild(checkbox);
        parent?.appendChild(label);
        parent?.appendChild(linebreak);
    });

    // Add gradient dropdown options
    Object.keys(Psychart.gradients).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key[0].toUpperCase() + key.substring(1).toLowerCase();
        document.getElementById('gradient')?.appendChild(option);
    });

    setOnClick('btnGenerate', () => {
        const dbMin = getNumericValue('db_min'),
            dbMax = getNumericValue('db_max'),
            dpMax = getNumericValue('dp_max'),
            allRegions: string[] = ['dca4', 'dca3', 'dca2', 'dca1', 'dc02', 'dc01', 'h10s', 'h15s', 'h20s', 'h10w', 'h15w', 'h20w'];
        if (dbMin >= dbMax) {
            alert('Dry bulb min should be less than dry bulb max.');
        } else if (dpMax > dbMax) {
            alert('Dew point max should be less than or equal to dry bulb max.');
        } else {
            ps = new Psychart(
                {
                    padding: 30,
                    size: { x: 800, y: 600 },
                } as Layout,
                {
                    advanced: getCheckedState('adv'),
                    altitude: getNumericValue('alt'),
                    dbMax: dbMax,
                    dbMin: dbMin,
                    dpMax: dpMax,
                    gradient: getStringValue('gradient'),
                    line: getCheckedState('ptLine'),
                    pointRadius: getNumericValue('ptRad'),
                    regions: allRegions.filter(region => getCheckedState(region)),
                    relHumType: 'percent',
                    unitSystem: getCheckedState('unitSystem_SI') ? 'SI' : 'IP',
                } as PsyOptions, {
                    darkTheme: isDarkTheme(),
                    fontColor: isDarkTheme() ? new Color(208, 208, 208) : new Color(32, 32, 32),
                    lineColor: isDarkTheme() ? new Color(48, 48, 48) : new Color(224, 224, 224),
                    fontSize: 12,
                    major: 10,
                    resolution: 0.5,
                } as StyleOptions);
            document.getElementById('svg-container')?.appendChild(ps.getElement());
            setVisibility('generator', false);
            setVisibility('svg-container', true);
            setVisibility('data-input', true);
            generateRandomData(); // TODO: remove
        }
    });

    setOnClick('btnPlot', () => {
        const db = getNumericValue('db'),
            state2 = getNumericValue('state2');
        if (getCheckedState('measurementType_dbwb')) {
            if (state2 > db) {
                alert('Wet bulb is greater than dry bulb temperature!');
            } else {
                ps.plot({ db: db, wb: state2 });
            }
        } else if (getCheckedState('measurementType_dbdp')) {
            if (state2 > db) {
                alert('Dew point is greater than dry bulb temperature!');
            } else {
                ps.plot({ db: db, dp: state2 });
            }
        } else if (getCheckedState('measurementType_dbrh')) {
            if (state2 < 0 || state2 > 100) {
                alert('Relative humidity is out of bounds! [0%-100%]');
            } else {
                ps.plot({ db: db, rh: state2 });
            }
        }
    });

    setOnClick('btnClear', () => {
        if (confirm('This will clear ALL data. Are you sure?')) {
            ps.clearData();
        }
    });
    console.log('Loaded script!');
});

const generateRandomData = (n = 1e3): void => {
    const ran = (min: number, max: number): number => Math.random() * (max - min) + min,
        clamp = (x: number, min: number, max: number) => Math.min(Math.max(min, x), max),
        dbMin = getNumericValue('db_min'),
        dbMax = getNumericValue('db_max');
    let ranDb = ran(dbMin, dbMax), ranRh = ran(0, 1);
    for (let i = 0; i < n; i++) {
        ranDb += ran(-2, 2);
        ranDb = clamp(ranDb, dbMin, dbMax);
        ranRh += ran(-0.05, 0.05);
        ranRh = clamp(ranRh, 0, 1);
        console.log('plotting ' + ranDb + ',' + ranRh);
        ps.plot({ db: ranDb, rh: ranRh });
    }
};
