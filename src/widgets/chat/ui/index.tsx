'use client';

import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import { RootState } from '@/shared/lib/redux/store';
import { OpenChatTypeEnum } from '../model/slice';
import {
	makeSelectIsOpenChatType,
	selectIsOpenChatTypeNull,
} from '../model/support-chat-selectors';
import ChatActions from './chat-actions/ui';
import styles from './chat.module.scss';
import SupportChat from './support-chat/ui';
import PublicChat from './public-chat/ui';
import { useMemo } from 'react';

const Chat = () => {
	const isNull = useAppSelector(selectIsOpenChatTypeNull);

	// Memoize the selector factories
	const makeIsPublicOpen = useMemo(() => makeSelectIsOpenChatType(), []);
	const makeIsSupportOpen = useMemo(() => makeSelectIsOpenChatType(), []);

	// Use the selectors correctly with state and type
	const isPublicOpen = useAppSelector((state: RootState) =>
		makeIsPublicOpen(state, OpenChatTypeEnum.PUBLIC),
	);
	const isSupportOpen = useAppSelector((state: RootState) =>
		makeIsSupportOpen(state, OpenChatTypeEnum.SUPPORT),
	);

	if (isNull) {
		return (
			<div className={styles.chat}>
				<ChatActions />
			</div>
		);
	}

	return (
		<div className={styles.chat}>
			{isPublicOpen && <PublicChat />}
			{isSupportOpen && <SupportChat />}
			{!isPublicOpen && !isSupportOpen && <ChatActions />}
		</div>
	);
};

export default Chat;
