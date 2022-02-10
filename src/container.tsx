import React from 'react';
import { State } from 'state';

export class Container extends React.Component {
  render() {
    return (
      <div
        ref={(ref) => {
          if (ref instanceof Element) {
            const FIRST_CHILD = ref!.firstChild;
            if (FIRST_CHILD instanceof Element) {
              ref!.removeChild(FIRST_CHILD);
            }
            ref!.appendChild(State.getElement());
          }
        }}
      ></div>
    );
  }
}
