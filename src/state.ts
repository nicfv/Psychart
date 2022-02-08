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
    isLightTheme: boolean
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
    // TODO: testing a large number of points for performance
    for (let i = 0; i < 2000; i++) {
      this.ps.plotDbRh(i + ' sec', (i % 70) + 30, (i / 60) % 0.99);
    }
  }
  getElement() {
    return this.ps.el();
  }
}

export var State = new CState();
