import { LoadingIndicator } from '@/components/ui/loading-indicator';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  viewerUserId: string;
  hostUserId: string;
  isFetchingOlder: boolean;
  onEndReached: () => void;
  onReply: (m: ChatMessage) => void;
  onDelete: (m: ChatMessage) => void;
}

export function MessageList({
  messages,
  viewerUserId,
  hostUserId,
  isFetchingOlder,
  onEndReached,
  onReply,
  onDelete,
}: MessageListProps) {
  return (
    <FlatList
      data={messages}
      inverted
      keyExtractor={(m) => m.id}
      contentContainerStyle={{ paddingVertical: 12 }}
      renderItem={({ item }) => {
        const isOwn = item.sender.id === viewerUserId;
        const canDelete = isOwn || viewerUserId === hostUserId;
        return (
          <MessageBubble
            message={item}
            isOwn={isOwn}
            canDelete={canDelete}
            onReply={() => onReply(item)}
            onDelete={() => onDelete(item)}
          />
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
