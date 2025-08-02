import * as React from 'react';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';

const NotificationIcon = (props: SvgProps) => (
	<Svg
		width={40}
		height={40}
		fill='none'
		{...props}
	>
		<Rect width={40} height={40} fill='#F4F4F4' rx={16} />
		<Path
			fill='#626262'
			d='M27.201 24.599c.033.036.799.906.799 2.168a.234.234 0 0 1-.235.233h-15.53a.234.234 0 0 1-.235-.233c0-1.262.766-2.132.799-2.168a.235.235 0 0 1 .074-.056c1.37-.651 1.654-3.42 1.828-6.201.308-3.152 2.958-4.273 3.952-4.396C18.82 13.55 19.245 13 20 13s1.18.551 1.346.945c.994.124 3.645 1.244 3.952 4.389.175 2.788.46 5.558 1.829 6.209a.231.231 0 0 1 .074.056Z'
		/>
	</Svg>
);
export default NotificationIcon;
