import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowLeftMediumIcon = (props: SvgProps) => (
	<Svg width={7} height={10} fill='none' {...props}>
		<Path
			stroke={props.stroke || '#AAA'}
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M6 1 1 5l5 4'
		/>
	</Svg>
);
export default ArrowLeftMediumIcon;
