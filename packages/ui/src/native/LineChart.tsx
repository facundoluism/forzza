import { View, type ViewProps } from "react-native";
import { colors } from "../tokens";

export interface LineChartProps extends Omit<ViewProps, "style"> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
  style?: ViewProps["style"];
}

export function LineChart({
  data,
  width = 200,
  height = 60,
  color = colors.lime,
  showDots = false,
  style,
  ...rest
}: LineChartProps) {
  if (data.length < 2) {
    return <View style={[{ width, height }, style]} {...rest} />;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;

  const points = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (width - pad * 2),
    y: pad + (1 - (v - min) / range) * (height - pad * 2),
  }));

  const segments = points.slice(0, -1).map((pt, i) => {
    const next = points[i + 1]!;
    const dx = next.x - pt.x;
    const dy = next.y - pt.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return { x: pt.x, y: pt.y, length, angle };
  });

  return (
    <View
      style={[{ width, height, position: "relative", overflow: "hidden" }, style]}
      {...rest}
    >
      {segments.map((seg, i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            left: seg.x,
            top: seg.y - 1,
            width: seg.length,
            height: 2,
            backgroundColor: color,
            borderRadius: 1,
            transform: [{ rotate: `${seg.angle}deg` }],
            transformOrigin: "0 50%",
          }}
        />
      ))}
      {showDots &&
        points.map((pt, i) => (
          <View
            key={i}
            style={{
              position: "absolute",
              left: pt.x - 3,
              top: pt.y - 3,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: color,
            }}
          />
        ))}
    </View>
  );
}
