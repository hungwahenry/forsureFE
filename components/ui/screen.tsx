import { cn } from '@/lib/utils';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Edge = 'top' | 'bottom';

interface ScreenProps {
  children: React.ReactNode;
  /** Safe-area edges to pad. Pass `[]` for full-bleed content. */
  edges?: Edge[];
  noKeyboardAvoidance?: boolean;
  className?: string;
  style?: ViewStyle;
}

const DEFAULT_EDGES: Edge[] = ['top', 'bottom'];

export function Screen({
  children,
  edges = DEFAULT_EDGES,
  noKeyboardAvoidance,
  className,
  style,
}: ScreenProps) {
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    flex: 1,
    paddingTop: edges.includes('top') ? insets.top : 0,
    ...style,
  };

  const content = noKeyboardAvoidance ? (
    <View style={{ flex: 1, paddingBottom: edges.includes('bottom') ? insets.bottom : 0 }}>
      {children}
    </View>
  ) : (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={edges.includes('top') ? insets.top : 0}
    >
      <View style={{ flex: 1, paddingBottom: edges.includes('bottom') ? insets.bottom : 0 }}>
        {children}
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={containerStyle} className={cn('bg-background', className)}>
      {content}
    </View>
  );
}
