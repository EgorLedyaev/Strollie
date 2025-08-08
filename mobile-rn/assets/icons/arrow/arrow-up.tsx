import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowUpIcon = (props: SvgProps) => (
  <Svg
    width={15}
    height={8}
    viewBox="0 0 15 8"
    fill="none"
    {...props}
  >
    <Path
      d="M14 7L7.5 1 1 7"
      stroke={props.stroke || '#B3B3B3'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default ArrowUpIcon;
