import {
  Fredoka_300Light,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';
import { useFonts } from 'expo-font';

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
