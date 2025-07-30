import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const LocationIcon = (props: SvgProps) => (
<Svg
      width={27}
      height={27}
      viewBox="0 0 27 27"
      fill="none"
      {...props}
    >
      <Path
        d="M23.821 3.218l-20.49 7.946 10.454 2.09 2.428 10.77 7.608-20.806z"
        fill="#747474"
        stroke="#747474"
        strokeWidth={5.01818}
        strokeLinejoin="round"
      />
      <Path
        d="M23.782 3.218l-20.91 7.946 10.242 2.09L23.782 3.219z"
        fill="#ABABAB"
        stroke="#ABABAB"
        strokeWidth={5.01818}
        strokeLinejoin="round"
      />
    </Svg>
);
export default LocationIcon;
