'use strict';

import { Psychart } from 'psychart';

interface JState {
  ps: any;
  width: number;
  height: number; // TODO: may need to include more variables in the state (e.g. dbMin, etc.) so that we don't re-create the psychart every frame
  unitSystem: string;
  dbMin: number;
  dbMax: number;
  dpMax: number;
  isLightTheme: boolean;
}

class CState implements JState {
  ps: any;
  width: number;
  height: number;
  unitSystem: string;
  dbMin: number;
  dbMax: number;
  dpMax: number;
  isLightTheme: boolean;

  constructor() {
    this.ps = null;
    this.width = 0;
    this.height = 0;
    this.unitSystem = '';
    this.dbMin = 0;
    this.dbMax = 0;
    this.dpMax = 0;
    this.isLightTheme = false;
  }
  initPsyChart(
    width: number,
    height: number,
    unitSystem: string,
    dbMin: number,
    dbMax: number,
    dpMax: number,
    isLightTheme: boolean,
    data: { [index: string]: { [index: string]: number } }
  ) {
    if (
      this.width === width &&
      this.height === height &&
      this.unitSystem === unitSystem &&
      this.dbMin === dbMin &&
      this.dbMax === dbMax &&
      this.dpMax === dpMax &&
      this.isLightTheme === isLightTheme
    ) {
      return;
    }
    this.width = width;
    this.height = height;
    this.unitSystem = unitSystem;
    this.dbMin = dbMin;
    this.dbMax = dbMax;
    this.dpMax = dpMax;
    this.isLightTheme = isLightTheme;
    this.ps = new Psychart(
      this.width,
      this.height,
      this.unitSystem === 'IP' ? 1 : 2,
      this.dbMin,
      this.dbMax,
      this.dpMax,
      this.isLightTheme ? '#CCC' : '#666',
      this.isLightTheme ? '#666' : '#CCC'
    );
    for (let t in data) {
      this.ps.plotDbRh(t, data[t]['A.Dry Bulb [F]'], data[t]['A.Relative Humidity [0.0-1.0]']);
    }
  }
  getElement() {
    return this.ps.el();
  }
}

export var State = new CState();
