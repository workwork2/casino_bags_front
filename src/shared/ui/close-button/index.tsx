'use client';
import Image from 'next/image';
import { Button } from '@/shared/ui/button/Button';
import styles from './styles.module.scss';

interface CloseButtonProps {
	onClick?: () => void;
}

const CloseButton = (props: CloseButtonProps) => {
	const { onClick } = props;

	return (
		<Button
			type='button'
			variant='ghost'
			onClick={onClick}
			className={styles.closeButton}
		>
			<Image
				src={'/assets/icons/close.svg'}
				alt='users in support chat'
				width={28}
				height={28}
			/>
		</Button>
	);
};

export default CloseButton;
