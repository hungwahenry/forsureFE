import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import {
  ActivityShareCard,
  SHARE_CARD_SIZE,
} from '@/features/activities/share/components/ActivityShareCard';
import { useShareFlow } from '@/features/activities/share/hooks/useShareFlow';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  DocumentDownload,
  ExportSquare,
  type Icon as IconsaxIcon,
} from 'iconsax-react-nativejs';
import { Pressable, useWindowDimensions, View } from 'react-native';

export default function ShareActivityScreen() {
  const router = useRouter();
  const flow = useShareFlow();
  const { width } = useWindowDimensions();
  const previewSize = Math.min(width - 48, 360);
  const scale = previewSize / SHARE_CARD_SIZE;
  const offset = (previewSize - SHARE_CARD_SIZE) / 2;

  if (!flow.target) return null;

  return (
    <Screen edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">share</Text>
        <View className="size-7" />
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View
          style={{
            width: previewSize,
            height: previewSize,
            overflow: 'hidden',
            borderRadius: 24,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 24,
            elevation: 6,
          }}
        >
          <View
            style={{
              position: 'absolute',
              top: offset,
              left: offset,
              width: SHARE_CARD_SIZE,
              height: SHARE_CARD_SIZE,
              transform: [{ scale }],
            }}
          >
            <ActivityShareCard ref={flow.cardRef} activity={flow.target} />
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-6 px-6 pb-6">
        <Action
          icon={DocumentDownload}
          label="save"
          loading={flow.mode === 'save'}
          disabled={flow.isBusy}
          onPress={() => void flow.onSave()}
        />
        <Action
          icon={ExportSquare}
          label="share"
          loading={flow.mode === 'share'}
          disabled={flow.isBusy}
          onPress={() => void flow.onShare()}
        />
      </View>
    </Screen>
  );
}

interface ActionProps {
  icon: IconsaxIcon;
  label: string;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}

function Action({ icon, label, loading, disabled, onPress }: ActionProps) {
  return (
    <Button
      onPress={onPress}
      disabled={disabled}
      variant="secondary"
      size="lg"
      className="flex-1"
      leftIcon={
        loading ? (
          <LoadingIndicator size={6} />
        ) : (
          <Icon as={icon} className="size-5" />
        )
      }
    >
      <Text>{label}</Text>
    </Button>
  );
}
