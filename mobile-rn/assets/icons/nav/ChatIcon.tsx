import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

export function ChatIcon(props: SvgProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
        fill="#626262"
      />
    </Svg>
  );
}
