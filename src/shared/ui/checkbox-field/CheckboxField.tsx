'use client';

import clsx from 'clsx';
import { forwardRef } from 'react';

export type CheckboxFieldProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'type'
> & {
	label: React.ReactNode;
	rootClassName?: string;
	inputClassName?: string;
	labelClassName?: string;
};

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
	function CheckboxField(
		{ label, rootClassName, inputClassName, labelClassName, className, ...rest },
		ref,
	) {
		return (
			<label className={clsx(rootClassName, className)}>
				<input
					ref={ref}
					type='checkbox'
					className={inputClassName}
					{...rest}
				/>
				<span className={labelClassName}>{label}</span>
			</label>
		);
	},
);
