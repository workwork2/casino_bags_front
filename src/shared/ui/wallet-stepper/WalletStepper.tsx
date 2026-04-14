'use client';

import clsx from 'clsx';
import type { IconType } from 'react-icons';
import styles from './WalletStepper.module.scss';

export type WalletStepDef = {
	label: string;
	hint?: string;
	Icon: IconType;
};

type Props = {
	steps: WalletStepDef[];
	activeIndex: number;
};

export function WalletStepper({ steps, activeIndex }: Props) {
	return (
		<ol className={styles.stepper}>
			{steps.map((s, i) => {
				const Icon = s.Icon;
				const done = i < activeIndex;
				const active = i === activeIndex;
				return (
					<li
						key={s.label}
						className={clsx(
							styles.step,
							done && styles.done,
							active && styles.active,
						)}
					>
						<div className={styles.stepInner}>
							<span className={styles.stepNum}>
								{String(i + 1).padStart(2, '0')}
							</span>
							<span className={styles.iconWrap} aria-hidden>
								<Icon size={24} />
							</span>
							<div className={styles.stepTextCol}>
								<span className={styles.stepLabel}>{s.label}</span>
								{s.hint ? (
									<span className={styles.stepHint}>{s.hint}</span>
								) : null}
							</div>
						</div>
					</li>
				);
			})}
		</ol>
	);
}
