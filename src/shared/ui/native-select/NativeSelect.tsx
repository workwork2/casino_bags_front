'use client';

import clsx from 'clsx';
import { forwardRef } from 'react';

export type NativeSelectOption = { value: string; label: string };

export type NativeSelectProps = Omit<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	'size'
> & {
	label?: string;
	options: NativeSelectOption[];
	labelClassName?: string;
	selectClassName?: string;
	wrapperClassName?: string;
	leftSection?: React.ReactNode;
	sectionClassName?: string;
	rowClassName?: string;
};

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
	function NativeSelect(
		{
			label,
			options,
			labelClassName,
			selectClassName,
			wrapperClassName,
			leftSection,
			sectionClassName,
			rowClassName,
			className,
			...rest
		},
		ref,
	) {
		return (
			<div className={clsx(wrapperClassName)}>
				{label ? (
					<label className={labelClassName} htmlFor={rest.id}>
						{label}
					</label>
				) : null}
				<div
					className={clsx(rowClassName, className)}
					style={{
						display: 'flex',
						alignItems: 'center',
						width: '100%',
					}}
				>
					{leftSection ? (
						<span className={sectionClassName} style={{ flexShrink: 0 }}>
							{leftSection}
						</span>
					) : null}
					<select ref={ref} className={selectClassName} {...rest}>
						{options.map((o) => (
							<option key={o.value} value={o.value}>
								{o.label}
							</option>
						))}
					</select>
				</div>
			</div>
		);
	},
);
