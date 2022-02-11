'use strict';

const data = {
    series: [
        {
            name: 'A',
            fields: [
                {
                    name: 'id',
                    type: 'number',
                    values: [1, 2, 3, 4],
                },
                {
                    name: 'timestamp',
                    type: 'time',
                    values: [1001, 1002, 1003, 1004],
                },
                {
                    name: 'value',
                    type: 'number',
                    values: [10, 20, 30, 40],
                },
            ],
        },
        {
            name: 'B',
            fields: [
                {
                    name: 'timestamp',
                    type: 'time',
                    values: [1000, 1003, 1004, 1005],
                },
                {
                    name: 'value',
                    type: 'number',
                    values: [15, 25, 35, 45],
                },
            ],
        },
    ],
};

const timeSeriesData = {
    '2022-02-10_15_05_00': {
        'db': 1,
        'rh': 1,
    },
    '2022-02-10_15_05_01': {
        'db': 1,
        'rh': 1,
    },
    '2022-02-10_15_05_02': {
        'db': 1,
        'rh': 1,
    },
    '2022-02-10_15_05_03': {
        'db': 1,
        'rh': 1,
    },
};

window.onload = () => {
    const pre = document.getElementById('result');
    const setText = (text) => pre.innerText += JSON.stringify(text, null, 2) + '\n\n';

    const formatted = {};
    data.series.forEach(serie => {
        serie.fields.find(field => field.type === 'time').values.forEach((t, i) => {
            serie.fields.filter(field => field.type === 'number').forEach(numberField => {
                formatted[t] = formatted[t] || {};
                formatted[t][serie.name + '.' + numberField.name] = numberField.values[i];
            });
        });
    });
    setText(formatted);

};