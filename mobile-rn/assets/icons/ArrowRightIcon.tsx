import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowRightIcon = (props: SvgProps) => (
	<Svg width={23} height={16} fill='none' {...props}>
		<Path
			fill='#45CD86'
			d='M22.707 8.707a1 1 0 0 0 0-1.414L16.343.929a1 1 0 1 0-1.414 1.414L20.586 8l-5.657 5.657a1 1 0 0 0 1.414 1.414l6.364-6.364ZM0 8v1h22V7H0v1Z'
		/>
	</Svg>
);
export default ArrowRightIcon;
