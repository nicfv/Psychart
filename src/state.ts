'use strict';

import { Psychart } from 'psychart';

interface JState {
  ps: any;
  width: number;
  height: number; // TODO: may need to include more variables in the state (e.g. dbMin, etc.) so that we don't re-create the psychart every frame
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
    // TODO: testing a large number of points for performance
    for (let i = 0; i < 1000; i++) {
      this.ps.plotDbRh(i + ' sec', (i % 70) + 30, (i / 60) % 0.99);
    }
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
