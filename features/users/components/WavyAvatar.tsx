import { THEME } from '@/lib/theme';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';
import Svg, {
  ClipPath,
  Defs,
  Image as SvgImage,
  Path,
} from 'react-native-svg';

interface WavyAvatarProps {
  uri: string;
  /** Diameter of the inner image circle (before the wavy edge). */
  size?: number;
}

const PADDING = 10;
const BUMPS = 12;
const AMPLITUDE = 4;
const RING_THICKNESS = 5;
const STEPS = 200;

/** Closed path tracing a sinusoidal wavy circle. */
function wavyCirclePath(cx: number, cy: number, baseR: number): string {
  let d = '';
  for (let i = 0; i <= STEPS; i++) {
    const angle = (i / STEPS) * Math.PI * 2;
    const r = baseR + AMPLITUDE * Math.sin(angle * BUMPS);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return `${d}Z`;
}

export function WavyAvatar({ uri, size = 128 }: WavyAvatarProps) {
  const { colorScheme } = useColorScheme();
  const colors = THEME[colorScheme === 'dark' ? 'dark' : 'light'];
  const total = size + PADDING * 2;
  const cx = total / 2;
  const cy = total / 2;
  const innerR = size / 2;
  const outerR = innerR + RING_THICKNESS;

  const outerPath = React.useMemo(
    () => wavyCirclePath(cx, cy, outerR),
    [cx, cy, outerR],
  );
  const innerPath = React.useMemo(
    () => wavyCirclePath(cx, cy, innerR),
    [cx, cy, innerR],
  );

  return (
    <View style={{ width: total, height: total }}>
      <Svg width={total} height={total}>
        <Defs>
          <ClipPath id="wavy-image-clip">
            <Path d={innerPath} />
          </ClipPath>
        </Defs>
        {/* Wavy donut: outer wavy edge filled, inner wavy hole clipped via even-odd. */}
        <Path
          d={`${outerPath} ${innerPath}`}
          fill={colors.primary}
          fillRule="evenodd"
        />
        <SvgImage
          href={uri}
          x={cx - (innerR + AMPLITUDE)}
          y={cy - (innerR + AMPLITUDE)}
          width={(innerR + AMPLITUDE) * 2}
          height={(innerR + AMPLITUDE) * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#wavy-image-clip)"
        />
      </Svg>
    </View>
  );
}
