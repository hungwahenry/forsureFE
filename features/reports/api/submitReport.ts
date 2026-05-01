import { api } from '@/lib/api/client';
import { useMutation } from '@tanstack/react-query';
import type { Report, ReportTargetType } from '../types';

export interface SubmitReportArgs {
  targetType: ReportTargetType;
  targetId: string;
  reasonId: string;
  details?: string;
}

export function useSubmitReport() {
  return useMutation<Report, unknown, SubmitReportArgs>({
    mutationFn: async (args) => {
      const res = await api.post<Report>('/v1/reports', args);
      return res.data;
    },
  });
}
