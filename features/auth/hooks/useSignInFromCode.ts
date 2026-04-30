import { useVerifyCode } from '../api/verifyCode';
import { useAuthStore } from '../stores/authStore';
import type { VerifyCodeResponse } from '../types';

interface SignInArgs {
  email: string;
  code: string;
}

export function useSignInFromCode() {
  const verifyCode = useVerifyCode();
  const signIn = useAuthStore((s) => s.signIn);

  const signInFromCode = async (
    args: SignInArgs,
  ): Promise<VerifyCodeResponse> => {
    const result = await verifyCode.mutateAsync(args);
    await signIn({
      user: result.user,
      tokens: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
    return result;
  };

  return {
    signInFromCode,
    isPending: verifyCode.isPending,
  };
}
