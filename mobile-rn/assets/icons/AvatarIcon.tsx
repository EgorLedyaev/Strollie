import * as React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

const AvatarIcon = (props: SvgProps) => (
	<Svg width={24} height={24} fill='none' {...props}>
		<Circle cx={12} cy={6} r={6} fill='#626262' />
		<Path
			fill='#626262'
			d='M12 13.332c5.238 0 9.776 2.614 11.997 6.427C21.777 22.274 17.24 24 12 24S2.222 22.274.002 19.76c2.22-3.813 6.76-6.427 11.998-6.427Z'
		/>
	</Svg>
);
export default AvatarIcon;
