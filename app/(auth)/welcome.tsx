import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { ArrowRight } from 'iconsax-react-nativejs';
import { View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <Screen noKeyboardAvoidance>
      <View className="flex-1 justify-between p-6">
        {/* Spacer / hero space — when we add an illustration it sits here */}
        <View className="flex-1" />

        <View className="gap-3 pb-12">
          <Text className="text-foreground text-7xl font-bold tracking-tight">
            forsure
          </Text>
          <Text className="text-muted-foreground text-2xl leading-snug">
            find someone to do anything.
          </Text>
        </View>

        <View className="gap-3">
          <Link href="/email" asChild>
            <Button
              size="lg"
              rightIcon={
                <Icon
                  as={ArrowRight}
                  className="text-primary-foreground size-5"
                />
              }
            >
              <Text>get started</Text>
            </Button>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
