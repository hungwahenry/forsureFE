import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowRight2,
  Brush,
  Document,
  Edit2,
  ExportSquare,
  InfoCircle,
  MessageQuestion,
  Notification,
  Sms,
  Trash,
  type Icon as IconsaxIcon,
  UserMinus,
  Vibe,
} from 'iconsax-react-nativejs';
import { Pressable, ScrollView, View } from 'react-native';

const stub = () => toast('coming soon');

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, isPending: signingOut } = useSignOut();
  const version = Constants.expoConfig?.version ?? '—';

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
          <Row icon={Brush} label="theme" onPress={stub} />
          <Row icon={Vibe} label="haptics" onPress={stub} />
        </Section>

        <Section title="account">
          <Row icon={Sms} label="email" onPress={stub} />
          <Row icon={ExportSquare} label="export my data" onPress={stub} />
          <Row
            icon={Trash}
            label="delete account"
            destructive
            onPress={() => router.push('/delete-account' as never)}
          />
        </Section>

        <Section title="about">
          <Row icon={Document} label="privacy policy" onPress={stub} />
          <Row icon={Document} label="terms of service" onPress={stub} />
          <Row icon={MessageQuestion} label="help & contact" onPress={stub} />
          <View className="border-border/40 flex-row items-center gap-3 border-b px-6 py-4">
            <Icon as={InfoCircle} className="text-muted-foreground size-5" />
            <Text className="text-foreground flex-1 text-base">version</Text>
            <Text className="text-muted-foreground text-sm">{version}</Text>
          </View>
        </Section>

        <View className="mt-10 px-6">
          <Pressable
            onPress={() => void signOut()}
            disabled={signingOut}
            className="bg-destructive/10 items-center rounded-2xl py-4 active:opacity-80"
          >
            <Text className="text-destructive font-semibold">sign out</Text>
          </Pressable>
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
      onPress={onPress}
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
