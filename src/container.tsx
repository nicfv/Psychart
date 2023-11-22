import React from 'react';

export default class Container extends React.Component<{ child: Element }> {
  render() {
    return (
      <div
        ref={(ref) => {
          const child = ref?.firstChild;
          if (child instanceof Element) {
            ref?.removeChild(child);
          }
          ref?.appendChild(this.props.child);
        }}
      ></div>
    );
  }
}
