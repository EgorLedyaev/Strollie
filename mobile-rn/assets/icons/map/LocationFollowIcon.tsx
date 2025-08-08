import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

// Follow (center on user) state — green variant
const LocationFollowIcon = (props: SvgProps) => (
	<Svg width={27} height={27} viewBox='0 0 27 27' fill='none' {...props}>
		<Path
			fill='#1BCD8F'
			stroke='#1BCD8F'
			strokeLinejoin='round'
			strokeWidth={5.018}
			d='m23.821 3.218-20.49 7.945 10.454 2.091 2.428 10.769 7.608-20.805Z'
		/>
		<Path
			fill='#1BF57E'
			stroke='#1BF57E'
			strokeLinejoin='round'
			strokeWidth={5.018}
			d='M23.782 3.218 2.873 11.163l10.241 2.091L23.782 3.218Z'
		/>
	</Svg>
);
export default LocationFollowIcon;
