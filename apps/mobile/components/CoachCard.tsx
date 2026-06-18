import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Pill } from "@forzza/ui/native";
import { colors, spacing, typography, radius, fontSize } from "@forzza/ui/tokens";

// Columnas reales de coach_packages: id, coach_id, tier, title, description, price, active
export interface CoachCardPackage {
  id: string;
  title: string;
  price: number; // entero en centavos
  tier: "starter" | "pro" | "elite";
  active: boolean;
}

export interface CoachCardData {
  id: string;
  display_name: string;
  avatar_url: string | null;
  specialties: string[];
  packages: CoachCardPackage[];
  rating?: number | null;
  ratingCount?: number;
}

interface CoachCardProps {
  coach: CoachCardData;
  currencySymbol?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function cheapestActivePrice(packages: CoachCardPackage[]): number | null {
  if (!packages || packages.length === 0) return null;
  const active = packages.filter((p) => p.active);
  if (active.length === 0) return null;
  return active.reduce(
    (min, p) => (p.price < min ? p.price : min),
    active[0]!.price
  );
}

export function CoachCard({ coach, currencySymbol = "$" }: CoachCardProps) {
  const router = useRouter();
  const initials = getInitials(coach.display_name);
  const minPrice = cheapestActivePrice(coach.packages);
  const visibleSpecialties = coach.specialties.slice(0, 3);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/marketplace/${coach.id}` as never)}
    >
      <View style={styles.card}>
        <View style={styles.row}>
          {/* Avatar circular con borde lime */}
          <View style={styles.avatarWrapper}>
            {coach.avatar_url ? (
              <Image
                source={{ uri: coach.avatar_url }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {coach.display_name}
            </Text>

            {/* Rating */}
            {typeof coach.rating === "number" && coach.rating > 0 && (
              <View style={styles.ratingRow}>
                <Text style={styles.ratingStar}>★</Text>
                <Text style={styles.ratingValue}>
                  {coach.rating.toFixed(1)}
                </Text>
                {typeof coach.ratingCount === "number" && coach.ratingCount > 0 && (
                  <Text style={styles.ratingCount}>({coach.ratingCount})</Text>
                )}
              </View>
            )}

            {visibleSpecialties.length > 0 && (
              <View style={styles.pills}>
                {visibleSpecialties.map((specialty) => (
                  <Pill key={specialty} label={specialty} variant="default" />
                ))}
              </View>
            )}

            {minPrice !== null && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>DESDE </Text>
                <Text style={styles.priceAmount}>
                  {currencySymbol}
                  {(minPrice / 100).toLocaleString("es-AR")}
                </Text>
                <Text style={styles.pricePeriod}>/mes</Text>
              </View>
            )}
          </View>

          {/* Flecha tappable */}
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface2,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.limeGlow,
    borderWidth: 2,
    borderColor: colors.lime,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.limeGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: fontSize.xl,
    letterSpacing: 1,
  },
  info: {
    flex: 1,
    gap: spacing[1],
  },
  name: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize.xl,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[1],
  },
  ratingStar: {
    color: colors.warning,
    fontSize: fontSize.sm,
  },
  ratingValue: {
    fontFamily: typography.mono,
    color: colors.warning,
    fontSize: fontSize.sm,
  },
  ratingCount: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
    marginTop: spacing[1],
  },
  priceLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
  },
  priceAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  pricePeriod: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  arrow: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 24,
    lineHeight: 28,
    flexShrink: 0,
  },
});
