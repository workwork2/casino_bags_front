import { nanoid } from 'nanoid';
import type { Message } from '@/widgets/chat/model/slice';

/**
 * Режим просмотра UI без бэкенда: локальные сообщения, без WebSocket.
 * Отключить демо: в .env.local задать NEXT_PUBLIC_CHAT_DEMO=0
 */
export const isChatDemoMode = process.env.NEXT_PUBLIC_CHAT_DEMO !== '0';

/** «Ваш» id в демо, если пользователь не залогинен */
export const CHAT_DEMO_USER_ID = '00000000-0000-4000-8000-000000000001';
export const CHAT_DEMO_BOT_ID = '00000000-0000-4000-8000-000000000002';

export function chatDemoUserId(loggedUserId: string | undefined): string {
	return loggedUserId ?? CHAT_DEMO_USER_ID;
}

export function createDemoMessage(
	p: Partial<Message> & Pick<Message, 'content'>,
): Message {
	return {
		id: p.id ?? nanoid(),
		senderUserId: p.senderUserId ?? CHAT_DEMO_USER_ID,
		senderGuestId: p.senderGuestId ?? '',
		type: p.type ?? 'text',
		content: p.content,
		createdAt: p.createdAt ?? new Date().toISOString(),
		editedAt: p.editedAt ?? '',
		deletedAt: p.deletedAt ?? '',
		chatId: p.chatId ?? 'demo',
		tempId: p.tempId,
		status: p.status,
	};
}
