import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const FolderIcon = (props: SvgProps) => (
	<Svg width={24} height={24} fill='none' {...props}>
		<Path
			fill='#B9B9B9'
			d='M4 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 18V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 4 4h6l2 2h8c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412H11.175l-2-2H4v12l2.4-8h17.1l-2.575 8.575a1.95 1.95 0 0 1-.738 1.038A1.985 1.985 0 0 1 19 20H4Zm2.1-2H19l1.8-6H7.9l-1.8 6Z'
		/>
	</Svg>
);
export default FolderIcon;
