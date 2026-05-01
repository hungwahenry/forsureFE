import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Lock1 } from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';
import type { PostVisibility } from '../types';

interface VisibilitySelectorProps {
  value: PostVisibility;
  onChange: (value: PostVisibility) => void;
  shareable: boolean;
}

export function VisibilitySelector({
  value,
  onChange,
  shareable,
}: VisibilitySelectorProps) {
  return (
    <View className="gap-3">
      <Text className="text-muted-foreground text-xs">visibility</Text>
      <Row
        label="just the group"
        description="only people who joined this activity can see your post."
        selected={value === 'PARTICIPANTS'}
        onPress={() => onChange('PARTICIPANTS')}
      />
      <Row
        label="share publicly"
        description={
          shareable
            ? 'this post can also appear on Explore.'
            : 'the host has not enabled public sharing for this activity.'
        }
        selected={value === 'PUBLIC'}
        disabled={!shareable}
        onPress={() => shareable && onChange('PUBLIC')}
        showLock={!shareable}
      />
    </View>
  );
}

interface RowProps {
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  showLock?: boolean;
}

function Row({
  label,
  description,
  selected,
  onPress,
  disabled,
  showLock,
}: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-start gap-3 rounded-sm py-1 ${disabled ? 'opacity-60' : ''}`}
    >
      <View
        className={`mt-1 size-4 rounded-full border ${
          selected ? 'border-primary bg-primary' : 'border-input'
        }`}
      />
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          {showLock ? (
            <Icon as={Lock1} className="text-muted-foreground size-3" />
          ) : null}
          <Text className="text-foreground text-sm">{label}</Text>
        </View>
        <Text className="text-muted-foreground text-xs">{description}</Text>
      </View>
    </Pressable>
  );
}
