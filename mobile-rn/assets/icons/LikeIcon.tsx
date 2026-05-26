import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';





type LikeIconVariant = 'small' | 'large';

interface Props extends SvgProps {
	color?: string;
	size?: number;
	variant?: LikeIconVariant;
}

const SMALL_VIEW_BOX = '0 0 32 32';
const LARGE_VIEW_BOX = '0 0 44 44';

const LikeIcon = ({ color = '#CBCBCB', size, variant, ...props }: Props) => {
	const resolvedVariant: LikeIconVariant = variant
		? variant
		: size && size >= 44
			? 'large'
			: 'small';

	const resolvedSize = size ?? (resolvedVariant === 'large' ? 44 : 32);

	if (resolvedVariant === 'large') {
		return (
			<Svg
				width={resolvedSize}
				height={resolvedSize}
				viewBox={LARGE_VIEW_BOX}
				fill='none'
				{...props}
			>
				<Path
					fill={color}
					d='m29.883 24.598-6.717 6.027c-.558.5-1.397.5-1.955 0l-6.718-6.027C7.76 18.57 16.145 9.72 22.188 16.807c5.25-7.53 13.81 1.824 7.695 7.79Z'
				/>
			</Svg>
		);
	}

	return (
		<Svg
			width={resolvedSize}
			height={resolvedSize}
			viewBox={SMALL_VIEW_BOX}
			fill='none'
			{...props}
		>
			<Path
				fill={color}
				d='M16 23 14.84 22.008c-1.346-1.157-2.46-2.155-3.34-2.995-.88-.84-1.58-1.593-2.1-2.26-.52-.668-.883-1.282-1.09-1.842C8.103 14.353 8 13.78 8 13.196c0-1.195.42-2.193 1.26-2.994C10.1 9.4 11.147 9 12.4 9c.693 0 1.353.14 1.98.42.627.28 1.167.674 1.62 1.182.453-.508.993-.902 1.62-1.182A4.804 4.804 0 0 1 19.6 9c1.253 0 2.3.4 3.14 1.202C23.58 11.003 24 12.001 24 13.196c0 .585-.103 1.157-.31 1.717-.207.56-.57 1.174-1.09 1.841-.52.668-1.22 1.421-2.1 2.26-.88.84-1.993 1.838-3.34 2.995L16 23Z'
			/>
		</Svg>
	);
};

export default LikeIcon;
