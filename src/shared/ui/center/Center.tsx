'use client';

import clsx from 'clsx';

type CenterProps = React.HTMLAttributes<HTMLDivElement> & {
	inline?: boolean;
};

export function Center({
	className,
	style,
	children,
	inline,
	...rest
}: CenterProps) {
	return (
		<div
			className={clsx(className)}
			style={{
				display: inline ? 'inline-flex' : 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: inline ? undefined : '100vh',
				width: inline ? undefined : '100%',
				...style,
			}}
			{...rest}
		>
			{children}
		</div>
	);
}
