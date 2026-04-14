'use client';

import clsx from 'clsx';
import styles from './SegmentedTabs.module.scss';

export type SegmentedTabOption = { value: string; label: string };

type SegmentedTabsProps = {
	value: string;
	onChange: (value: string) => void;
	options: SegmentedTabOption[];
	classNames?: {
		root?: string;
		tab?: string;
		tabActive?: string;
	};
};

export function SegmentedTabs({
	value,
	onChange,
	options,
	classNames,
}: SegmentedTabsProps) {
	return (
		<div
			className={clsx(styles.root, classNames?.root)}
			role='tablist'
			aria-label='Auth mode'
		>
			{options.map((opt) => {
				const active = value === opt.value;
				return (
					<button
						key={opt.value}
						type='button'
						role='tab'
						aria-selected={active}
						className={clsx(
							styles.tab,
							classNames?.tab,
							active && styles.tabActive,
							active && classNames?.tabActive,
						)}
						onClick={() => onChange(opt.value)}
					>
						{opt.label}
					</button>
				);
			})}
		</div>
	);
}
