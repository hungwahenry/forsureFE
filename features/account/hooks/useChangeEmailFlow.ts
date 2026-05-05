import {
  useConfirmEmailChange,
  useStartEmailChange,
} from '@/features/account/api/changeEmail';
import { useStartStepUp } from '@/features/step-up/api/startStepUp';
import { ApiError, ErrorCode } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import * as React from 'react';

export type ChangeEmailStep = 'verify-current' | 'enter-email' | 'enter-code';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useChangeEmailFlow() {
  const [step, setStep] = React.useState<ChangeEmailStep>('verify-current');
  const [stepUpChallengeId, setStepUpChallengeId] = React.useState<string | null>(null);
  const [stepUpCode, setStepUpCodeRaw] = React.useState('');
  const [newEmail, setNewEmailRaw] = React.useState('');
  const [emailChallengeId, setEmailChallengeId] = React.useState<string | null>(null);
  const [code, setCodeRaw] = React.useState('');

  const startStepUp = useStartStepUp();
  const start = useStartEmailChange();
  const confirm = useConfirmEmailChange();

  const setStepUpCode = (v: string) =>
    setStepUpCodeRaw(v.replace(/[^0-9]/g, '').slice(0, 6));
  const setNewEmail = (v: string) => setNewEmailRaw(v.trim().toLowerCase());
  const setCode = (v: string) =>
    setCodeRaw(v.replace(/[^0-9]/g, '').slice(0, 6));

  const isValidEmail = EMAIL_PATTERN.test(newEmail);

  const requestStepUp = React.useCallback(
    async (toastOnSuccess: string | null): Promise<boolean> => {
      try {
        const res = await startStepUp.mutateAsync('CHANGE_EMAIL');
        setStepUpChallengeId(res.challengeId);
        setStepUpCodeRaw('');
        if (toastOnSuccess) toast(toastOnSuccess);
        return true;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "couldn't send code. try again.";
        toast.error(message);
        return false;
      }
    },
    [startStepUp],
  );

  const bootstrapped = React.useRef(false);
  React.useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    void requestStepUp(null);
  }, [requestStepUp]);

  const onVerifyCurrent = (): void => {
    if (stepUpCode.length !== 6 || !stepUpChallengeId) return;
    setStep('enter-email');
  };

  const onResendStepUp = async (): Promise<void> => {
    await requestStepUp('code resent.');
  };

  const onContinue = async (): Promise<void> => {
    if (!isValidEmail || !stepUpChallengeId || stepUpCode.length !== 6) return;
    try {
      const res = await start.mutateAsync({
        newEmail,
        stepUpChallengeId,
        stepUpCode,
      });
      setEmailChallengeId(res.challengeId);
      setStep('enter-code');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't send code. try again.";
      toast.error(message);
      // Step-up code is single-use; on auth error force re-verify rather than
      // letting the user retry with a server-consumed code.
      if (err instanceof ApiError && err.is(ErrorCode.AUTH_INVALID_CREDENTIALS)) {
        setStep('verify-current');
        await requestStepUp(null);
      }
    }
  };

  const onResendNewEmailCode = async (): Promise<void> => {
    setStep('verify-current');
    setEmailChallengeId(null);
    setCodeRaw('');
    await requestStepUp('verify your current email again to resend.');
  };

  const onConfirm = async (): Promise<boolean> => {
    if (!emailChallengeId || code.length !== 6) return false;
    try {
      await confirm.mutateAsync({ challengeId: emailChallengeId, code });
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
    stepUpCode,
    setStepUpCode,
    canVerifyCurrent: stepUpCode.length === 6 && stepUpChallengeId != null,
    onVerifyCurrent,
    onResendStepUp,
    isRequestingStepUp: startStepUp.isPending,
    newEmail,
    setNewEmail,
    isValidEmail,
    onContinue,
    isRequestingEmailCode: start.isPending,
    code,
    setCode,
    canConfirm: code.length === 6 && emailChallengeId != null,
    onConfirm,
    onResendNewEmailCode,
    isConfirming: confirm.isPending,
  };
}
