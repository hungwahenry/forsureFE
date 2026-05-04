import { useRequestDataExport } from '@/features/account/api/exportData';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import * as React from 'react';

export type ExportStep = 'idle' | 'requested';

export function useDataExport() {
  const [step, setStep] = React.useState<ExportStep>('idle');
  const requestExport = useRequestDataExport();

  const onRequest = async (): Promise<void> => {
    try {
      await requestExport.mutateAsync();
      setStep('requested');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't request. try again.";
      toast.error(message);
    }
  };

  return {
    step,
    onRequest,
    isRequesting: requestExport.isPending,
  };
}
