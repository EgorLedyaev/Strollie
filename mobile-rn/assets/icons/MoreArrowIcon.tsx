import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const MoreArrowIcon = (props: SvgProps) => (
	<Svg width={10} height={14} fill='none' {...props}>
		<Path
			stroke='#AAA'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='m1 13 8-6-8-6'
		/>
	</Svg>
);
export default MoreArrowIcon;
