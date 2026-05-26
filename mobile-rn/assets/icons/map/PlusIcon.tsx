import * as React from 'react';
import Svg, { Rect, SvgProps } from 'react-native-svg';

/* SVGR has dropped some elements not supported by react-native-svg: filter */
const PlusIcon = (props: SvgProps) => (
	<Svg width={22} height={22} fill='none' {...props}>
		<Rect width={4} height={22} x={9} fill='#626262' rx={2} />
		<Rect
			width={4}
			height={22}
			y={13}
			fill='#626262'
			rx={2}
			transform='rotate(-90 0 13)'
		/>
	</Svg>
);
export default PlusIcon;
