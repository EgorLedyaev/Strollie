import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

const AvatarIcon = (props: SvgProps) => (
	<Svg width={24} height={24} fill='none' {...props}>
		<Circle cx={12} cy={6} r={6} fill='#CECECE' />
		<Path
			fill='#CECECE'
			fillRule='evenodd'
			d='M0 19.762c2.22-3.816 6.76-6.43 12-6.43s9.78 2.614 12 6.43C21.78 22.276 17.24 24 12 24s-9.78-1.724-12-4.238Z'
			clipRule='evenodd'
		/>
	</Svg>
);
export default AvatarIcon;
