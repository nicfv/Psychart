import React from 'react';

type DynamicState = {
  text: string;
  x: number;
  y: number;
  fill: string;
};

export class Dynamic extends React.Component<{}, DynamicState> {
  constructor(props: any) {
    super(props);
    this.state = { text: 'default', x: 50, y: 60, fill: 'white' };
  }
  render() {
    return (
      <text x={this.state.x} y={this.state.y} fill={this.state.fill}>
        {this.state.text}
      </text>
    );
  }
}
