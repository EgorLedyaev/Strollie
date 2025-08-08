import * as React from 'react';
import Svg, { Rect, SvgProps } from 'react-native-svg';

const ActionIcon = (props: SvgProps) => (
	<Svg width={19} height={4} fill='none' {...props}>
		<Rect width={4} height={4} fill='#B1B1B1' rx={2} />
		<Rect width={4} height={4} x={14} fill='#B1B1B1' rx={2} />
		<Rect width={4} height={4} x={7} fill='#B1B1B1' rx={2} />
	</Svg>
);
export default ActionIcon;
