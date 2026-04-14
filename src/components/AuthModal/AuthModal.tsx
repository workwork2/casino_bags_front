'use client';

import { useState, useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import {
	IoClose,
	IoEyeOffOutline,
	IoEyeOutline,
	IoWarningOutline,
} from 'react-icons/io5';
import { MdOutlineMail, MdOutlineLock, MdOutlinePayments } from 'react-icons/md';
import { FaGoogle, FaSteam } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import {
	Modal,
	Button,
	Stack,
	Group,
	TextField,
	PasswordField,
	SegmentedTabs,
	NativeSelect,
	CheckboxField,
} from '@/shared/ui';
import classes from './AuthModal.module.scss';
import { API_URL } from '@/shared/lib/api/axios';
import { loginUser, registerUser } from '@/features/auth/model/authSlice';
import { useAppDispatch } from '@/shared/lib/redux/hooks';

type ProviderMode = 'login' | 'signup';

interface AuthModalProps {
	opened: boolean;
	onClose: () => void;
	currentMode: ProviderMode;
	onSwitchMode: (mode: ProviderMode) => void;
}

type ViewState = 'login' | 'registration' | 'forgot_password';

type FormValues = {
	email: string;
	password: string;
	promo: string;
	currency: string;
	ageConfirmed: boolean;
	promoOptIn: boolean;
};

const CURRENCIES = [
	{ value: 'USD', label: 'USD — US Dollar' },
	{ value: 'EUR', label: 'EUR — Euro' },
	{ value: 'GBP', label: 'GBP — British Pound' },
	{ value: 'RUB', label: 'RUB — Russian Ruble' },
	{ value: 'KZT', label: 'KZT — Kazakhstani Tenge' },
];

export default function AuthModal({
	opened,
	onClose,
	currentMode,
	onSwitchMode,
}: AuthModalProps) {
	const [view, setView] = useState<ViewState>(
		currentMode === 'signup' ? 'registration' : 'login',
	);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [forgotSent, setForgotSent] = useState(false);
	const dispatch = useAppDispatch();
	const currencyId = useId();

	const { register, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			email: '',
			password: '',
			promo: '',
			currency: 'USD',
			ageConfirmed: false,
			promoOptIn: false,
		},
	});

	useEffect(() => {
		if (opened) {
			if (currentMode === 'login' && view !== 'forgot_password') {
				setView('login');
			} else if (currentMode === 'signup') {
				setView('registration');
			}
		}
	}, [currentMode, opened]);

	const handleTabChange = (value: string) => {
		if (value === 'login') onSwitchMode('login');
		if (value === 'registration') onSwitchMode('signup');
		setView(value as ViewState);
		setError(null);
		setForgotSent(false);
	};

	const socialLogin = (provider: string) => {
		window.location.href = `${API_URL}/auth/${provider}`;
	};

	const onValid = async (data: FormValues) => {
		setError(null);

		if (view === 'forgot_password') {
			if (!/^\S+@\S+$/.test(data.email)) {
				setError('Invalid email');
				return;
			}
			setLoading(true);
			try {
				await new Promise((r) => setTimeout(r, 500));
				setForgotSent(true);
				setError(null);
			} finally {
				setLoading(false);
			}
			return;
		}

		if (!/^\S+@\S+$/.test(data.email)) {
			setError('Invalid email');
			return;
		}
		if (data.password.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		if (view === 'registration' && !data.ageConfirmed) {
			setError('You must confirm that you are at least 18 years old.');
			return;
		}

		setLoading(true);
		try {
			if (view === 'login') {
				await dispatch(
					loginUser({
						email: data.email,
						password: data.password,
					}),
				).unwrap();
			} else {
				await dispatch(
					registerUser({
						email: data.email,
						password: data.password,
						promo: data.promo,
					}),
				).unwrap();
			}
			onClose();
			reset();
		} catch (err: unknown) {
			const msg =
				typeof err === 'string'
					? err
					: 'Something went wrong. Please try again.';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const forgotMode = view === 'forgot_password';

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			classNames={{ inner: classes.modalInner }}
		>
			<div className={`${classes.container} ${classes.singleMode}`}>
				<div className={classes.formSide}>
					{error && (
						<div className={classes.errorBanner} role='alert'>
							<IoWarningOutline size={16} aria-hidden />
							<span>{error}</span>
						</div>
					)}

					{forgotMode ? (
						<header className={classes.authHeader}>
							<p className={classes.authKicker}>Account</p>
							<h2 className={classes.authTitle}>Reset password</h2>
							<p className={classes.authLead}>
								Enter the email linked to your account. We&apos;ll send you a
								reset link.
							</p>
						</header>
					) : (
						<>
							<header className={classes.authHeader}>
								<p className={classes.authKicker}>Casino Master</p>
								<h2 className={classes.authTitle}>
									{view === 'login'
										? 'Welcome back'
										: 'Create your account'}
								</h2>
								<p className={classes.authLead}>
									{view === 'login'
										? 'Log in to play, claim bonuses, and manage your wallet.'
										: 'Join in seconds. Secure signup with email or social login.'}
								</p>
							</header>

							<SegmentedTabs
								value={view === 'registration' ? 'registration' : 'login'}
								onChange={(v) => handleTabChange(v)}
								options={[
									{ label: 'Register', value: 'registration' },
									{ label: 'Log in', value: 'login' },
								]}
								classNames={{ root: classes.segmentRoot }}
							/>
						</>
					)}

					<form
						className={classes.authForm}
						onSubmit={handleSubmit(onValid)}
					>
						<Stack className={classes.authFormStack} gap={10}>
							{!(forgotMode && forgotSent) && (
								<TextField
									placeholder='Email address'
									type='email'
									autoComplete='email'
									leftSection={<MdOutlineMail size={16} />}
									className={classes.fieldRow}
									inputClassName={classes.fieldControl}
									sectionClassName={classes.inputSection}
									{...register('email')}
								/>
							)}

							{!forgotMode && (
								<>
									<PasswordField
										placeholder='Password'
										autoComplete={
											view === 'registration'
												? 'new-password'
												: 'current-password'
										}
										leftSection={<MdOutlineLock size={16} />}
										className={classes.fieldRow}
										inputClassName={classes.fieldControl}
										sectionClassName={classes.inputSection}
										toggleClassName={classes.passwordToggle}
										visibilityIcon={(open) =>
											open ? (
												<IoEyeOffOutline size={16} />
											) : (
												<IoEyeOutline size={16} />
											)
										}
										{...register('password')}
									/>

									{view === 'login' && (
										<div
											className={classes.forgotLink}
											role='button'
											tabIndex={0}
											onClick={() => {
												setView('forgot_password');
												setError(null);
												setForgotSent(false);
											}}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													setView('forgot_password');
													setError(null);
													setForgotSent(false);
												}
											}}
										>
											Forgot password?
										</div>
									)}

									<p className={classes.dividerOr}>Or continue with</p>

									<Group
										justify='center'
										className={classes.socialGroup}
										gap={10}
									>
										<button
											type='button'
											className={`${classes.socialBtn} ${classes.socialBtnGoogle}`}
											onClick={() => socialLogin('google')}
											aria-label='Continue with Google'
										>
											<FaGoogle size={18} />
										</button>
										<button
											type='button'
											className={`${classes.socialBtn} ${classes.socialBtnSteam}`}
											onClick={() => socialLogin('steam')}
											aria-label='Continue with Steam'
										>
											<FaSteam size={18} />
										</button>
										<button
											type='button'
											className={`${classes.socialBtn} ${classes.socialBtnX}`}
											onClick={() => socialLogin('twitter')}
											aria-label='Continue with X'
										>
											<FaXTwitter size={17} />
										</button>
									</Group>

									{view === 'login' && (
										<div className={classes.authFormBalance} aria-hidden />
									)}

									{view === 'registration' && (
										<>
											<NativeSelect
												id={currencyId}
												label='Preferred currency'
												options={CURRENCIES}
												leftSection={<MdOutlinePayments size={16} />}
												rowClassName={classes.fieldRow}
												selectClassName={classes.fieldControl}
												sectionClassName={classes.inputSection}
												labelClassName={classes.selectLabel}
												{...register('currency')}
											/>

											<Stack gap={6}>
												<CheckboxField
													label='I confirm that I am at least 18 years old and accept the Terms & Privacy Policy.'
													rootClassName={classes.checkboxRoot}
													inputClassName={classes.checkboxInput}
													labelClassName={classes.checkboxLabel}
													{...register('ageConfirmed')}
												/>
												<CheckboxField
													label='Email me bonuses, tournaments, and news (optional).'
													rootClassName={classes.checkboxRoot}
													inputClassName={classes.checkboxInput}
													labelClassName={classes.checkboxLabel}
													{...register('promoOptIn')}
												/>
											</Stack>

											<TextField
												placeholder='Promo code (optional)'
												className={classes.fieldRow}
												inputClassName={classes.fieldControl}
												{...register('promo')}
											/>
										</>
									)}
								</>
							)}

							{forgotMode && forgotSent ? (
								<p className={classes.forgotSuccess}>
									If an account exists for this email, you will receive reset
									instructions shortly. Check your inbox and spam folder.
								</p>
							) : null}

							{!(forgotMode && forgotSent) && (
								<Button
									type='submit'
									loading={loading}
									fullWidth
									className={classes.submitButton}
								>
									{view === 'login' && 'Log in'}
									{view === 'registration' && 'Create account'}
									{forgotMode && 'Send reset link'}
								</Button>
							)}

							{forgotMode && (
								<button
									type='button'
									className={classes.backLink}
									onClick={() => {
										setView('login');
										setError(null);
										setForgotSent(false);
									}}
								>
									← Back to log in
								</button>
							)}
						</Stack>
					</form>
				</div>

				<button
					type='button'
					className={`app-modal-close ${classes.closeButton}`}
					onClick={onClose}
					aria-label='Close'
				>
					<IoClose size={22} />
				</button>
			</div>
		</Modal>
	);
}
