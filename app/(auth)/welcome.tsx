import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { WelcomeCollage } from '@/features/auth/components/WelcomeCollage';
import { WelcomeTagline } from '@/features/auth/components/WelcomeTagline';
import { Link } from 'expo-router';
import { ArrowRight } from 'iconsax-react-nativejs';
import { View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <Screen noKeyboardAvoidance edges={['bottom']}>
      <View className="flex-1">
        <WelcomeCollage />

        <View className="gap-6 px-6 pb-12">
          <View className="gap-1.5">
            <Text className="text-foreground text-center text-7xl font-bold tracking-tight">
              forsure
            </Text>
            <WelcomeTagline />
          </View>

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
              <Text>jump in</Text>
            </Button>
          </Link>
        </View>
      </View>
    </Screen>
  );
}
