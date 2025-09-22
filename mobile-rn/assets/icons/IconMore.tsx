import * as React from 'react';
import Svg, { Rect, SvgProps } from 'react-native-svg';

const IconMore = (props: SvgProps) => (
	<Svg width={4} height={18} fill='none' {...props}>
		<Rect
			width={4}
			height={4}
			x={4}
			y={4}
			fill='#B9B9B9'
			rx={2}
			transform='rotate(180 4 4)'
		/>
		<Rect
			width={4}
			height={4}
			x={4}
			y={11}
			fill='#B9B9B9'
			rx={2}
			transform='rotate(180 4 11)'
		/>
		<Rect
			width={4}
			height={4}
			x={4}
			y={18}
			fill='#B9B9B9'
			rx={2}
			transform='rotate(180 4 18)'
		/>
	</Svg>
);
export default IconMore;
