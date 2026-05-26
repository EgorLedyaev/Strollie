import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowLeftLargeIcon = (props: SvgProps) => (
	<Svg width={9} height={14} fill='none' {...props}>
		<Path
			stroke={props.stroke || '#AAA'}
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={1.5}
			d='M8 1 1 7l7 6'
		/>
	</Svg>
);
export default ArrowLeftLargeIcon;
