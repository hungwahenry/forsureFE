import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { Pressable, View } from 'react-native';

interface PreferenceToggleProps {
  label: string;
  enabled: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}

export function PreferenceToggle({
  label,
  enabled,
  disabled,
  onChange,
}: PreferenceToggleProps) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className="border-border/40 flex-row items-center justify-between border-b px-6 py-4"
    >
      <Text className="text-foreground text-base">{label}</Text>
      <View pointerEvents="none">
        <Switch
          checked={enabled}
          disabled={disabled}
          onCheckedChange={onChange}
        />
      </View>
    </Pressable>
  );
}
