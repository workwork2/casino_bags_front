'use client';

import { useAppDispatch } from '@/shared/lib/redux/hooks';
import { OpenChatTypeEnum, setOpenChatType } from '@/widgets/chat/model/slice';
import { FaComments, FaHeadset } from 'react-icons/fa';
import styles from './style.module.scss';

const ChatActions = () => {
	const appDispatch = useAppDispatch();

	return (
		<div className={styles.chatActions}>
			<button
				type='button'
				onClick={() => appDispatch(setOpenChatType(OpenChatTypeEnum.PUBLIC))}
				aria-label='Public chat'
			>
				<FaComments size={22} />
			</button>
			<button
				type='button'
				onClick={() => appDispatch(setOpenChatType(OpenChatTypeEnum.SUPPORT))}
				aria-label='Support chat'
			>
				<FaHeadset size={22} />
			</button>
		</div>
	);
};

export default ChatActions;
