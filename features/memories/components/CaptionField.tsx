import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { View } from 'react-native';
import { POST_CAPTION_MAX } from '../hooks/useComposePost';

interface CaptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function CaptionField({ value, onChange }: CaptionFieldProps) {
  return (
    <View className="mb-4 gap-1">
      <Text className="text-muted-foreground text-xs">caption (optional)</Text>
      <Textarea
        value={value}
        onChangeText={(t) => onChange(t.slice(0, POST_CAPTION_MAX))}
        placeholder="say something about this hangout"
        autoCapitalize="sentences"
      />
      <Text className="text-muted-foreground text-right text-[10px]">
        {value.length}/{POST_CAPTION_MAX}
      </Text>
    </View>
  );
}
