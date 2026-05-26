import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const CinemaIcon: React.FC<{
	width?: number;
	height?: number;
	color?: string;
}> = ({ width = 54, height = 43, color = '#E8EAED' }) => (
	<Svg width={width} height={height} viewBox='0 0 54 43' fill='none'>
		<Path
			d='M5.4 0L10.8 10.75H18.9L13.5 0H18.9L24.3 10.75H32.4L27 0H32.4L37.8 10.75H45.9L40.5 0H48.6C50.085 0 51.3563 0.526302 52.4138 1.57891C53.4713 2.63151 54 3.89687 54 5.375V37.625C54 39.1031 53.4713 40.3685 52.4138 41.4211C51.3563 42.4737 50.085 43 48.6 43H5.4C3.915 43 2.64375 42.4737 1.58625 41.4211C0.52875 40.3685 0 39.1031 0 37.625V5.375C0 3.89687 0.52875 2.63151 1.58625 1.57891C2.64375 0.526302 3.915 0 5.4 0ZM5.4 16.125V37.625H48.6V16.125H5.4Z'
			fill={color}
		/>
	</Svg>
);

export default CinemaIcon;
