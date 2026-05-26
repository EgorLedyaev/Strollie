import * as React from 'react';
import Svg, { Ellipse, Path, SvgProps } from 'react-native-svg';

const GrayPointerIcon = (props: SvgProps) => (
	<Svg width={45} height={70} fill='none' {...props}>
		<Path
			fill='#A6A6A6'
			d='M0 20.588C0 30.471 14.318 57.648 22.5 70 29.318 57.647 45 30.47 45 20.588 45 8.235 36.818 0 22.5 0S0 8.235 0 20.588Z'
		/>
		<Ellipse cx={22.5} cy={22.581} fill='#D9D9D9' rx={11.25} ry={11.29} />
	</Svg>
);
export default GrayPointerIcon;
