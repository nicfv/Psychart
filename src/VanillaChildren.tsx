import React from 'react';

export class VanillaChildren extends React.Component {
  render() {
    return <div></div>;
    //return <div ref={(ref) => ref!.appendChild(this.props.children)}></div>;
  }
}
