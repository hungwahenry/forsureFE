import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import type { ReportReason, ReportTargetType } from '../types';

export const reportReasonsQueryKey = (targetType: ReportTargetType) =>
  ['reports', 'reasons', targetType] as const;

export function useReportReasons(
  targetType: ReportTargetType | null,
  enabled = true,
) {
  return useQuery({
    queryKey: reportReasonsQueryKey(targetType ?? 'USER'),
    queryFn: async () => {
      const res = await api.get<ReportReason[]>('/v1/reports/reasons', {
        params: { targetType },
      });
      return res.data;
    },
    enabled: enabled && targetType != null,
    staleTime: 5 * 60_000,
  });
}
