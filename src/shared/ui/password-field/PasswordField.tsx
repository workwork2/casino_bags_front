'use client';

import clsx from 'clsx';
import { forwardRef, useState } from 'react';

export type PasswordFieldProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'size' | 'type'
> & {
	leftSection?: React.ReactNode;
	toggleClassName?: string;
	inputClassName?: string;
	sectionClassName?: string;
	wrapperClassName?: string;
	visibilityIcon: (open: boolean) => React.ReactNode;
	error?: string;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
	function PasswordField(
		{
			leftSection,
			toggleClassName,
			inputClassName,
			sectionClassName,
			wrapperClassName,
			visibilityIcon,
			error,
			className,
			...rest
		},
		ref,
	) {
		const [visible, setVisible] = useState(false);

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
					<input
						ref={ref}
						type={visible ? 'text' : 'password'}
						className={inputClassName}
						{...rest}
					/>
					<button
						type='button'
						className={toggleClassName}
						onClick={() => setVisible((v) => !v)}
						tabIndex={-1}
						aria-label={visible ? 'Hide password' : 'Show password'}
					>
						{visibilityIcon(visible)}
					</button>
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
