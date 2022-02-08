import React from 'react';

export class VanillaChildren extends React.Component {
  render() {
    return (
      <div
        ref={(ref) => {
          console.log(typeof ref, ref);
          console.log(JSON.stringify(this.props.children, null, 2));
          ref!.appendChild(document.createElement('button'));
          //           ref!.appendChild(this.props.children);
        }}
      ></div>
    );
  }
}
