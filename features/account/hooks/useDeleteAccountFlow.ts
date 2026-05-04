import { useDeleteAccount } from '@/features/account/api/deleteAccount';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { useStartStepUp } from '@/features/step-up/api/startStepUp';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import * as React from 'react';

export type DeleteAccountStep = 'warn' | 'otp';

export function useDeleteAccountFlow() {
  const [step, setStep] = React.useState<DeleteAccountStep>('warn');
  const [challengeId, setChallengeId] = React.useState<string | null>(null);
  const [code, setCodeRaw] = React.useState('');

  const startStepUp = useStartStepUp();
  const deleteAccount = useDeleteAccount();
  const { signOut } = useSignOut();

  const setCode = (v: string) => setCodeRaw(v.replace(/[^0-9]/g, '').slice(0, 6));

  const requestCode = async (toastOnSuccess: string | null): Promise<boolean> => {
    try {
      const res = await startStepUp.mutateAsync('DELETE_ACCOUNT');
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
    if (ok) setStep('otp');
  };

  const onResend = async (): Promise<void> => {
    await requestCode('code resent.');
  };

  const onConfirm = async (): Promise<void> => {
    if (!challengeId || code.length !== 6) return;
    try {
      await deleteAccount.mutateAsync({ challengeId, code });
      // User record is anonymized server-side; signOut clears local state
      // and the auth gate redirects to /welcome.
      await signOut();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't delete. try again.";
      toast.error(message);
    }
  };

  return {
    step,
    code,
    setCode,
    onContinue,
    onResend,
    onConfirm,
    canConfirm: code.length === 6 && challengeId != null,
    isRequestingCode: startStepUp.isPending,
    isDeleting: deleteAccount.isPending,
  };
}
