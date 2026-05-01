import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { MESSAGE_MAX_LENGTH, messageBodySchema } from '../../validation/schemas';
import { Camera, Send } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import type { ChatMessage, PendingImage } from '../../types';
import { useMessageImagePicker } from '../../hooks/useMessageImagePicker';
import { PendingImagePreview } from './PendingImagePreview';
import { ReplyPreview } from './ReplyPreview';
export type { PendingImage } from '../../types';

const LINE_HEIGHT = 20; // leading-5
const V_PADDING = 16;   // py-2 top + bottom
const MIN_INPUT_HEIGHT = LINE_HEIGHT + V_PADDING;     // 1 line  = 36px
const MAX_INPUT_HEIGHT = LINE_HEIGHT * 3 + V_PADDING; // 3 lines = 76px

interface MessageComposerProps {
  replyTarget: ChatMessage | null;
  onClearReply: () => void;
  onSend: (input: { body?: string; image?: PendingImage }) => Promise<void>;
  disabled?: boolean;
}

export function MessageComposer({
  replyTarget,
  onClearReply,
  onSend,
  disabled,
}: MessageComposerProps) {
  const [body, setBody] = React.useState('');
  const { image, pick: handlePickImage, clearImage } = useMessageImagePicker();

  const bodyValid = image != null || messageBodySchema.safeParse(body).success;
  const canSend = !disabled && bodyValid;

  const handleSend = async () => {
    if (!canSend) return;
    const payload = {
      body: body.trim() || undefined,
      image: image ?? undefined,
    };
    setBody('');
    clearImage();
    await onSend(payload);
  };

  const overLimit = body.length > MESSAGE_MAX_LENGTH;
  const nearLimit = body.length >= MESSAGE_MAX_LENGTH - 100;

  return (
    <View>
      {nearLimit ? (
        <Text
          className={cn(
            'px-4 pb-1 text-right text-xs',
            overLimit ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          {body.length}/{MESSAGE_MAX_LENGTH}
        </Text>
      ) : null}
      {replyTarget ? (
        <ReplyPreview target={replyTarget} onClear={onClearReply} />
      ) : null}
      {image ? (
        <PendingImagePreview uri={image.uri} onClear={clearImage} />
      ) : null}
      <View className="border-border/40 bg-background flex-row items-end gap-2 border-t px-4 py-2">
        <Pressable
          onPress={handlePickImage}
          hitSlop={8}
          className="size-10 items-center justify-center"
          disabled={disabled}
        >
          <Icon as={Camera} className="text-muted-foreground size-6" />
        </Pressable>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="message"
          placeholderTextColor="rgba(128,128,128,0.5)"
          multiline
          scrollEnabled={false}
          autoCapitalize="none"
          editable={!disabled}
          textAlignVertical="top"
          style={{ minHeight: MIN_INPUT_HEIGHT, maxHeight: MAX_INPUT_HEIGHT }}
          className="bg-muted/60 text-foreground font-sans min-w-0 flex-1 rounded-3xl px-4 py-2 text-base leading-5"
        />
        <Pressable
          onPress={() => void handleSend()}
          disabled={!canSend}
          hitSlop={8}
          className="size-10 items-center justify-center"
        >
          <View
            className={cn(
              'size-9 items-center justify-center rounded-full',
              canSend ? 'bg-primary' : 'bg-muted',
            )}
          >
            <Icon
              as={Send}
              className={cn(
                'size-4',
                canSend
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground',
              )}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
}
