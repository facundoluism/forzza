import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";
import { colors } from "../tokens";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const PARTICLE_COLORS: string[] = [
  colors.lime,
  colors.orange,
  colors.purple,
  colors.info,
  colors.error,
  colors.white,
];

const PARTICLE_COUNT = 40;

interface Particle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  rotate: Animated.Value;
  color: string;
  size: number;
  startX: number;
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const startX = Math.random() * SCREEN_W;
    return {
      x: new Animated.Value(startX),
      y: new Animated.Value(-20),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)] ?? colors.lime,
      size: 6 + Math.random() * 8,
      startX,
    };
  });
}

export interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export function Confetti({ active, duration = 2500 }: ConfettiProps) {
  const particles = useRef<Particle[]>(createParticles()).current;
  const animations = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    if (!active) return;

    // Reset all particles
    particles.forEach((p) => {
      const newX = Math.random() * SCREEN_W;
      p.x.setValue(newX);
      p.y.setValue(-20);
      p.opacity.setValue(1);
      p.rotate.setValue(0);
    });

    const anims = particles.map((p) => {
      const delay = Math.random() * (duration * 0.4);
      const fallDuration = duration * 0.6 + Math.random() * (duration * 0.4);
      const targetX = p.startX + (Math.random() - 0.5) * 200;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(p.y, {
            toValue: SCREEN_H + 40,
            duration: fallDuration,
            useNativeDriver: true,
          }),
          Animated.timing(p.x, {
            toValue: targetX,
            duration: fallDuration,
            useNativeDriver: true,
          }),
          Animated.timing(p.rotate, {
            toValue: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360),
            duration: fallDuration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.delay(fallDuration * 0.7),
            Animated.timing(p.opacity, {
              toValue: 0,
              duration: fallDuration * 0.3,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]);
    });

    animations.current = anims;
    Animated.parallel(anims).start();

    return () => {
      anims.forEach((a) => a.stop());
    };
  }, [active, duration, particles]);

  if (!active) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p, i) => {
        const rotate = p.rotate.interpolate({
          inputRange: [-720, 720],
          outputRange: ["-720deg", "720deg"],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              borderRadius: p.size * 0.2,
              backgroundColor: p.color,
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { rotate },
              ],
              opacity: p.opacity,
            }}
          />
        );
      })}
    </View>
  );
}
