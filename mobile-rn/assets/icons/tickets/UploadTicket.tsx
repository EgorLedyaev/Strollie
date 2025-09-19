import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const UploadTicket = (props: SvgProps) => (
	<Svg width={20} height={20} fill='none' {...props}>
		<Path
			fill='#B9B9B9'
			d='M9.125 16.3h1.75v-3.758l1.4 1.44L13.5 12.7 10 9.1l-3.5 3.6 1.247 1.26 1.378-1.418V16.3ZM4.75 19c-.481 0-.893-.176-1.236-.529A1.758 1.758 0 0 1 3 17.2V2.8c0-.495.171-.919.514-1.271A1.662 1.662 0 0 1 4.75 1h7L17 6.4v10.8c0 .495-.171.919-.514 1.271A1.662 1.662 0 0 1 15.25 19H4.75Zm6.125-11.7V2.8H4.75v14.4h10.5V7.3h-4.375Z'
		/>
	</Svg>
);
export default UploadTicket;
