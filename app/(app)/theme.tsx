import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useThemeStore } from '@/features/settings/stores/themeStore';
import type { ThemePreference } from '@/features/settings/storage';
import { haptics } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  MobileProgramming,
  Moon,
  Sun1,
  TickCircle,
  type Icon as IconsaxIcon,
} from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

interface Option {
  value: ThemePreference;
  label: string;
  description: string;
  icon: IconsaxIcon;
}

const OPTIONS: Option[] = [
  {
    value: 'system',
    label: 'system',
    description: 'match your device setting',
    icon: MobileProgramming,
  },
  { value: 'light', label: 'light', description: '', icon: Sun1 },
  { value: 'dark', label: 'dark', description: '', icon: Moon },
];

export default function ThemeScreen() {
  const router = useRouter();
  const pref = useThemeStore((s) => s.pref);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">theme</Text>
        <View className="size-7" />
      </View>

      <View className="px-6 pt-4">
        {OPTIONS.map((opt) => {
          const selected = pref === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                if (selected) return;
                haptics.selection();
                void setTheme(opt.value);
              }}
              className={cn(
                'mt-3 flex-row items-center gap-3 rounded-2xl border px-4 py-4 active:opacity-80',
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-border/60',
              )}
            >
              <Icon
                as={opt.icon}
                className={cn(
                  'size-6',
                  selected ? 'text-primary' : 'text-muted-foreground',
                )}
              />
              <View className="flex-1">
                <Text className="text-foreground text-base font-medium">
                  {opt.label}
                </Text>
                {opt.description ? (
                  <Text className="text-muted-foreground text-sm">
                    {opt.description}
                  </Text>
                ) : null}
              </View>
              {selected ? (
                <Icon as={TickCircle} className="text-primary size-6" />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
