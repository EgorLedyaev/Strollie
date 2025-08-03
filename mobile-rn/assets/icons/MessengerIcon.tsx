import * as React from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';

const MessengerIcon = (props: SvgProps) => (
	<Svg
		width={40}
		height={40}
		fill='none'
		{...props}
	>
		<Rect width={40} height={40} fill='#F4F4F4' rx={16} />
		<Path
			fill='#626262'
			d='M20 10c-5.521 0-10 4.12-10 9.227 0 2.704 1.26 5.236 3.478 6.996V30l3.74-1.931c.912.256 1.826.342 2.782.342 5.521 0 10-4.12 10-9.227C30 14.12 25.521 10 20 10Zm1 12.275-2.522-2.662-4.696 2.618L19 16.781l2.566 2.532 4.565-2.532-5.13 5.494Z'
		/>
	</Svg>
);
export default MessengerIcon;
