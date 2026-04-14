'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type Mode = 'login' | 'signup';

const AuthModalContext = createContext<{
	opened: boolean;
	close: () => void;
	openLogin: () => void;
	openSignup: () => void;
	mode: Mode;
} | null>(null);

export const AuthModalProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [opened, setOpened] = useState(false);
	const [mode, setMode] = useState<Mode>('login');

	const close = useCallback(() => setOpened(false), []);

	const openLogin = useCallback(() => {
		setMode('login');
		setOpened(true);
	}, []);

	const openSignup = useCallback(() => {
		setMode('signup');
		setOpened(true);
	}, []);

	return (
		<AuthModalContext.Provider
			value={{ opened, close, openLogin, openSignup, mode }}
		>
			{children}
		</AuthModalContext.Provider>
	);
};

export const useAuthModal = () => {
	const context = useContext(AuthModalContext);
	if (!context) {
		throw new Error('useAuthModal must be used within AuthModalProvider');
	}

	return context;
};
