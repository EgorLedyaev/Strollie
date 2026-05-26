import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const DeleteIcon = (props: SvgProps) => (
	<Svg width={10} height={10} fill='none' {...props}>
		<Path
			stroke='#AAA'
			strokeLinecap='round'
			strokeWidth={2}
			d='m1 1 8 8m0-8L1 9'
		/>
	</Svg>
);
export default DeleteIcon;
