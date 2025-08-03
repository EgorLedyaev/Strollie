import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowDownIcon = (props: SvgProps) => (
  <Svg
    width={15}
    height={8}
    viewBox="0 0 15 8"
    fill="none"
    {...props}
  >
    <Path
      d="M1 1l6.5 6L14 1"
      stroke={props.stroke || '#B3B3B3'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowDownIcon;
