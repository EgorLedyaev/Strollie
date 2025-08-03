import * as React from 'react';
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop, SvgProps } from 'react-native-svg';





/* SVGR has dropped some elements not supported by react-native-svg: filter */
const StartRouteIcon = (props: SvgProps) => (
	<Svg
		width={84}
		height={78}
		fill='none'
		{...props}
	>
		<G filter='url(#a)'>
			<Circle cx={42} cy={34} r={34} fill='url(#b)' />
			<Circle cx={42} cy={34} r={34} fill='url(#c)' />
			<Circle cx={42} cy={34} r={34} fill='url(#d)' />
		</G>
		<Path
			fill='#fff'
			fillRule='evenodd'
			d='M41.977 24.733C38.432 22.706 34 25.239 34 29.29v8.417c0 4.052 4.432 6.585 7.977 4.558l7.364-4.208c3.545-2.026 3.545-7.091 0-9.117l-7.364-4.208Z'
			clipRule='evenodd'
		/>
		<Defs>
			<LinearGradient
				id='b'
				x1={42}
				x2={42}
				y1={0}
				y2={68}
				gradientUnits='userSpaceOnUse'
			>
				<Stop stopColor='#1BF57E' />
				<Stop offset={1} stopColor='#12DFBA' />
			</LinearGradient>
			<LinearGradient
				id='c'
				x1={42}
				x2={42}
				y1={0}
				y2={68}
				gradientUnits='userSpaceOnUse'
			>
				<Stop stopColor='#2EDB7E' />
				<Stop offset={1} stopColor='#1CC4A7' />
			</LinearGradient>
			<LinearGradient
				id='d'
				x1={8}
				x2={76}
				y1={0}
				y2={68}
				gradientUnits='userSpaceOnUse'
			>
				<Stop offset={0.166} stopColor='#1BF57E' />
				<Stop offset={1} stopColor='#1CC4C4' />
			</LinearGradient>
		</Defs>
	</Svg>
);
export default StartRouteIcon;