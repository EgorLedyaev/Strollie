import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface ShareIconProps extends SvgProps {
	color?: string;
}

const ShareIcon: React.FC<ShareIconProps> = ({
	color = '#626262',
	...props
}) => (
	<Svg width={20} height={20} viewBox='0 0 20 20' fill='none' {...props}>
		<Path
			d='M12.5 5.25L17 1.75'
			stroke={color}
			strokeWidth={1.6}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M17 1.75V7M17 1.75H11.75'
			stroke={color}
			strokeWidth={1.6}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
		<Path
			d='M9 4H6.5A3.5 3.5 0 0 0 3 7.5v7A3.5 3.5 0 0 0 6.5 18h7a3.5 3.5 0 0 0 3.5-3.5V12'
			stroke={color}
			strokeWidth={1.6}
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</Svg>
);

export default ShareIcon;
