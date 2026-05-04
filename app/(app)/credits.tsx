import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useDiscoverCredits } from '@/features/eggs/credits/api/discover';
import { haptics } from '@/lib/haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Confetti } from 'react-native-fast-confetti';

const CONFETTI_COLORS = [
  '#2EBFB5',
  '#FFA31A',
  '#BFEDE7',
  '#FFCC8A',
  '#3D6B68',
];

const ordinal = (n: number) => {
  const tens = n % 100;
  if (tens >= 11 && tens <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

export default function CreditsScreen() {
  const router = useRouter();
  const discover = useDiscoverCredits();
  const fired = React.useRef(false);

  React.useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    haptics.thump();
    discover.mutate(undefined, {
      onSuccess: () => haptics.success(),
    });
  }, [discover]);

  const result = discover.data;

  return (
    <Screen edges={['top']}>
      <Confetti
        count={140}
        fallDuration={4500}
        isInfinite={false}
        fadeOutOnEnd
        colors={CONFETTI_COLORS}
      />

      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          credits
        </Text>
        <View className="size-7" />
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-foreground text-center text-3xl font-bold">
          you found it!
        </Text>
        <Text className="text-muted-foreground mt-3 text-center text-base leading-6">
          thanks for being curious. most people never make it here.
        </Text>

        <View className="bg-primary/5 mt-10 w-full rounded-3xl px-6 py-8">
          {!result ? (
            <View className="items-center">
              <LoadingIndicator size={8} />
            </View>
          ) : (
            <>
              <Text className="text-muted-foreground text-center text-sm">
                you're the
              </Text>
              <Text className="text-primary mt-1 text-center text-6xl font-bold">
                {ordinal(result.rank)}
              </Text>
              <Text className="text-muted-foreground mt-2 text-center text-sm">
                of {result.total} {result.total === 1 ? 'person' : 'people'} to
                find this 🎉
              </Text>
            </>
          )}
        </View>

        <Text className="text-muted-foreground mt-12 text-center text-sm leading-5">
          made by henter,{'\n'}with ❤️ for people{'\n'}who actually go outside.
        </Text>
      </View>
    </Screen>
  );
}
