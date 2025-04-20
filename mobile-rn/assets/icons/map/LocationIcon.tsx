import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const LocationIcon = (props: SvgProps) => (
	<Svg width={24} height={24} fill='none' {...props}>
		<Path
			fill='#D9D9D9'
			stroke='#D9D9D9'
			strokeLinejoin='round'
			strokeWidth={6}
			d='m17.567 3.566-14 10.929h8.34l5.66 6.071v-17Z'
		/>
	</Svg>
);
export default LocationIcon;
