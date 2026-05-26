import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ArrowUpRightSmallIcon = (props: SvgProps) => (
	<Svg width={10} height={10} viewBox='0 0 10 10' fill='none' {...props}>
		<Path
			d='M9.5 1C9.5 0.723858 9.27614 0.5 9 0.5L4.5 0.5C4.22386 0.5 4 0.723858 4 1C4 1.27614 4.22386 1.5 4.5 1.5L8.5 1.5L8.5 5.5C8.5 5.77614 8.72386 6 9 6C9.27614 6 9.5 5.77614 9.5 5.5L9.5 1ZM1 9L1.35355 9.35355L9.35355 1.35355L9 1L8.64645 0.646447L0.646447 8.64645L1 9Z'
			fill='#A3A3A3'
		/>
	</Svg>
);

export default ArrowUpRightSmallIcon;
