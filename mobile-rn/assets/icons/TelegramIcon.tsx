import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface Props extends SvgProps {
	color?: string;
}

const TelegramIcon = ({ color = '#111111', ...props }: Props) => (
	<Svg width={24} height={24} viewBox='0 0 24 24' fill='none' {...props}>
		<Path
			fill={color}
			d='m3.5 11.4 16.62-6.62c.45-.18.9.18.75.72l-2.8 10.52c-.12.46-.66.66-1.02.36l-3.7-3-1.78 2.18c-.2.26-.61.1-.61-.24v-3.12l7.29-5.95-9.1 4.8-4.28-1.26c-.55-.16-.57-.94 0-1.2Z'
		/>
	</Svg>
);

export default TelegramIcon;
