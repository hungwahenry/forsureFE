import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { CloseCircle, SearchNormal1 } from 'iconsax-react-nativejs';
import { Pressable } from 'react-native';

interface PlaceSearchBarProps {
  value: string;
  onChangeText: (next: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
}

export function PlaceSearchBar({
  value,
  onChangeText,
  onClear,
  autoFocus,
}: PlaceSearchBarProps) {
  return (
    <Input
      placeholder="search for a place..."
      value={value}
      onChangeText={onChangeText}
      autoFocus={autoFocus}
      autoCapitalize="words"
      autoCorrect={false}
      returnKeyType="search"
      leftIcon={
        <Icon as={SearchNormal1} className="text-muted-foreground size-5" />
      }
      rightIcon={
        value.length > 0 ? (
          <Pressable onPress={onClear} hitSlop={8}>
            <Icon
              as={CloseCircle}
              variant="Bold"
              className="text-muted-foreground size-5"
            />
          </Pressable>
        ) : undefined
      }
    />
  );
}
