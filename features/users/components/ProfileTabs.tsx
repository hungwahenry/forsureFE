import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

export interface ProfileTabOption<T extends string> {
  value: T;
  label: string;
}

interface ProfileTabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: ProfileTabOption<T>[];
}

export function ProfileTabs<T extends string>({
  value,
  onChange,
  options,
}: ProfileTabsProps<T>) {
  return (
    <View className="flex-row">
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={`flex-1 items-center border-b-2 py-3 ${
              active ? 'border-primary' : 'border-border/40'
            }`}
          >
            <Text
              className={
                active
                  ? 'text-foreground text-sm font-semibold'
                  : 'text-muted-foreground text-sm'
              }
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
