'use client';

import {
	getSupportMessages,
	setMessage,
	setMessages,
	setOpenChatType,
} from '@/widgets/chat/model/slice';
import {
	useState,
	useEffect,
	useRef,
	useCallback,
	type MouseEvent,
} from 'react';
import {
	IconSend,
	IconX,
	IconHelpCircle,
	IconPlus,
	IconPhoto,
	IconChevronLeft,
} from '@tabler/icons-react';
import { FaHeadset } from 'react-icons/fa';

import styles from './style.module.scss';
import { useSocket } from '@/shared/hooks/useSocket';
import { useAppDispatch, useAppSelector } from '@/shared/lib/redux/hooks';
import { Loader } from '@/shared/ui';
import {
	compressImageToDataUrl,
	isDataImageContent,
} from '@/shared/lib/image/compressImageToDataUrl';
import type { Message } from '@/widgets/chat/model/slice';
import {
	isChatDemoMode,
	chatDemoUserId,
	CHAT_DEMO_BOT_ID,
	createDemoMessage,
} from '@/shared/config/chatDemo';
import {
	saveSupportSession,
	setActiveSupportChatId,
	getActiveSupportChatId,
	loadSupportSessions,
	removeSupportSession,
	formatSessionUpdatedAt,
	type SupportSession,
} from '@/widgets/chat/lib/supportSessions';

type SupportScreen = 'list' | 'thread';

const faqQuestions = [
	{
		question: 'Reset password?',
		autoResponse:
			'To reset your password, go to the login page and click "Forgot Password".',
	},
	{
		question: 'Refund policy?',
		autoResponse: 'We offer full refunds within 30 days of purchase.',
	},
	{
		question: 'Contact billing?',
		autoResponse: 'For billing issues, email billing@yourapp.com.',
	},
];

const DEMO_SUPPORT_CHAT = 'demo-support';

const SupportChat = () => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.user);
	const { socket, isConnected } = useSocket();
	const demoActive = isChatDemoMode;
	const effectiveConnected = demoActive || isConnected;
	const effectiveUserId = chatDemoUserId(user?.id);

	const [chatId, setChatId] = useState<string | null>(null);
	const [screen, setScreen] = useState<SupportScreen>('thread');
	const [sessions, setSessions] = useState<SupportSession[]>([]);
	const { messages } = useAppSelector((state) => state.supportChat);
	const [inputValue, setInputValue] = useState('');
	const [imageSending, setImageSending] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		if (demoActive) {
			setChatId(DEMO_SUPPORT_CHAT);
		}
	}, [demoActive]);

	useEffect(() => {
		const list = loadSupportSessions();
		setSessions(list);
		setScreen(list.length > 0 ? 'list' : 'thread');
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const upsertSessionFromMessages = useCallback(
		(id: string, list: Message[]) => {
			const last = list[list.length - 1];
			const preview = last
				? isDataImageContent(last.content)
					? 'Photo'
					: last.content.slice(0, 80)
				: undefined;
			saveSupportSession({
				id,
				label: `Support · ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
				updatedAt: Date.now(),
				preview,
			});
			setSessions(loadSupportSessions());
		},
		[],
	);

	useEffect(() => {
		if (chatId && messages.length) {
			upsertSessionFromMessages(chatId, messages);
		}
	}, [chatId, messages, upsertSessionFromMessages]);

	const handleSendMessage = (textOverride?: string) => {
		const text = textOverride || inputValue;
		if (!text.trim()) return;

		if (demoActive) {
			dispatch(
				setMessage(
					createDemoMessage({
						content: text,
						senderUserId: effectiveUserId,
						chatId: DEMO_SUPPORT_CHAT,
					}),
				),
			);
			if (!textOverride) setInputValue('');
			window.setTimeout(() => {
				dispatch(
					setMessage(
						createDemoMessage({
							content:
								'Thanks! This is a demo reply — connect the backend for real support.',
							senderUserId: CHAT_DEMO_BOT_ID,
							chatId: DEMO_SUPPORT_CHAT,
						}),
					),
				);
			}, 450);
			return;
		}

		if (!socket) return;

		socket.emit('sendSupportMessage', {
			chatId,
			content: text,
			senderType: user?.roles?.[0] || 'guest',
			tempId: '',
		});

		if (!textOverride) setInputValue('');
	};

	const handleFaqClick = (faq: (typeof faqQuestions)[0]) => {
		if (demoActive) {
			dispatch(
				setMessage(
					createDemoMessage({
						content: faq.question,
						senderUserId: effectiveUserId,
						chatId: DEMO_SUPPORT_CHAT,
					}),
				),
			);
			window.setTimeout(() => {
				dispatch(
					setMessage(
						createDemoMessage({
							content: faq.autoResponse,
							senderUserId: CHAT_DEMO_BOT_ID,
							chatId: DEMO_SUPPORT_CHAT,
						}),
					),
				);
			}, 400);
			return;
		}
		handleSendMessage(faq.question);
	};

	const sendImage = async (file: File) => {
		if (!effectiveConnected) return;
		setImageSending(true);
		try {
			const dataUrl = await compressImageToDataUrl(file);
			if (demoActive) {
				dispatch(
					setMessage(
						createDemoMessage({
							content: dataUrl,
							senderUserId: effectiveUserId,
							chatId: DEMO_SUPPORT_CHAT,
							type: 'image',
						}),
					),
				);
				window.setTimeout(() => {
					dispatch(
						setMessage(
							createDemoMessage({
								content: 'We received your image (demo).',
								senderUserId: CHAT_DEMO_BOT_ID,
								chatId: DEMO_SUPPORT_CHAT,
							}),
						),
					);
				}, 400);
			} else if (socket) {
				socket.emit('sendSupportMessage', {
					chatId,
					content: dataUrl,
					senderType: user?.roles?.[0] || 'guest',
					tempId: '',
				});
			}
		} catch (e) {
			console.error(e);
		} finally {
			setImageSending(false);
			if (fileInputRef.current) fileInputRef.current.value = '';
		}
	};

	useEffect(() => {
		if (demoActive) return;
		if (!socket) return;

		const handleMessage = (message: Message) => {
			dispatch(setMessage(message));
		};

		const handleChatId = (id: string) => {
			setChatId(id);
			setActiveSupportChatId(id);
		};

		socket.on('supportMessage', handleMessage);
		socket.on('supportChatId', handleChatId);

		const stored = getActiveSupportChatId();
		if (stored && stored !== DEMO_SUPPORT_CHAT) {
			setChatId(stored);
			socket.emit('joinSupportChat', { chatId: stored });
		}

		return () => {
			socket.off('supportMessage', handleMessage);
			socket.off('supportChatId', handleChatId);
		};
	}, [isConnected, socket, dispatch, demoActive]);

	useEffect(() => {
		if (demoActive) return;
		const fetchSupportMessages = async () => {
			if (chatId && chatId !== DEMO_SUPPORT_CHAT) {
				try {
					const res = await getSupportMessages(chatId);
					dispatch(setMessages(res));
				} catch (e) {
					console.error(e);
				}
			}
		};
		fetchSupportMessages();
	}, [chatId, isConnected, dispatch, demoActive]);

	const openNewChat = () => {
		setChatId(demoActive ? DEMO_SUPPORT_CHAT : null);
		if (!demoActive) {
			setActiveSupportChatId(null);
		}
		dispatch(setMessages([]));
		setScreen('thread');
	};

	const goToChatList = () => {
		setSessions(loadSupportSessions());
		setScreen('list');
	};

	const resumeSession = (id: string) => {
		setChatId(id);
		setActiveSupportChatId(id);
		if (!demoActive && socket) {
			socket.emit('joinSupportChat', { chatId: id });
		}
		if (demoActive) {
			dispatch(setMessages([]));
		}
		setScreen('thread');
	};

	const deleteSession = (e: MouseEvent, id: string) => {
		e.stopPropagation();
		removeSupportSession(id);
		const next = loadSupportSessions();
		setSessions(next);
		if (chatId === id) {
			setChatId(demoActive ? DEMO_SUPPORT_CHAT : null);
			if (!demoActive) setActiveSupportChatId(null);
			dispatch(setMessages([]));
			setScreen(next.length > 0 ? 'list' : 'thread');
		}
	};

	const closeChat = () => dispatch(setOpenChatType(null));

	return (
		<div className={styles.supportChat}>
			<div className={styles.supportChatHeader}>
				<div className={styles.headerMain}>
					{screen === 'thread' && sessions.length > 0 && (
						<button
							type='button'
							className={styles.backBtn}
							onClick={goToChatList}
							aria-label='Back to conversations'
						>
							<IconChevronLeft size={22} stroke={1.75} />
						</button>
					)}
					<div className={styles.avatarContainer} aria-hidden>
						<FaHeadset size={22} color='#fff' />
					</div>
					<div className={styles.headerTitles}>
						<h2 className={styles.supportChatTitle}>
							{screen === 'list' ? 'Messages' : '24/7 Support'}
						</h2>
						<div className={styles.statusRow}>
							<span
								className={styles.statusDot}
								data-online={effectiveConnected}
							/>
							<span className={styles.supportChatSubtitle}>
								{effectiveConnected ? 'We are online' : 'Connecting…'}
							</span>
						</div>
					</div>
				</div>

				<div className={styles.headerActions}>
					<button
						type='button'
						className={styles.headerIconBtn}
						onClick={openNewChat}
						aria-label='New conversation'
					>
						<IconPlus size={20} stroke={1.75} />
					</button>
					<button
						type='button'
						className={styles.closeBtn}
						onClick={closeChat}
						aria-label='Close'
					>
						<IconX size={22} stroke={1.75} />
					</button>
				</div>
			</div>

			{screen === 'list' && (
				<div className={styles.listScreen}>
					{sessions.length === 0 ? (
						<div className={styles.listEmpty}>
							<p className={styles.listEmptyText}>No conversations yet</p>
							<button
								type='button'
								className={styles.listEmptyCta}
								onClick={openNewChat}
							>
								Start a chat
							</button>
						</div>
					) : (
						<ul className={styles.historyList}>
							{sessions.map((s) => (
								<li key={s.id} className={styles.historyRow}>
									<button
										type='button'
										className={styles.historyItem}
										onClick={() => resumeSession(s.id)}
										data-active={chatId === s.id}
									>
										<span className={styles.historyItemLabel}>{s.label}</span>
										<span className={styles.historyItemPreview}>
											{s.preview || 'No messages yet'}
										</span>
										<span className={styles.historyItemMeta}>
											{formatSessionUpdatedAt(s.updatedAt)}
										</span>
									</button>
									<button
										type='button'
										className={styles.historyDelete}
										onClick={(e) => deleteSession(e, s.id)}
										aria-label='Remove conversation'
									>
										×
									</button>
								</li>
							))}
						</ul>
					)}
				</div>
			)}

			{screen === 'thread' && (
				<>
			<div className={styles.supportChatContent}>
				<div className={styles.supportChatFaq}>
					<div className={styles.faqHeading}>
						<IconHelpCircle size={16} stroke={1.5} className={styles.faqIcon} />
						<span className={styles.supportChatFaqTitle}>Quick assistant</span>
					</div>
					<div className={styles.faqChips}>
						{faqQuestions.map((faq, idx) => (
							<button
								key={idx}
								type='button'
								className={styles.faqButton}
								onClick={() => handleFaqClick(faq)}
								disabled={!effectiveConnected}
							>
								{faq.question}
							</button>
						))}
					</div>
				</div>

				{!effectiveConnected ? (
					<div className={styles.connectingWrap}>
						<Loader size='sm' />
						<span className={styles.mutedText}>Connecting…</span>
					</div>
				) : messages?.length === 0 ? (
					<div className={styles.emptyWrap}>
						<span className={styles.emptyText}>
							Hi there!
							<br />
							How can we help you today?
						</span>
					</div>
				) : (
					<div className={styles.messagesList}>
						{messages.map((msg, idx) => {
							const isMine = msg.senderUserId === effectiveUserId;
							const isImg = isDataImageContent(msg.content);
							return (
								<div
									key={msg.id || idx}
									className={`${styles.messageRow} ${isMine ? styles.messageRowMine : ''}`}
								>
									{!isMine && (
										<div className={styles.botAvatar}>
											<FaHeadset size={16} color='#584CED' />
										</div>
									)}

									<div
										className={`${styles.bubble} ${isMine ? styles.bubbleMine : styles.bubbleOther}`}
									>
										{isImg ? (
											<img
												src={msg.content}
												alt=''
												className={styles.messageImage}
											/>
										) : (
											<span className={styles.messageText}>{msg.content}</span>
										)}
									</div>
								</div>
							);
						})}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			<div className={styles.inputContainer}>
				<input
					ref={fileInputRef}
					type='file'
					accept='image/jpeg,image/png,image/webp,image/gif'
					className={styles.hiddenFileInput}
					onChange={(e) => {
						const f = e.target.files?.[0];
						if (f) void sendImage(f);
					}}
				/>
				<div className={styles.inputWrapper}>
					<button
						type='button'
						className={styles.attachBtn}
						disabled={!effectiveConnected || imageSending}
						onClick={() => fileInputRef.current?.click()}
						aria-label='Attach photo'
					>
						{imageSending ? (
							<Loader size='sm' />
						) : (
							<IconPhoto size={22} stroke={1.5} />
						)}
					</button>
					<input
						className={styles.textInput}
						placeholder='Type your message…'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleSendMessage();
						}}
						disabled={!effectiveConnected}
					/>
					<button
						type='button'
						className={styles.sendButton}
						onClick={() => handleSendMessage()}
						disabled={!inputValue.trim() || !effectiveConnected}
						aria-label='Send'
					>
						<IconSend size={18} stroke={2} />
					</button>
				</div>
			</div>
				</>
			)}
		</div>
	);
};

export default SupportChat;
