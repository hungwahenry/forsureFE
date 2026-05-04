import {
  useConfirmEmailChange,
  useStartEmailChange,
} from '@/features/account/api/changeEmail';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import * as React from 'react';

export type ChangeEmailStep = 'enter-email' | 'enter-code';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useChangeEmailFlow() {
  const [step, setStep] = React.useState<ChangeEmailStep>('enter-email');
  const [newEmail, setNewEmailRaw] = React.useState('');
  const [challengeId, setChallengeId] = React.useState<string | null>(null);
  const [code, setCodeRaw] = React.useState('');

  const start = useStartEmailChange();
  const confirm = useConfirmEmailChange();

  const setNewEmail = (v: string) => setNewEmailRaw(v.trim().toLowerCase());
  const setCode = (v: string) =>
    setCodeRaw(v.replace(/[^0-9]/g, '').slice(0, 6));

  const isValidEmail = EMAIL_PATTERN.test(newEmail);

  const requestCode = async (toastOnSuccess: string | null): Promise<boolean> => {
    if (!isValidEmail) return false;
    try {
      const res = await start.mutateAsync(newEmail);
      setChallengeId(res.challengeId);
      if (toastOnSuccess) toast(toastOnSuccess);
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't send code. try again.";
      toast.error(message);
      return false;
    }
  };

  const onContinue = async (): Promise<void> => {
    const ok = await requestCode(null);
    if (ok) setStep('enter-code');
  };

  const onResend = async (): Promise<void> => {
    await requestCode('code resent.');
  };

  const onConfirm = async (): Promise<boolean> => {
    if (!challengeId || code.length !== 6) return false;
    try {
      await confirm.mutateAsync({ challengeId, code });
      toast.success(`email updated to ${newEmail}.`);
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't confirm. try again.";
      toast.error(message);
      return false;
    }
  };

  return {
    step,
    newEmail,
    setNewEmail,
    isValidEmail,
    code,
    setCode,
    onContinue,
    onResend,
    onConfirm,
    canConfirm: code.length === 6 && challengeId != null,
    isRequestingCode: start.isPending,
    isConfirming: confirm.isPending,
  };
}
