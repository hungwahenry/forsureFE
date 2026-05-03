import {
  Fredoka_300Light,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { useFonts } from 'expo-font';
import { StyleSheet, type StyleProp, type TextStyle } from 'react-native';

export const FONTS = {
  light: 'Brand-Light',
  regular: 'Brand-Regular',
  medium: 'Brand-Medium',
  semibold: 'Brand-SemiBold',
  bold: 'Brand-Bold',
} as const;

export const FONTS_BY_WEIGHT: Record<string, string> = {
  '300': FONTS.light,
  '400': FONTS.regular,
  normal: FONTS.regular,
  '500': FONTS.medium,
  '600': FONTS.semibold,
  '700': FONTS.bold,
  bold: FONTS.bold,
};

export function useBrandFonts(): boolean {
  const [loaded] = useFonts({
    [FONTS.light]: Fredoka_300Light,
    [FONTS.regular]: Fredoka_400Regular,
    [FONTS.medium]: Fredoka_500Medium,
    [FONTS.semibold]: Fredoka_600SemiBold,
    [FONTS.bold]: Fredoka_700Bold,
  });
  return loaded;
}

const WEIGHT_CLASS_TO_KEY: Record<string, string> = {
  'font-light': '300',
  'font-medium': '500',
  'font-semibold': '600',
  'font-bold': '700',
};

function detectWeightFromClassName(className?: string): string | null {
  if (!className) return null;
  for (const cls of className.split(/\s+/)) {
    const w = WEIGHT_CLASS_TO_KEY[cls];
    if (w) return w;
  }
  return null;
}

export function resolveFontFamily(
  className: string | undefined,
  style: StyleProp<TextStyle>,
): string {
  const flat = StyleSheet.flatten(style);
  if (flat?.fontFamily) return flat.fontFamily as string;
  const weightFromStyle = flat?.fontWeight;
  const weightFromClass = detectWeightFromClassName(className);
  const key = String(weightFromStyle ?? weightFromClass ?? '400');
  return FONTS_BY_WEIGHT[key] ?? FONTS.regular;
}
