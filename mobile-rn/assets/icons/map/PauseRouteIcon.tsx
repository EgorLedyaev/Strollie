import * as React from 'react';
import Svg, { Circle, Rect, SvgProps } from 'react-native-svg';

const PauseRouteIcon = (props: SvgProps) => (
  <Svg width={68} height={68} fill="none" viewBox="0 0 68 68" {...props}>
    <Circle cx={34} cy={34} r={34} fill="url(#gradient)" />
    <Rect x={24} y={23} width={7} height={22} rx={3} fill="#FFFFFF" />
    <Rect x={37} y={23} width={7} height={22} rx={3} fill="#FFFFFF" />
    <defs>
      <linearGradient id="gradient" x1="0" y1="0" x2="68" y2="68" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1BF57E" offset="0.166"/>
        <stop stopColor="#1CC4C4" offset="1"/>
      </linearGradient>
    </defs>
  </Svg>
);

export default PauseRouteIcon;
