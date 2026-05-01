import { LoadingIndicator } from '@/components/ui/loading-indicator';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import type { ChatMessage } from '../../types';
import { MessageBubble } from '../bubble/MessageBubble';
import { MessageSeparator } from './MessageSeparator';

interface MessageListProps {
  messages: ChatMessage[];
  viewerUserId: string;
  hostUserId: string;
  isFetchingOlder: boolean;
  onEndReached: () => void;
  onReply: (m: ChatMessage) => void;
  onDelete: (m: ChatMessage) => void;
  onRetry: (m: ChatMessage) => void;
  onCancel: (m: ChatMessage) => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function MessageList({
  messages,
  viewerUserId,
  hostUserId,
  isFetchingOlder,
  onEndReached,
  onReply,
  onDelete,
  onRetry,
  onCancel,
}: MessageListProps) {
  return (
    <FlatList
      data={messages}
      inverted
      keyExtractor={(m) => m.id}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item, index }) => {
        const isOwn = item.sender.id === viewerUserId;
        const canDelete = isOwn || viewerUserId === hostUserId;
        // List is inverted; index+1 is the older message in time.
        const older = messages[index + 1];
        const itemDate = new Date(item.createdAt);
        const showSeparator =
          !older || !isSameDay(new Date(older.createdAt), itemDate);
        return (
          <>
            <MessageBubble
              message={item}
              isOwn={isOwn}
              canDelete={canDelete}
              onReply={() => onReply(item)}
              onDelete={() => onDelete(item)}
              onRetry={() => onRetry(item)}
              onCancel={() => onCancel(item)}
            />
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
