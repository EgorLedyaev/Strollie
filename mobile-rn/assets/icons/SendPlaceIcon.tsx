import Svg, { Path, SvgProps } from 'react-native-svg';

const SendPlaceIcon = (props: SvgProps) => (
	<Svg
		width={20}
		height={19}
		fill='none'
		{...props}
	>
		<Path
			fill='#1EB18C'
			d='M1 19a1 1 0 0 1-1-1v-4.429c0-1.877.65-3.477 1.95-4.8 1.3-1.324 2.872-1.985 4.717-1.985H14.9l-4.105-4.179A1 1 0 0 1 10.8 1.2l.486-.486a1 1 0 0 1 1.42.007l6.604 6.722a1 1 0 0 1 0 1.402l-6.604 6.722a1 1 0 0 1-1.42.006l-.486-.485a1 1 0 0 1-.006-1.408L14.9 9.5H6.667c-1.111 0-2.056.396-2.834 1.188-.777.791-1.166 1.752-1.166 2.883V18a1 1 0 0 1-1 1H1Z'
		/>
	</Svg>
);
export default SendPlaceIcon;
