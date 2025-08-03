import * as React from 'react';
import Svg, { Rect, SvgProps } from 'react-native-svg';

const MinusIcon = (props: SvgProps) => (
     <Svg
      width={22}
      height={4}
      viewBox="0 0 22 4"
      fill="none"
      {...props}
    >
      <Rect
        y={4}
        width={4}
        height={22}
        rx={2}
        transform="rotate(-90 0 4)"
        fill="#626262"
      />
    </Svg>
);
export default MinusIcon;
