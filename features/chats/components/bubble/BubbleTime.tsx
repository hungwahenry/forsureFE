import { Text } from '@/components/ui/text';
import { formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';

interface BubbleTimeProps {
  createdAt: string;
  isOwn: boolean;
  hasImage: boolean;
  hasBody: boolean;
}

export function BubbleTime({
  createdAt,
  isOwn,
  hasImage,
  hasBody,
}: BubbleTimeProps) {
  return (
    <Text
      className={cn(
        'text-right text-[10px]',
        isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground',
        hasImage
          ? hasBody
            ? 'px-2 pb-0.5'
            : 'px-2 pb-0.5 pt-1'
          : '-mb-0.5 mt-0.5',
      )}
    >
      {formatTime(new Date(createdAt))}
    </Text>
  );
}
