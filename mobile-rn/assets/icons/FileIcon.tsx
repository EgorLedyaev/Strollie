import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface Props extends SvgProps {
	size?: number;
	color?: string;
}

const FileIcon = ({ size = 24, color = '#B9B9B9', ...props }: Props) => (
	<Svg width={size} height={size} fill='none' viewBox='0 0 24 24' {...props}>
		<Path
			fill={color}
			d='M6 22c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 4 20V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 6 2h8l6 6v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18 22H6Zm7-13V4H6v16h12V9h-5Z'
		/>
	</Svg>
);
export default FileIcon;
