import { Text } from '@/components/ui/text';
import { AnimatePresence, MotiView } from 'moti';
import * as React from 'react';
import { View } from 'react-native';

const ACTIVITIES = [
  { emoji: '☕', label: 'grab coffee' },
  { emoji: '🎾', label: 'play tennis' },
  { emoji: '🎬', label: 'catch a movie' },
  { emoji: '🥾', label: 'go for a hike' },
  { emoji: '🍜', label: 'get ramen' },
  { emoji: '🫖', label: 'try pottery' },
  { emoji: '🎨', label: 'paint a sunset' },
  { emoji: '🍲', label: 'eat jollof rice' },
  { emoji: '🥩', label: 'get suya' },
  { emoji: '🏖️', label: 'visit Tarkwa Bay' },
  { emoji: '🎶', label: 'go to an afrobeats concert' },
  { emoji: '🛶', label: 'boat ride in Lagos' },
  { emoji: '🍢', label: 'eat boli and fish' },
  { emoji: '🏀', label: 'play basketball outdoors' },
  { emoji: '🎤', label: 'do karaoke night' },
  { emoji: '🌆', label: 'watch the Lagos sunset' },
  { emoji: '🍹', label: 'get mocktails at a rooftop lounge' },
  { emoji: '🎮', label: 'visit a gaming arcade' },
  { emoji: '🚗', label: 'go for a late night drive' },
  { emoji: '🍗', label: 'try spicy wings' },
  { emoji: '🗼', label: 'visit the Eiffel Tower' },
  { emoji: '🛵', label: 'ride scooters through Bali' },
  { emoji: '🏔️', label: 'explore the Swiss Alps' },
  { emoji: '🍕', label: 'eat pizza in Naples' },
  { emoji: '🍣', label: 'try sushi in Tokyo' },
  { emoji: '🚤', label: 'island hop in Greece' },
  { emoji: '🌃', label: 'walk through Times Square' },
  { emoji: '🕌', label: 'explore Istanbul markets' },
  { emoji: '🏜️', label: 'ride camels in Dubai' },
  { emoji: '🎡', label: 'visit Disneyland' },
  { emoji: '🚞', label: 'take a scenic train ride' },
  { emoji: '🏕️', label: 'camp under the stars' },
  { emoji: '🌌', label: 'go stargazing' },
  { emoji: '🎢', label: 'ride rollercoasters' },
  { emoji: '🛹', label: 'go skateboarding' },
  { emoji: '🚴', label: 'cycle around the city' },
  { emoji: '🏄', label: 'learn to surf' },
  { emoji: '🤿', label: 'go snorkeling' },
  { emoji: '🎳', label: 'go bowling' },
  { emoji: '🧗', label: 'try rock climbing' },
  { emoji: '🏹', label: 'do archery' },
  { emoji: '🎯', label: 'play darts' },
  { emoji: '♟️', label: 'play chess in the park' },
  { emoji: '📸', label: 'go on a photo walk' },
  { emoji: '📚', label: 'visit a bookstore' },
  { emoji: '🧋', label: 'get bubble tea' },
  { emoji: '🍦', label: 'eat ice cream by the beach' },
  { emoji: '🥞', label: 'have brunch together' },
  { emoji: '🍿', label: 'host a movie marathon' },
  { emoji: '🎵', label: 'listen to vinyl records' },
  { emoji: '🎹', label: 'learn piano together' },
  { emoji: '🎸', label: 'jam with guitars' },
  { emoji: '🕺', label: 'go dancing' },
  { emoji: '💃', label: 'take salsa lessons' },
  { emoji: '🧩', label: 'solve puzzles together' },
  { emoji: '🎲', label: 'play board games' },
  { emoji: '🛍️', label: 'go thrift shopping' },
  { emoji: '🏞️', label: 'visit a waterfall' },
  { emoji: '🌳', label: 'picnic at the park' },
  { emoji: '🚁', label: 'take a helicopter tour' },
  { emoji: '⛸️', label: 'go ice skating' },
  { emoji: '🎿', label: 'try skiing' },
  { emoji: '🏊', label: 'go swimming' },
  { emoji: '🚣', label: 'go kayaking' },
  { emoji: '🌮', label: 'try street tacos' },
  { emoji: '🥟', label: 'eat dumplings in Chinatown' },
  { emoji: '🍰', label: 'visit a dessert cafe' },
  { emoji: '☔', label: 'walk in the rain' },
  { emoji: '🌠', label: 'watch a meteor shower' },
  { emoji: '🎆', label: 'watch fireworks' },
  { emoji: '🧳', label: 'take a spontaneous trip' },
  { emoji: '🏝️', label: 'relax on a tropical beach' },
  { emoji: '🚠', label: 'ride a cable car' },
  { emoji: '🪁', label: 'fly kites at the beach' },
  { emoji: '🍔', label: 'try a new burger spot' },
  { emoji: '🥘', label: 'cook dinner together' },
  { emoji: '🌅', label: 'watch the sunrise' },
];

const INTERVAL = 2200;

/** "find someone to ☕ grab coffee" — the activity line cycles. */
export function WelcomeTagline() {
  const [index, setIndex] = React.useState(() =>
    Math.floor(Math.random() * ACTIVITIES.length),
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => {
        let next = current;
        while (next === current) {
          next = Math.floor(Math.random() * ACTIVITIES.length);
        }
        return next;
      });
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const activity = ACTIVITIES[index];

  return (
    <View>
      <Text className="text-muted-foreground text-center text-2xl leading-snug">
        find someone to
      </Text>
      <View style={{ height: 38, justifyContent: 'center' }}>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={index}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -6 }}
            transition={{ type: 'timing', duration: 280 }}
          >
            <Text
              className="text-foreground text-center text-2xl font-semibold"
              style={{ lineHeight: 32 }}
            >
              {activity.emoji} {activity.label}
            </Text>
          </MotiView>
        </AnimatePresence>
      </View>
    </View>
  );
}
