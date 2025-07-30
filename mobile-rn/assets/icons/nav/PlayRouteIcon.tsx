import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

export function PlayRouteIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <Path 
        d="M8 5.14v14l11-7-11-7z" 
        fill="#fff" 
        stroke="#fff"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
