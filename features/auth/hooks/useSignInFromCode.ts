import { useVerifyCode } from '../api/verifyCode';
import { useAuthStore } from '../stores/authStore';
import type { VerifyCodeResponse } from '../types';

interface SignInArgs {
  email: string;
  code: string;
}

/**
 * Verifies a one-time code and signs the user in. Encapsulates the
 * shape-shifting between the verify-code response and the auth store
 * so screens never touch the auth response directly.
 */
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
