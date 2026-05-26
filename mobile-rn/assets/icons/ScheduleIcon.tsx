import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

const ScheduleIcon = (props: SvgProps) => (
	<Svg {...props} width={27} height={24} fill='none'>
		<Path
			fill='#626262'
			d='m8 15 4.336-10h2.312L19 15h-2.489l-.819-2.028h-4.528L10.344 15H8Zm5.428-7.586-1.606 3.945h3.212l-1.606-3.945Z'
		/>
		<Path
			fill='#626262'
			d='M2.667 24a2.568 2.568 0 0 1-1.884-.783A2.568 2.568 0 0 1 0 21.333V2.667C0 1.933.261 1.306.783.783A2.568 2.568 0 0 1 2.667 0H24c.733 0 1.361.261 1.883.783.523.523.784 1.15.784 1.884v18.666c0 .734-.261 1.361-.784 1.884A2.568 2.568 0 0 1 24 24H2.667Zm0-2.667H24V2.667H2.667v18.666Zm2.666-2.666h16V16h-16v2.667Z'
		/>
	</Svg>
);
export default ScheduleIcon;
