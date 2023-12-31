'use client';

import { useState, useRef } from 'react';
import type { SignInResource } from '@clerk/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { FormRow } from '@/components/layouts';
import { FormFieldText } from '@/components/features/hook-form-fields';
import {
  type FormSignInFields,
  formSchema,
  initialValues,
  FormFields,
} from './schema';
import { useI18n } from '@/locales/client';
import { handleAPIError } from '@/lib/helpers';

interface SignInForgotPasswordFormProps {
  onComplete: () => void;
  signIn: SignInResource;
}

export function SignInForgotPasswordForm({
  signIn,
  onComplete,
}: SignInForgotPasswordFormProps) {
  const t = useI18n();
  const toast = useRef<Toast>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { control, handleSubmit } = useForm<FormSignInFields>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const onSubmit: SubmitHandler<FormSignInFields> = async ({ email }) => {
    try {
      setIsLoading(true);

      await signIn.create({
        identifier: email,
        strategy: 'reset_password_email_code',
      });

      onComplete();
    } catch (error: unknown) {
      handleAPIError(error, toast, t);
      setIsLoading(false);
    }
  };

  return (
    <form key="signInForgotPassword" onSubmit={handleSubmit(onSubmit)}>
      <Toast ref={toast} />
      <FormRow>
        <Message
          className="w-full"
          severity="info"
          text="You'll get a code to reset your password via email."
        />
      </FormRow>
      <FormRow>
        <FormFieldText
          label={t('form.email.label')}
          autoComplete="email"
          control={control}
          name={FormFields.EMAIL}
          disabled={isLoading}
          type="email"
          autoFocus
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
