import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface Props extends SvgProps {
	color?: string;
}

const LikeIcon = ({ color = '#CBCBCB', ...props }: Props) => (
	<Svg width={16} height={14} fill='none' {...props}>
		<Path
			fill={color}
			d='m8 14-1.16-.992a88.863 88.863 0 0 1-3.34-2.994c-.88-.84-1.58-1.593-2.1-2.26C.88 7.085.517 6.471.31 5.912A4.918 4.918 0 0 1 0 4.196c0-1.195.42-2.193 1.26-2.994C2.1.4 3.147 0 4.4 0c.693 0 1.353.14 1.98.42.627.28 1.167.674 1.62 1.182A4.725 4.725 0 0 1 9.62.42 4.804 4.804 0 0 1 11.6 0c1.253 0 2.3.4 3.14 1.202C15.58 2.002 16 3 16 4.196c0 .585-.103 1.157-.31 1.717-.207.56-.57 1.173-1.09 1.84-.52.668-1.22 1.421-2.1 2.26-.88.84-1.993 1.838-3.34 2.995L8 14Z'
		/>
	</Svg>
);
export default LikeIcon;
