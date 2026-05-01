import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { useReportReasons } from '@/features/reports/api/listReasons';
import { useSubmitReport } from '@/features/reports/api/submitReport';
import type { ReportTargetType } from '@/features/reports/types';
import { ApiError } from '@/lib/api/types';
import { toast } from '@/lib/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

const TARGET_LABEL: Record<ReportTargetType, string> = {
  USER: 'this person',
  ACTIVITY: 'this activity',
  MESSAGE: 'this message',
};

const DETAILS_MAX = 1000;

export default function ReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    targetType: ReportTargetType;
    targetId: string;
  }>();

  const targetType = params.targetType;
  const targetId = params.targetId;

  const reasons = useReportReasons(targetType ?? null);
  const submit = useSubmitReport();
  const [reasonId, setReasonId] = React.useState<string | null>(null);
  const [details, setDetails] = React.useState('');

  if (!targetType || !targetId) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-muted-foreground text-center">
            missing report target.
          </Text>
        </View>
      </Screen>
    );
  }

  const onSubmit = async () => {
    if (!reasonId) return;
    try {
      await submit.mutateAsync({
        targetType,
        targetId,
        reasonId,
        details: details.trim() || undefined,
      });
      toast.success('thanks — we got your report.');
      router.back();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "couldn't send. try again.";
      toast.error(message);
    }
  };

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          report {TARGET_LABEL[targetType]}
        </Text>
        <View className="size-7" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-muted-foreground mb-4 text-sm">
          pick what's wrong. our team will take a look.
        </Text>

        {reasons.isPending ? (
          <View className="items-center py-10">
            <LoadingIndicator size={6} />
          </View>
        ) : reasons.data && reasons.data.length > 0 ? (
          <RadioGroup
            value={reasonId ?? ''}
            onValueChange={setReasonId}
            className="gap-1"
          >
            {reasons.data.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => setReasonId(r.id)}
                className="border-border/40 flex-row items-start gap-3 border-b py-3"
              >
                <View className="pt-1">
                  <RadioGroupItem value={r.id} aria-label={r.label} />
                </View>
                <View className="flex-1">
                  <Text className="text-foreground text-base">{r.label}</Text>
                  {r.description ? (
                    <Text className="text-muted-foreground text-xs">
                      {r.description}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </RadioGroup>
        ) : (
          <Text className="text-muted-foreground text-sm">
            no reasons available right now.
          </Text>
        )}

        <View className="mt-6 gap-2">
          <Text className="text-muted-foreground text-xs">
            anything else? (optional)
          </Text>
          <Textarea
            value={details}
            onChangeText={(t) => setDetails(t.slice(0, DETAILS_MAX))}
            placeholder="add context to help our team"
            autoCapitalize="sentences"
          />
        </View>
      </ScrollView>

      <View className="border-border/40 border-t px-6 py-4">
        <Button
          onPress={() => void onSubmit()}
          size="lg"
          disabled={!reasonId || submit.isPending}
        >
          {submit.isPending ? (
            <LoadingIndicator color="white" />
          ) : (
            <Text>submit report</Text>
          )}
        </Button>
      </View>
    </Screen>
  );
}
