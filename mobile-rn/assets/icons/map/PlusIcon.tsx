import * as React from 'react';
import Svg, { Path, G, SvgProps } from 'react-native-svg';

const PlusIcon = (props: SvgProps) => (
    <Svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      {...props}
    >
      <Path d="M9 2a2 2 0 014 0v18a2 2 0 01-4 0V2z" fill="#626262" />
      <Path d="M2 13a2 2 0 110-4h18a2 2 0 010 4H2z" fill="#626262" />
    </Svg>
);
export default PlusIcon;
