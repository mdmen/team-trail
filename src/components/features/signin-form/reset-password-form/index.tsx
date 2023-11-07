'use client';

import { useState, useRef } from 'react';
import type { SignInResource } from '@clerk/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormRow, Toast, Message } from '@/components/ui';
import {
  SignUpFormTextField,
  SignUpFormPassword,
} from '@/components/features/hook-form-fields';
import {
  initialValues,
  FormFields,
  formSchema,
  type FormSignInFields,
} from './schema';
import { useI18n } from '@/locales/client';
import { handleAPIError } from '@/lib/helpers';

interface SignInResetPasswordFormProps {
  signIn: SignInResource;
  onComplete: () => void;
}

export function SignInResetPasswordForm({
  signIn,
  onComplete,
}: SignInResetPasswordFormProps) {
  const t = useI18n();
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<FormSignInFields>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<FormSignInFields> = async ({
    code,
    password,
  }) => {
    try {
      setIsLoading(true);

      const { status } = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (status !== 'complete') {
        throw Error(
          'Auth process is not configured for password reset using email code',
        );
      }

      onComplete();
    } catch (err: unknown) {
      handleAPIError(err, toast, t);
      setIsLoading(false);
    }
  };

  return (
    <form key="signInResetPassword" onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />
      <FormRow>
        <Message
          className="w-full"
          severity="info"
          text={t('form.code.help')}
        />
      </FormRow>
      <FormRow>
        <SignUpFormTextField
          label={t('form.code.label')}
          autoComplete="off"
          control={control}
          name={FormFields.CODE}
          disabled={isLoading}
          autoFocus
          required
          minLength={3}
        />
      </FormRow>
      <FormRow>
        <SignUpFormPassword
          name={FormFields.PASSWORD}
          control={control}
          disabled={isLoading}
          required
        />
      </FormRow>
      <FormRow margin="none">
        <Button
          label={t('button.send')}
          type="submit"
          className="w-full"
          loading={isLoading}
        />
      </FormRow>
    </form>
  );
}