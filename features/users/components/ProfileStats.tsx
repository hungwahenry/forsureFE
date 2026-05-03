import { Text } from '@/components/ui/text';
import { View } from 'react-native';

export interface StatEntry {
  value: number;
  label: string;
}

interface ProfileStatsProps {
  stats: StatEntry[];
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <View className="border-border/40 flex-row border-y px-6 py-4">
      {stats.map((stat, i) => (
        <View
          key={stat.label}
          className={`flex-1 items-center ${i > 0 ? 'border-border/40 border-l' : ''}`}
        >
          <Text className="text-foreground text-xl font-bold">{stat.value}</Text>
          <Text className="text-muted-foreground mt-0.5 text-xs">
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
