import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { VersionRow } from '@/features/settings/components/VersionRow';
import { haptics } from '@/lib/haptics';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight2,
  Brush,
  Document,
  Edit2,
  ExportSquare,
  MessageQuestion,
  Notification,
  Sms,
  Trash,
  type Icon as IconsaxIcon,
  UserMinus,
  Vibe,
} from 'iconsax-react-nativejs';
import { Linking, Pressable, ScrollView, View } from 'react-native';

const openExternal = (url: string) => {
  void Linking.openURL(url).catch(() => toast.error("couldn't open link."));
};

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, isPending: signingOut } = useSignOut();

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Icon as={ArrowLeft} className="text-muted-foreground size-7" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">settings</Text>
        <View className="size-7" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
        <Section title="profile">
          <Row
            icon={Edit2}
            label="edit profile"
            onPress={() => router.push('/edit-profile' as never)}
          />
        </Section>

        <Section title="notifications">
          <Row
            icon={Notification}
            label="notifications"
            onPress={() => router.push('/notification-preferences' as never)}
          />
        </Section>

        <Section title="privacy & safety">
          <Row
            icon={UserMinus}
            label="blocked users"
            onPress={() => router.push('/blocked-users' as never)}
          />
        </Section>

        <Section title="appearance">
          <Row
            icon={Brush}
            label="theme"
            onPress={() => router.push('/theme' as never)}
          />
          <Row
            icon={Vibe}
            label="haptics"
            onPress={() => router.push('/haptics' as never)}
          />
        </Section>

        <Section title="account">
          <Row
            icon={Sms}
            label="email"
            onPress={() => router.push('/change-email' as never)}
          />
          <Row
            icon={ExportSquare}
            label="export my data"
            onPress={() => router.push('/data-export' as never)}
          />
          <Row
            icon={Trash}
            label="delete account"
            destructive
            onPress={() => router.push('/delete-account' as never)}
          />
        </Section>

        <Section title="about">
          <Row
            icon={Document}
            label="privacy policy"
            onPress={() => openExternal('https://forsure.fyi/privacy')}
          />
          <Row
            icon={Document}
            label="terms of service"
            onPress={() => openExternal('https://forsure.fyi/terms')}
          />
          <Row
            icon={MessageQuestion}
            label="help & contact"
            onPress={() => openExternal('https://forsure.fyi/help')}
          />
          <VersionRow onUnlock={() => router.push('/credits' as never)} />
        </Section>

        <View className="mt-10 px-6">
          <Button
            onPress={() => void signOut()}
            disabled={signingOut}
            variant="destructive"
            size="lg"
          >
            <Text>sign out</Text>
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mt-6">
      <Text className="text-muted-foreground px-6 pb-2 text-xs font-semibold uppercase tracking-wider">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: IconsaxIcon;
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        haptics.tap();
        onPress();
      }}
      className="border-border/40 flex-row items-center gap-3 border-b px-6 py-4 active:bg-muted/30"
    >
      <Icon
        as={icon}
        className={cn(
          'size-5',
          destructive ? 'text-destructive' : 'text-muted-foreground',
        )}
      />
      <Text
        className={cn(
          'flex-1 text-base',
          destructive ? 'text-destructive' : 'text-foreground',
        )}
      >
        {label}
      </Text>
      <Icon as={ArrowRight2} className="text-muted-foreground size-4" />
    </Pressable>
  );
}
