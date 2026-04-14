'use client';

import styles from './style.module.scss';
import { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/shared/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import {
	confirmMessage,
	failMessage,
	getAllMessage,
	optimisticAddMessage,
	setMessage,
	setMessages,
	setOpenChatType,
} from '@/widgets/chat/model/slice';
import type { Message as ChatMessage } from '@/widgets/chat/model/slice';
import { IconSend, IconX } from '@tabler/icons-react';
import { FaUsers } from 'react-icons/fa';
import { Loader } from '@/shared/ui';
import {
	isChatDemoMode,
	chatDemoUserId,
	CHAT_DEMO_BOT_ID,
	createDemoMessage,
} from '@/shared/config/chatDemo';
import { nanoid } from 'nanoid';

interface PublicMsg {
	id: string;
	content: string;
	senderId: string;
	sender?: { name: string };
	createdAt: string;
	senderUserId?: string;
	senderUser?: { firstName?: string };
	tempId?: string;
	status?: string;
}

const PublicChat = () => {
	const messages = useAppSelector((state) => state.supportChat.messages);
	const [inputValue, setInputValue] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { socket, isConnected } = useSocket();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.user.user);
	const isAuthenticated = !!user?.id;
	const demoActive = isChatDemoMode;
	const canUseChat = demoActive || isAuthenticated;
	const effectiveUserId = chatDemoUserId(user?.id);
	const [chatId, setChatId] = useState<string | null>(null);

	useEffect(() => {
		if (!demoActive) return;
		dispatch(
			setMessages([
				createDemoMessage({
					content: 'Welcome to the public chat!',
					senderUserId: CHAT_DEMO_BOT_ID,
					chatId: 'demo-public',
				}),
			]),
		);
	}, [demoActive, dispatch]);

	useEffect(() => {
		if (demoActive) return;
		const fetchMessage = async () => {
			try {
				const messages = await getAllMessage(chatId);
				dispatch(setMessages(messages));
			} catch (err) {
				console.log(err);
			}
		};
		if (chatId) {
			fetchMessage();
		}
	}, [isConnected, chatId, demoActive, dispatch]);

	useEffect(() => {
		if (demoActive || !socket || !isAuthenticated) return;

		socket.emit(
			'joinPublicChat',
			{},
			(res: { success: boolean; data: { chatId: string } }) => {
				setChatId(res.data.chatId);
			},
		);

		socket.on('chatMigrated', ({ chatId: newChatId }: { chatId: string }) => {
			setChatId(newChatId);
		});

		socket.on('publicMessage', (msg) => {
			dispatch(setMessage(msg));
		});

		socket.on('publicMessage:confirm', (msg) => {
			dispatch(confirmMessage({ tempId: msg.tempId, serverMessage: msg }));
		});

		return () => {
			socket.off('publicMessage');
			socket.off('publicMessage:confirm');
			socket.off('chatMigrated');
		};
	}, [socket, isAuthenticated, dispatch, demoActive]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSendMessage = () => {
		if (!inputValue.trim() || !canUseChat) return;

		if (demoActive) {
			const text = inputValue.trim();
			const action = dispatch(
				optimisticAddMessage(text, 'public', effectiveUserId),
			);
			const tempId = action.payload.tempId!;
			setInputValue('');
			window.setTimeout(() => {
				dispatch(
					confirmMessage({
						tempId,
						serverMessage: {
							...(action.payload as ChatMessage),
							id: nanoid(),
							status: undefined,
							chatId: 'demo-public',
						},
					}),
				);
			}, 200);
			window.setTimeout(() => {
				dispatch(
					setMessage(
						createDemoMessage({
							content: `Echo (demo): ${text.slice(0, 160)}`,
							senderUserId: CHAT_DEMO_BOT_ID,
							chatId: 'demo-public',
						}),
					),
				);
			}, 500);
			return;
		}

		if (!socket || !isAuthenticated || !user?.id) return;

		const action = dispatch(
			optimisticAddMessage(inputValue, 'public', user.id),
		);
		const tempId = action.payload.tempId;

		socket.emit(
			'sendPublicMessage',
			{ content: inputValue, tempId, chatId },
			(response: { success: boolean; data?: PublicMsg }) => {
				if (response.success) {
					dispatch(
						confirmMessage({
							tempId,
							serverMessage: response.data! as ChatMessage,
						}),
					);
				} else {
					dispatch(failMessage({ tempId }));
				}
			},
		);
		setInputValue('');
	};

	const closeChat = () => dispatch(setOpenChatType(null));

	const CloseButton = () => (
		<button
			type='button'
			className={styles.closeButton}
			onClick={closeChat}
			aria-label='Close'
		>
			<IconX size={22} stroke={2} />
		</button>
	);

	const showConnecting = !demoActive && !isConnected;

	if (!canUseChat) {
		return (
			<div className={styles.publicChat}>
				<div className={styles.authHeaderBar}>
					<CloseButton />
				</div>
				<div className={styles.connectingBox}>
					<span className={styles.publicChatAuthPrompt}>
						Please log in to join the public chat.
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.publicChat}>
			<div className={styles.publicChatHeader}>
				<div className={styles.headerLeft}>
					<div className={styles.headerIconWrap} aria-hidden>
						<FaUsers size={22} />
					</div>
					<div>
						<h2 className={styles.publicChatUserName}>Public chat</h2>
						<span className={styles.statusText}>
							{demoActive || isConnected ? (
								<span className={styles.statusOnline}>● Online</span>
							) : (
								<span className={styles.statusPending}>Connecting…</span>
							)}
						</span>
					</div>
				</div>

				<div className={styles.headerRight}>
					<CloseButton />
				</div>
			</div>

			<div className={styles.publicChatMessages}>
				{showConnecting ? (
					<div className={styles.connectingBox}>
						<Loader size='sm' />
						<span className={styles.connectingText}>Connecting…</span>
					</div>
				) : messages.length === 0 ? (
					<div className={styles.emptyBox}>
						<span className={styles.emptyText}>
							No messages yet.
							<br />
							Be the first to say hello!
						</span>
					</div>
				) : (
					messages.map((msg: PublicMsg & { tempId?: string; status?: string }) => {
						const isMe = msg.senderUserId === effectiveUserId;
						return (
							<div
								key={msg.id || msg.tempId}
								className={`${styles.publicChatMessage} ${
									isMe ? styles.publicChatMessageUser : ''
								}`}
								data-pending={msg.status === 'pending'}
							>
								{!isMe && (
									<div className={styles.avatarPlaceholder}>
										{msg.senderUser?.firstName?.[0] || 'D'}
									</div>
								)}

								<div>
									{!isMe && (
										<span className={styles.publicChatMessageSender}>
											{msg.senderUser?.firstName || 'Demo'}
										</span>
									)}
									<div
										className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleOther}`}
									>
										<span className={styles.publicChatMessageContent}>
											{msg.content}
										</span>
										{msg.status === 'failed' && (
											<span className={styles.messageFailed}>Failed</span>
										)}
									</div>
									<span className={styles.timeStr}>
										{new Date(msg.createdAt || Date.now()).toLocaleTimeString(
											[],
											{ hour: '2-digit', minute: '2-digit' },
										)}
									</span>
								</div>
							</div>
						);
					})
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className={styles.publicChatInputContainer}>
				<div className={styles.publicChatInputWrapper}>
					<input
						className={styles.publicChatInput}
						placeholder='Type a message…'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleSendMessage();
						}}
					/>
					<button
						type='button'
						className={styles.publicChatSendButton}
						onClick={handleSendMessage}
						disabled={!inputValue.trim()}
						aria-label='Send'
					>
						<IconSend size={18} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default PublicChat;
