'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { IoEyeOffOutline, IoEyeOutline, IoWarningOutline } from 'react-icons/io5';
import { MdOutlineMail, MdOutlineLock } from 'react-icons/md';

import { Button, Stack, Group, TextField, PasswordField } from '@/shared/ui';
import { api, API_URL } from '@/shared/lib/api/axios';
import classes from '../AuthModal/AuthModal.module.scss';

type FormValues = {
	email: string;
	password: string;
};

interface LoginFormProps {
	onSuccess: () => void;
	onForgotPassword: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword }: LoginFormProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { register, handleSubmit } = useForm<FormValues>({
		defaultValues: { email: '', password: '' },
	});

	const onValid = async (data: FormValues) => {
		if (!/^\S+@\S+$/.test(data.email)) {
			setError('Invalid email');
			return;
		}
		if (data.password.length < 6) {
			setError('Password too short');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			await api.post('/auth/login', data);
			onSuccess();
		} catch (err: unknown) {
			const msg =
				err &&
				typeof err === 'object' &&
				'message' in err &&
				typeof (err as { message?: string }).message === 'string'
					? (err as { message: string }).message
					: 'Login failed';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	const socialLogin = (provider: string) => {
		window.location.href = `${API_URL}/auth/${provider}`;
	};

	return (
		<>
			{error && (
				<div className={classes.errorBanner} role='alert'>
					<IoWarningOutline size={16} aria-hidden />
					<span>{error}</span>
				</div>
			)}

			<form onSubmit={handleSubmit(onValid)}>
				<Stack gap={10}>
					<TextField
						placeholder='E-mail'
						type='email'
						leftSection={<MdOutlineMail size={16} />}
						className={classes.fieldRow}
						inputClassName={classes.fieldControl}
						sectionClassName={classes.inputSection}
						{...register('email')}
					/>

					<PasswordField
						placeholder='Password'
						leftSection={<MdOutlineLock size={16} />}
						className={classes.fieldRow}
						inputClassName={classes.fieldControl}
						sectionClassName={classes.inputSection}
						toggleClassName={classes.passwordToggle}
						visibilityIcon={(open) =>
							open ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />
						}
						{...register('password')}
					/>

					<div
						className={classes.forgotLink}
						role='button'
						tabIndex={0}
						onClick={onForgotPassword}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onForgotPassword();
							}
						}}
					>
						Forget password?
					</div>

					<Group justify='center' className={classes.socialGroup} gap={10}>
						<button
							type='button'
							className={classes.socialBtn}
							onClick={() => socialLogin('google')}
							aria-label='Google'
						>
							<Image src='/gogl.svg' alt='Google' width={36} height={36} />
						</button>
						<button
							type='button'
							className={classes.socialBtn}
							onClick={() => socialLogin('steam')}
							aria-label='Steam'
						>
							<Image src='/steam.svg' alt='Steam' width={36} height={36} />
						</button>
						<button
							type='button'
							className={classes.socialBtn}
							onClick={() => socialLogin('twitter')}
							aria-label='X'
						>
							<Image src='/x-twitter.svg' alt='X' width={36} height={36} />
						</button>
					</Group>

					<Button
						type='submit'
						fullWidth
						loading={loading}
						className={classes.submitButton}
					>
						Log in
					</Button>
				</Stack>
			</form>
		</>
	);
}
