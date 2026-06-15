import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Card, Pill } from "@forzza/ui/native";
import { colors, spacing, typography, radius } from "@forzza/ui/tokens";

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
      <Card style={styles.card}>
        <View style={styles.row}>
          {/* Avatar */}
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

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>
              {coach.display_name}
            </Text>

            {visibleSpecialties.length > 0 && (
              <View style={styles.pills}>
                {visibleSpecialties.map((specialty) => (
                  <Pill key={specialty} label={specialty} variant="default" />
                ))}
              </View>
            )}

            {minPrice !== null && (
              <Text style={styles.price}>
                Desde{" "}
                <Text style={styles.priceAmount}>
                  {currencySymbol}
                  {(minPrice / 100).toLocaleString("es-AR")}
                </Text>
                {"/mes"}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing[3],
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: colors.gray700,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 22,
    letterSpacing: 1,
  },
  info: {
    flex: 1,
    gap: spacing[2],
  },
  name: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 20,
    letterSpacing: 0.5,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[1],
  },
  price: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 13,
    marginTop: spacing[1],
  },
  priceAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontWeight: "700",
  },
});
