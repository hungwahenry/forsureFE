import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import {
  BIO_MAX,
  NAME_MAX,
  useEditProfileForm,
} from '@/features/account/hooks/useEditProfileForm';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, Location, Refresh } from 'iconsax-react-nativejs';
import { Pressable, ScrollView, View } from 'react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const form = useEditProfileForm();

  const onSave = async () => {
    const ok = await form.save();
    if (ok) router.back();
  };

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          edit profile
        </Text>
        <Pressable
          onPress={() => void onSave()}
          hitSlop={8}
          disabled={!form.dirty || form.isSaving}
        >
          <Text
            className={
              form.dirty && !form.isSaving
                ? 'text-primary text-sm font-semibold'
                : 'text-muted-foreground/50 text-sm font-semibold'
            }
          >
            save
          </Text>
        </Pressable>
      </View>

      {form.isPending || !form.profile ? (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator size={10} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center pt-6">
            <Pressable
              onPress={() => void form.pickAndUploadAvatar()}
              hitSlop={6}
            >
              <Image
                source={{ uri: form.profile.avatarUrl }}
                style={{ width: 120, height: 120, borderRadius: 60 }}
                className="bg-muted"
              />
              {form.isUploadingAvatar ? (
                <View
                  style={{
                    position: 'absolute',
                    inset: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    borderRadius: 60,
                  }}
                >
                  <LoadingIndicator color="white" size={8} />
                </View>
              ) : null}
            </Pressable>
            <Pressable
              onPress={() => void form.pickAndUploadAvatar()}
              hitSlop={8}
              disabled={form.isUploadingAvatar}
              className="mt-3"
            >
              <Text className="text-primary text-sm font-medium">
                change photo
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 px-6">
            <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              display name
            </Text>
            <View className="mt-2">
              <Input
                value={form.displayName}
                onChangeText={form.setDisplayName}
                placeholder="your name"
                autoCapitalize="words"
              />
            </View>
            <Text className="text-muted-foreground mt-1 text-right text-xs">
              {form.displayName.length}/{NAME_MAX}
            </Text>
          </View>

          <View className="mt-4 px-6">
            <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              bio
            </Text>
            <View className="mt-2">
              <Textarea
                value={form.bio}
                onChangeText={form.setBio}
                placeholder="tell people what you're about"
                autoCapitalize="sentences"
              />
            </View>
            <Text className="text-muted-foreground mt-1 text-right text-xs">
              {form.bio.length}/{BIO_MAX}
            </Text>
          </View>

          <View className="mt-4 px-6">
            <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              location
            </Text>
            <Pressable
              onPress={() => void form.useCurrentLocation()}
              disabled={form.isFetchingLocation}
              className="border-input bg-background mt-2 flex-row items-center gap-3 rounded-md border px-3 py-3 active:bg-muted/30"
            >
              <Icon as={Location} className="text-muted-foreground size-5" />
              <Text
                className="text-foreground flex-1 text-base"
                numberOfLines={1}
              >
                {form.location?.placeName ?? form.profile.place.name}
              </Text>
              <Icon
                as={Refresh}
                className={
                  form.isFetchingLocation
                    ? 'text-muted-foreground/50 size-5'
                    : 'text-primary size-5'
                }
              />
            </Pressable>
            <Text className="text-muted-foreground mt-1 text-xs">
              tap to use your current location.
            </Text>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
