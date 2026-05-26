import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

type Props = SvgProps & {
	color?: string;
};
const CheckmarkIconSmall = ({ color = '#fff', ...props }: Props) => (
	<Svg width={8} height={8} fill='none' {...props}>
		<Path
			stroke={color}
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={1.5}
			d='m1 4 2.25 3L7 1'
		/>
	</Svg>
);
export default CheckmarkIconSmall;
