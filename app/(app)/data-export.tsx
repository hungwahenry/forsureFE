import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useDataExport } from '@/features/account/hooks/useDataExport';
import { useConfigNumber } from '@/features/config/hooks/useConfigNumber';
import { useMyProfile } from '@/features/users/api/getMyProfile';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ExportSquare,
  TickCircle,
} from 'iconsax-react-nativejs';
import { Pressable, View } from 'react-native';

export default function DataExportScreen() {
  const router = useRouter();
  const profile = useMyProfile();
  const flow = useDataExport();
  const ttlHours = useConfigNumber('account.export_download_ttl_hours', 24);

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          export my data
        </Text>
        <View className="size-7" />
      </View>

      {flow.step === 'idle' ? (
        <View className="flex-1 px-6 pt-8">
          <View className="bg-primary/10 size-16 items-center justify-center rounded-full">
            <Icon as={ExportSquare} className="text-primary size-8" />
          </View>
          <Text className="text-foreground mt-6 text-2xl font-bold">
            download a copy of your data
          </Text>
          <Text className="text-muted-foreground mt-2 text-base leading-6">
            we'll prepare a json file with your profile, activities, messages
            you sent, memories you posted, and your settings.
          </Text>
          <Text className="text-muted-foreground mt-4 text-base leading-6">
            when it's ready we'll email{' '}
            {profile.data ? (
              <Text className="text-foreground">{profile.data.email}</Text>
            ) : (
              'you'
            )}{' '}
            a single-use link that expires in {ttlHours} hours.
          </Text>

          <View className="mt-auto pb-6">
            <Button
              onPress={() => void flow.onRequest()}
              disabled={flow.isRequesting}
              size="lg"
            >
              {flow.isRequesting ? (
                <LoadingIndicator color="white" />
              ) : (
                <Text>request export</Text>
              )}
            </Button>
          </View>
        </View>
      ) : (
        <View className="flex-1 px-6 pt-8">
          <View className="bg-primary/10 size-16 items-center justify-center rounded-full">
            <Icon as={TickCircle} className="text-primary size-8" />
          </View>
          <Text className="text-foreground mt-6 text-2xl font-bold">
            export requested
          </Text>
          <Text className="text-muted-foreground mt-2 text-base leading-6">
            we're packaging your data now. you'll get an email with a download
            link in a few minutes.
          </Text>
          <Text className="text-muted-foreground mt-4 text-base leading-6">
            the link works once and expires after {ttlHours} hours.
          </Text>

          <View className="mt-auto pb-6">
            <Button onPress={() => router.back()} size="lg">
              <Text>done</Text>
            </Button>
          </View>
        </View>
      )}
    </Screen>
  );
}
