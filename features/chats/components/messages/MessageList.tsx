import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { isSameDay } from '@/lib/format';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import type { ChatMessage } from '../../types';
import { MessageBubble } from '../bubble/MessageBubble';
import { MessageSeparator } from './MessageSeparator';
import { SystemMessage } from './SystemMessage';

interface MessageListProps {
  messages: ChatMessage[];
  viewerUserId: string;
  hostUserId: string;
  viewerIsHost: boolean;
  isFetchingOlder: boolean;
  onEndReached: () => void;
  onReply: (m: ChatMessage) => void;
  onDelete: (m: ChatMessage) => void;
  onRetry: (m: ChatMessage) => void;
  onCancel: (m: ChatMessage) => void;
  onPin: (m: ChatMessage) => void;
}

export function MessageList({
  messages,
  viewerUserId,
  hostUserId,
  viewerIsHost,
  isFetchingOlder,
  onEndReached,
  onReply,
  onDelete,
  onRetry,
  onCancel,
  onPin,
}: MessageListProps) {
  return (
    <FlatList
      data={messages}
      inverted
      keyExtractor={(m) => m.id}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item, index }) => {
        const older = messages[index + 1];
        const itemDate = new Date(item.createdAt);
        const showSeparator =
          !older || !isSameDay(new Date(older.createdAt), itemDate);

        const body =
          item.kind === 'SYSTEM' ? (
            <SystemMessage body={item.body ?? ''} />
          ) : (
            (() => {
              const isOwn = item.sender.id === viewerUserId;
              const canDelete = isOwn || viewerUserId === hostUserId;
              return (
                <MessageBubble
                  message={item}
                  isOwn={isOwn}
                  canDelete={canDelete}
                  canPin={viewerIsHost}
                  onReply={() => onReply(item)}
                  onDelete={() => onDelete(item)}
                  onRetry={() => onRetry(item)}
                  onCancel={() => onCancel(item)}
                  onPin={() => onPin(item)}
                />
              );
            })()
          );

        return (
          <>
            {body}
            {showSeparator ? <MessageSeparator when={itemDate} /> : null}
          </>
        );
      }}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        isFetchingOlder ? (
          <View className="items-center py-4">
            <LoadingIndicator size={6} />
          </View>
        ) : null
      }
    />
  );
}
