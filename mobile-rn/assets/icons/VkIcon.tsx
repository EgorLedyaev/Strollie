import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface Props extends SvgProps {
	color?: string;
}

const VkIcon = ({ color = '#111111', ...props }: Props) => (
	<Svg width={24} height={24} viewBox='0 0 24 24' fill='none' {...props}>
		<Path
			fill={color}
			d='M4 7h2.4l2.18 3.6L10.8 7h2.42l-3.36 5.08V17H7.44v-4.92L4 7Zm9 .02h2.4v3.04l3.06-3.04h2.94l-3.74 3.68L21.5 17h-2.86l-2.36-3.78-1.38 1.32V17H13v-9.98Z'
		/>
	</Svg>
);

export default VkIcon;
