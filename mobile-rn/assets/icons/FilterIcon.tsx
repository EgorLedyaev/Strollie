import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const FilterIcon = (props: SvgProps) => (
	<Svg width={14} height={14} fill='none' {...props}>
		<Path
			fill='#B9B9B9'
			d='M6.222 14V9.333h1.556v1.556H14v1.555H7.778V14H6.222ZM0 12.444V10.89h4.667v1.555H0Zm3.111-3.11V7.777H0V6.222h3.111V4.667h1.556v4.666H3.11Zm3.111-1.556V6.222H14v1.556H6.222Zm3.111-3.111V0h1.556v1.556H14V3.11h-3.111v1.556H9.333ZM0 3.11V1.556h7.778V3.11H0Z'
		/>
	</Svg>
);
export default FilterIcon;
