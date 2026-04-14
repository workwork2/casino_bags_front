'use client';

import { useState, useId } from 'react';
import { useForm } from 'react-hook-form';
import { IoWarningOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { MdOutlineMail, MdOutlineLock, MdOutlinePayments } from 'react-icons/md';
import { FaGoogle, FaSteam } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

import {
	Button,
	Stack,
	Group,
	TextField,
	PasswordField,
	NativeSelect,
	CheckboxField,
} from '@/shared/ui';
import { api } from '@/shared/lib/api/axios';
import classes from '../AuthModal/AuthModal.module.scss';

const CURRENCIES = [
	{ value: 'USD', label: 'USD — US Dollar' },
	{ value: 'EUR', label: 'EUR — Euro' },
	{ value: 'RUB', label: 'RUB — Russian Ruble' },
	{ value: 'KZT', label: 'KZT — Kazakhstani Tenge' },
];

type FormValues = {
	email: string;
	password: string;
	currency: string;
	promo: string;
	ageConfirmed: boolean;
	promoOptIn: boolean;
};

interface RegisterFormProps {
	onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const currencyId = useId();

	const { register, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			email: '',
			password: '',
			currency: 'USD',
			promo: '',
			ageConfirmed: false,
			promoOptIn: false,
		},
	});

	const onValid = async (data: FormValues) => {
		if (!data.ageConfirmed) {
			setError('You must confirm that you are at least 18 years old.');
			return;
		}
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
			await api.post('/auth/register', {
				email: data.email,
				password: data.password,
				promo: data.promo,
			});
			reset();
			onSuccess();
		} catch (err: unknown) {
			const msg =
				err &&
				typeof err === 'object' &&
				'message' in err &&
				typeof (err as { message?: string }).message === 'string'
					? (err as { message: string }).message
					: 'Registration failed';
			setError(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={classes.formSide}>
			{error && (
				<div className={classes.errorBanner} role='alert'>
					<IoWarningOutline size={16} aria-hidden />
					<span>{error}</span>
				</div>
			)}

			<header className={classes.authHeader}>
				<p className={classes.authKicker}>Casino Master</p>
				<h2 className={classes.authTitle}>Create your account</h2>
				<p className={classes.authLead}>
					Join in seconds — same look as the main registration modal.
				</p>
			</header>

			<form onSubmit={handleSubmit(onValid)}>
				<Stack gap={10}>
					<TextField
						placeholder='Email address'
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

					<p className={classes.dividerOr}>Or continue with</p>

					<Group justify='center' className={classes.socialGroup} gap={10}>
						<span
							className={`${classes.socialBtn} ${classes.socialBtnGoogle}`}
							aria-hidden
						>
							<FaGoogle size={18} />
						</span>
						<span
							className={`${classes.socialBtn} ${classes.socialBtnSteam}`}
							aria-hidden
						>
							<FaSteam size={18} />
						</span>
						<span className={`${classes.socialBtn} ${classes.socialBtnX}`} aria-hidden>
							<FaXTwitter size={17} />
						</span>
					</Group>

					<CheckboxField
						label='I confirm that I am at least 18 years old and accept the Terms & Privacy Policy.'
						rootClassName={classes.checkboxRoot}
						inputClassName={classes.checkboxInput}
						labelClassName={classes.checkboxLabel}
						{...register('ageConfirmed')}
					/>
					<CheckboxField
						label='Email me bonuses and news (optional).'
						rootClassName={classes.checkboxRoot}
						inputClassName={classes.checkboxInput}
						labelClassName={classes.checkboxLabel}
						{...register('promoOptIn')}
					/>

					<TextField
						placeholder='Promo code (optional)'
						className={classes.fieldRow}
						inputClassName={classes.fieldControl}
						{...register('promo')}
					/>

					<Button
						type='submit'
						fullWidth
						loading={loading}
						className={classes.submitButton}
					>
						Create account
					</Button>
				</Stack>
			</form>
		</div>
	);
}
