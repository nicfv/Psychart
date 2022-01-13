import React from 'react';
import { PanelProps } from '@grafana/data';
//import { useTheme } from '@grafana/ui';
import { PsyOptions } from 'types';
//import { State } from 'state';
// import { Dynamic } from 'Dynamic';
// import ReactDOM from 'react-dom';
//import { VanillaChildren } from 'VanillaChildren';

interface Props extends PanelProps<PsyOptions> {}

export const PsyPanel: React.FC<Props> = ({ options, data, width, height }) => {
  //const theme = useTheme();
  //   const NS = 'http://www.w3.org/2000/svg';
  //State.setSize(width, height);
  //State.initPsyChart(options.unitSystem, options.dbMin, options.dbMax, options.dpMax, theme.isLight);

  const b = document.createElement('button');
  b.innerText = 'Click me';
  b.onclick = () => alert('You clicked me!');
  b.addEventListener(
    'click',
    () => {
      alert('Maybe this will work.');
    },
    false
  );
  b.addEventListener(
    'click',
    () => {
      alert('Or maybe this will work.');
    },
    true
  );
  return <div dangerouslySetInnerHTML={{ __html: b.outerHTML }}></div>;

  //return <VanillaChildren>{State.getElement()}</VanillaChildren>;

  //   const dynamic = new Dynamic({});
  //
  //   function mouseEnter(e: any) {
  //     e.target.style.fill = 'blue';
  //     dynamic.setState({ text: 'entered!' });
  //   }
  //
  //   function mouseLeave(e: any) {
  //     e.target.style.fill = 'red';
  //     dynamic.setState({ text: 'left.' });
  //   }
  //
  //   const p = document.createElement('p');
  //   p.innerText = 'hello world!';
  //   p.onclick = () => alert('you clicked me!');

  //   return <div dangerouslySetInnerHTML={{ __html: p.outerHTML }}></div>;

  //   return (
  //     <svg
  //       width={width}
  //       height={height}
  //       xmlns="http://www.w3.org/2000/svg"
  //       xmlnsXlink="http://www.w3.org/1999/xlink"
  //       viewBox={`0 0 ${width} ${height - 30}`}
  //     >
  //       <g>
  //         <circle r="30" cx="50" cy="50" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} />
  //         <text x="50" y="60" fill="white">
  //           {JSON.stringify(dynamic)}
  //         </text>
  //       </g>
  //     </svg>
  //   );
};
