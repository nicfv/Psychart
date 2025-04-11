import React from 'react';

export class Container extends React.PureComponent<{ readonly child: Element }> {
  public override render(): React.JSX.Element {
    return (
      <div
        ref={ref => {
          if (ref?.firstChild) {
            ref.removeChild(ref.firstChild);
          }
          ref?.appendChild(this.props.child);
        }}
      ></div>
    );
  }
}
