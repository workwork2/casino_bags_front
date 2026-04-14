'use client';

import clsx from 'clsx';
import styles from './Button.module.scss';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	loading?: boolean;
	fullWidth?: boolean;
	variant?: 'primary' | 'ghost';
};

export function Button({
	type = 'button',
	loading,
	fullWidth,
	variant = 'primary',
	className,
	disabled,
	children,
	...rest
}: ButtonProps) {
	return (
		<button
			type={type}
			className={clsx(
				styles.btn,
				fullWidth && styles.fullWidth,
				variant === 'ghost' && styles.ghost,
				className,
			)}
			disabled={disabled || loading}
			{...rest}
		>
			{loading ? <span className={styles.spinner} aria-hidden /> : null}
			<span className={loading ? styles.hiddenLabel : undefined}>{children}</span>
		</button>
	);
}
