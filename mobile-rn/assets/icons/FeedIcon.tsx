import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const FeedIcon = (props: SvgProps) => (
	<Svg
		{...props}
		width={27}
		height={24}
		fill='none'
	>
		<Path
			fill='#626262'
			d='M2.667 24a2.568 2.568 0 0 1-1.884-.783A2.568 2.568 0 0 1 0 21.333V2.667C0 1.933.261 1.306.783.783A2.568 2.568 0 0 1 2.667 0H24c.733 0 1.361.261 1.883.783.523.523.784 1.15.784 1.884v18.666c0 .734-.261 1.361-.784 1.884A2.568 2.568 0 0 1 24 24H2.667Zm0-2.667H24V2.667H2.667v18.666Zm2.666-2.666h16V16h-16v2.667Zm0-5.334h5.334v-8H5.333v8Zm8 0h8v-2.666h-8v2.666Zm0-5.333h8V5.333h-8V8Z'
		/>
	</Svg>
);
export default FeedIcon;
