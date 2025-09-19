import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ScanTicket = (props: SvgProps) => (
	<Svg width={20} height={18} fill='none' {...props}>
		<Path
			fill='#B9B9B9'
			d='M4.545 18c-.5 0-.928-.176-1.284-.529a1.725 1.725 0 0 1-.534-1.271v-2.7h1.818v2.7h10.91v-2.7h1.818v2.7c0 .495-.178.919-.534 1.271a1.76 1.76 0 0 1-1.285.529H4.545ZM2.727 8.1V1.8c0-.495.178-.919.534-1.271A1.76 1.76 0 0 1 4.545 0h7.273l5.455 5.4v2.7h-1.819V6.3H10.91V1.8H4.545v6.3H2.727ZM0 11.7V9.9h20v1.8H0Z'
		/>
	</Svg>
);
export default ScanTicket;
