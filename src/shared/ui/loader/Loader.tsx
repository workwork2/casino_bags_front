'use client';

import clsx from 'clsx';
import styles from './Loader.module.scss';

type LoaderProps = {
	size?: 'sm' | 'md' | 'lg';
	className?: string;
};

export function Loader({ size = 'md', className }: LoaderProps) {
	return (
		<span
			className={clsx(styles.root, styles[size], className)}
			role='status'
			aria-label='Loading'
		/>
	);
}
