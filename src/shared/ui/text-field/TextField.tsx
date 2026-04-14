'use client';

import clsx from 'clsx';
import { forwardRef } from 'react';

export type TextFieldProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'size'
> & {
	leftSection?: React.ReactNode;
	inputClassName?: string;
	sectionClassName?: string;
	wrapperClassName?: string;
	error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
	function TextField(
		{
			leftSection,
			inputClassName,
			sectionClassName,
			wrapperClassName,
			error,
			className,
			...rest
		},
		ref,
	) {
		return (
			<div className={clsx(wrapperClassName)}>
				<div
					className={clsx(className)}
					style={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
					}}
				>
					{leftSection ? (
						<span
							className={sectionClassName}
							style={{ flexShrink: 0, display: 'flex' }}
						>
							{leftSection}
						</span>
					) : null}
					<input ref={ref} className={inputClassName} {...rest} />
				</div>
				{error ? (
					<span style={{ color: '#fecaca', fontSize: 12, marginTop: 4 }}>
						{error}
					</span>
				) : null}
			</div>
		);
	},
);
