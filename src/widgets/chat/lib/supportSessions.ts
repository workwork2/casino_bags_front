const SESSIONS_KEY = 'supportChatSessionsV1';
const ACTIVE_KEY = 'supportChatActiveId';

export type SupportSession = {
	id: string;
	label: string;
	updatedAt: number;
	preview?: string;
};

export function loadSupportSessions(): SupportSession[] {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem(SESSIONS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as SupportSession[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export function saveSupportSession(session: SupportSession): void {
	const all = loadSupportSessions();
	const prev = all.find((s) => s.id === session.id);
	const list = all.filter((s) => s.id !== session.id);
	const merged: SupportSession = {
		...session,
		label: prev?.label ?? session.label,
	};
	list.unshift(merged);
	localStorage.setItem(SESSIONS_KEY, JSON.stringify(list.slice(0, 25)));
}

export function removeSupportSession(id: string): void {
	const list = loadSupportSessions().filter((s) => s.id !== id);
	localStorage.setItem(SESSIONS_KEY, JSON.stringify(list));
}

export function getActiveSupportChatId(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(ACTIVE_KEY) || localStorage.getItem('chatId');
}

export function setActiveSupportChatId(id: string | null): void {
	if (typeof window === 'undefined') return;
	if (id) {
		localStorage.setItem(ACTIVE_KEY, id);
		localStorage.setItem('chatId', id);
	} else {
		localStorage.removeItem(ACTIVE_KEY);
		localStorage.removeItem('chatId');
	}
}

export function formatSessionUpdatedAt(ts: number): string {
	try {
		return new Date(ts).toLocaleString(undefined, {
			dateStyle: 'medium',
			timeStyle: 'short',
		});
	} catch {
		return '';
	}
}
