import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const LocationHeadingIcon = (props: SvgProps) => (
	<Svg width={30} height={27} fill='none' {...props}>
		<Path
			fill='#1BCD8F'
			stroke='#1BCD8F'
			strokeLinejoin='round'
			strokeWidth={5.018}
			d='m14.813 3.188-8.87 20.108 8.87-5.914 9.332 5.897-9.332-20.09Z'
		/>
		<Path
			fill='#1BF57E'
			stroke='#1BF57E'
			strokeLinejoin='round'
			strokeWidth={5.018}
			d='M14.785 3.215 5.618 23.618l8.72-5.763.447-14.64Z'
		/>
	</Svg>
);
export default LocationHeadingIcon;
