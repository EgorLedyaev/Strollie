import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const PlusIcon = (props: SvgProps) => (
	<Svg width={14} height={14} viewBox='0 0 14 14' fill='none' {...props}>
		<Path
			d='M7 1V13M13 7H1'
			stroke='#AAAAAA'
			strokeWidth={2}
			strokeLinecap='round'
		/>
	</Svg>
);

export default PlusIcon;
