import { Text } from '@/components/ui/text';
import { lightbox } from '@/lib/lightbox';
import { Image } from 'expo-image';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import { isMyProfile, type UserProfile } from '../types';

const AVATAR_SIZE = 120;

const GENDER_LABEL: Record<UserProfile['gender'], string> = {
  MALE: 'man',
  FEMALE: 'woman',
  NON_BINARY: 'non-binary',
  PREFER_NOT_TO_SAY: '',
};

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const placeName = isMyProfile(profile)
    ? profile.place.name
    : profile.placeName;
  const meta: string[] = [
    GENDER_LABEL[profile.gender],
    placeName,
  ].filter((s) => s.length > 0);

  return (
    <View className="items-center px-6 pb-4 pt-2">
      <Pressable
        onPress={() => lightbox.open([profile.avatarUrl])}
        hitSlop={6}
      >
        <Image
          source={{ uri: profile.avatarUrl }}
          className="bg-muted"
          style={{
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
          }}
        />
      </Pressable>

      <Text
        className="text-foreground mt-3 text-xl font-bold"
        numberOfLines={1}
      >
        {profile.displayName}
      </Text>
      <Text className="text-primary text-base font-medium">
        @{profile.username}
      </Text>
      <Text className="text-muted-foreground mt-1 text-xs">
        {meta.join(' · ')}
      </Text>
      {profile.bio ? (
        <Text className="text-foreground mt-2 text-center text-sm">
          {profile.bio}
        </Text>
      ) : null}
    </View>
  );
}
