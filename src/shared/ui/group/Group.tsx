'use client';

import clsx from 'clsx';

type GroupProps = React.HTMLAttributes<HTMLDivElement> & {
	gap?: number | string;
	justify?: 'start' | 'center' | 'end' | 'space-between';
};

export function Group({
	gap = 8,
	justify = 'start',
	className,
	style,
	...rest
}: GroupProps) {
	const justifyMap = {
		start: 'flex-start',
		center: 'center',
		end: 'flex-end',
		'space-between': 'space-between',
	};
	return (
		<div
			className={clsx(className)}
			style={{
				display: 'flex',
				flexDirection: 'row',
				flexWrap: 'wrap',
				alignItems: 'center',
				justifyContent: justifyMap[justify],
				gap: typeof gap === 'number' ? `${gap}px` : gap,
				...style,
			}}
			{...rest}
		/>
	);
}
