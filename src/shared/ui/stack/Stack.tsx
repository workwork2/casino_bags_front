'use client';

import clsx from 'clsx';

type StackProps = React.HTMLAttributes<HTMLDivElement> & {
	gap?: number | string;
};

export function Stack({ gap = 8, className, style, ...rest }: StackProps) {
	return (
		<div
			className={clsx(className)}
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: typeof gap === 'number' ? `${gap}px` : gap,
				...style,
			}}
			{...rest}
		/>
	);
}
