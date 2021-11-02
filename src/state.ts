'use strict';

import { Psychart } from 'psychart';

interface JState {
  ps: any;
  width: number;
  height: number;
}

class CState implements JState {
  ps: any;
  width: number;
  height: number;
  constructor() {
    this.ps = null;
    this.width = 0;
    this.height = 0;
  }
  initPsyChart(unitSystem: string, dbMin: number, dbMax: number, dpMax: number, isLightTheme: boolean) {
    this.ps = new Psychart(
      this.width,
      this.height,
      unitSystem === 'IP' ? 1 : 2,
      dbMin,
      dbMax,
      dpMax,
      isLightTheme ? '#CCC' : '#666',
      isLightTheme ? '#666' : '#CCC'
    );
  }
  setSize(w: number, h: number) {
    if (w !== this.width || h !== this.height) {
      this.width = w;
      this.height = h;
    }
  }
  getElement() {
    return this.ps.el();
  }
}

export var State = new CState();
