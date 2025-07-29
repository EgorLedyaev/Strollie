import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const BackIcon = (props: SvgProps) => (
	<Svg width={10} height={14} fill='none' {...props}>
		<Path
			stroke={props.stroke || '#AAA'}
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M9 1 1 7l8 6'
		/>
	</Svg>
);
export default BackIcon;
