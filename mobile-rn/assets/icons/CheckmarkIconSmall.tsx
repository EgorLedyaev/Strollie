import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const CheckmarkIconSmall = (props: SvgProps) => (
	<Svg width={12} height={12} fill='none' {...props}>
		<Path
			stroke='#fff'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={1.667}
			d='m1 6 3.75 5L11 1'
		/>
	</Svg>
);
export default CheckmarkIconSmall;
