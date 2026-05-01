import Svg, { Path } from 'react-native-svg';

interface BubbleTailProps {
  color: string;
  side: 'left' | 'right';
}

const SIZE = 14;

const RIGHT_PATH = `M0 0 C0 8 4 14 14 14 C8 12 4 8 4 0 Z`;
const LEFT_PATH = `M14 0 C14 8 10 14 0 14 C6 12 10 8 10 0 Z`;

export function BubbleTail({ color, side }: BubbleTailProps) {
  return (
    <Svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      style={{
        position: 'absolute',
        bottom: 0,
        [side === 'right' ? 'right' : 'left']: -SIZE + 4,
      }}
    >
      <Path d={side === 'right' ? RIGHT_PATH : LEFT_PATH} fill={color} />
    </Svg>
  );
}
