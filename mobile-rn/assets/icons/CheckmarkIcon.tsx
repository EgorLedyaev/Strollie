import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const CheckmarkIcon = (props: SvgProps) => (
	<Svg width={22} height={22} fill='none' {...props}>
		<Path
			stroke='#fff'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={6}
			d='m3.2 11 5.85 7.8L18.8 3.2'
		/>
	</Svg>
);
export default CheckmarkIcon;
