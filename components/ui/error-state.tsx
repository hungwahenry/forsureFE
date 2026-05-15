import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Text } from '@/components/ui/text';
import { Danger } from 'iconsax-react-nativejs';

interface ErrorStateProps {
  title?: string;
  subtitle?: string;
  retryLabel?: string;
  onRetry: () => void;
}

/** Shown when a screen's data fails to load — pairs a message with a retry. */
export function ErrorState({
  title = 'something went wrong',
  subtitle = 'check your connection and try again.',
  retryLabel = 'retry',
  onRetry,
}: ErrorStateProps) {
  return (
    <EmptyState
      icon={Danger}
      title={title}
      subtitle={subtitle}
      actions={
        <Button onPress={onRetry} size="lg">
          <Text>{retryLabel}</Text>
        </Button>
      }
    />
  );
}
