import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const StarIcon = (props: SvgProps) => (
	<Svg width={12} height={11} fill='none' {...props}>
		<Path
			fill='#fff'
			d='M2.901 10.647a.3.3 0 0 1-.442-.329l.811-3.385L.56 4.666a.3.3 0 0 1 .167-.53l3.593-.3L5.725.627a.3.3 0 0 1 .55 0L7.68 3.836l3.593.3a.3.3 0 0 1 .167.53L8.73 6.933l.811 3.385a.3.3 0 0 1-.442.33L6 8.842l-3.099 1.804Z'
		/>
	</Svg>
);
export default StarIcon;
