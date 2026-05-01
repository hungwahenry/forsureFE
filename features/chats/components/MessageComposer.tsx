import { Icon } from '@/components/ui/icon';
import { Textarea } from '@/components/ui/textarea';
import { pickFreeformFromLibrary } from '@/lib/permissions/imagePicker';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { Camera, Send } from 'iconsax-react-nativejs';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import type { ChatMessage } from '../types';
import { PendingImagePreview } from './PendingImagePreview';
import { ReplyPreview } from './ReplyPreview';

export interface PendingImage {
  uri: string;
  mimeType: string;
}

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
  const [image, setImage] = React.useState<PendingImage | null>(null);

  const canSend = !disabled && (body.trim().length > 0 || image != null);

  const handlePickImage = async () => {
    const result = await pickFreeformFromLibrary();
    if (result.status === 'denied') {
      toast.error('photo library access denied');
      return;
    }
    if (result.status !== 'picked') return;
    setImage({
      uri: result.asset.uri,
      mimeType: result.asset.mimeType ?? 'image/jpeg',
    });
  };

  const handleSend = async () => {
    if (!canSend) return;
    await onSend({
      body: body.trim() || undefined,
      image: image ?? undefined,
    });
    setBody('');
    setImage(null);
  };

  return (
    <View>
      {replyTarget ? (
        <ReplyPreview target={replyTarget} onClear={onClearReply} />
      ) : null}
      {image ? (
        <PendingImagePreview uri={image.uri} onClear={() => setImage(null)} />
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
        <Textarea
          value={body}
          onChangeText={setBody}
          placeholder="message"
          placeholderClassName="text-muted-foreground/50"
          numberOfLines={1}
          editable={!disabled}
          textAlignVertical="center"
          className="bg-muted/60 text-foreground min-h-10 max-h-32 min-w-0 flex-1 items-center rounded-3xl border-0 px-4 py-2 text-base leading-5 shadow-none"
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
