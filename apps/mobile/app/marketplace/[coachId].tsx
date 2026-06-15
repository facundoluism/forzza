import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Card, Pill, Skeleton, ErrorState } from "@forzza/ui/native";
import { colors, spacing, typography, radius } from "@forzza/ui/tokens";

// Columnas reales de coach_packages: id, coach_id, tier, title, description, price, active
interface CoachPackage {
  id: string;
  title: string;
  description: string | null;
  price: number; // entero en centavos
  tier: "starter" | "pro" | "elite";
  active: boolean;
}

interface CoachProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  specialties: string[];
  avatar_url: string | null;
  years_experience: number | null;
  status: string;
  packages: CoachPackage[];
}

interface StudentProfile {
  birth_date: string | null;
  parental_consent_at: string | null;
}

function isMinor(birthDate: string): boolean {
  const age =
    (Date.now() - new Date(birthDate).getTime()) /
    (365.25 * 24 * 60 * 60 * 1000);
  return age < 18;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function PackageCard({
  pkg,
  currencySymbol,
  onContratar,
}: {
  pkg: CoachPackage;
  currencySymbol: string;
  onContratar: (packageId: string) => void;
}) {
  // Precio en centavos → mostrar formateado
  const price = (pkg.price / 100).toLocaleString("es-AR");

  return (
    <Card style={styles.packageCard} padding="lg">
      <Text style={styles.packageName}>{pkg.title}</Text>
      {pkg.description ? (
        <Text style={styles.packageDesc}>{pkg.description}</Text>
      ) : null}

      <View style={styles.packageFooter}>
        <Text style={styles.packagePrice}>
          <Text style={styles.packagePriceAmount}>
            {currencySymbol}
            {price}
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.contratarBtn}
          activeOpacity={0.8}
          onPress={() => onContratar(pkg.id)}
        >
          <Text style={styles.contratarText}>Contratar</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

export default function CoachProfileScreen() {
  const { coachId } = useLocalSearchParams<{ coachId: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const { data: coach, isLoading, isError, refetch } = useQuery({
    queryKey: ["coach_profile", coachId],
    queryFn: async (): Promise<CoachProfile | null> => {
      // Columnas reales de coach_packages: id, title, description, price, tier, active
      // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_profiles")
        .select(
          "id, user_id, display_name, bio, specialties, avatar_url, years_experience, status, packages:coach_packages(id, title, description, price, tier, active)"
        )
        .eq("id", coachId!)
        .eq("status", "approved")
        .single();
      if (error) return null;
      return data as CoachProfile | null;
    },
    enabled: !!coachId,
  });

  const { data: studentProfile } = useQuery({
    queryKey: ["student_profile_consent", user?.id],
    queryFn: async (): Promise<StudentProfile | null> => {
      if (!user) return null;
      const { data } = await supabase
        .from("student_profiles")
        .select("birth_date, parental_consent_at")
        .eq("user_id", user.id)
        .single();
      return data as StudentProfile | null;
    },
    enabled: !!user,
  });

  const { data: countryConfig } = useQuery({
    queryKey: ["country_config_symbol"],
    queryFn: async () => {
      const { data } = await supabase
        .from("country_config")
        .select("currency_symbol")
        .eq("country", "AR") // PK es "country", no "country_code"
        .single();
      return data;
    },
  });

  const currencySymbol = countryConfig?.currency_symbol ?? "$";

  function handleContratar(packageId: string) {
    if (
      studentProfile?.birth_date &&
      isMinor(studentProfile.birth_date) &&
      !studentProfile.parental_consent_at
    ) {
      Alert.alert(
        "Consentimiento requerido",
        "Sos menor de edad y necesitás el consentimiento de tu tutor/a para contratar un coach. Andá a tu perfil y completá el proceso.",
        [{ text: "Entendido" }]
      );
      return;
    }

    router.push(
      `/marketplace/checkout?coach_id=${coachId}&package_id=${packageId}` as never
    );
  }

  if (isLoading) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.heroSkeleton}>
          <Skeleton width={96} height={96} borderRadius={48} />
          <View style={styles.skeletonInfo}>
            <Skeleton width="60%" height={28} />
            <Skeleton width="80%" height={14} />
            <Skeleton width="50%" height={14} />
          </View>
        </View>
        <Skeleton width="100%" height={140} />
        <View style={{ height: spacing[3] }} />
        <Skeleton width="100%" height={140} />
      </ScrollView>
    );
  }

  if (isError || !coach) {
    return (
      <ErrorState
        title="Coach no encontrado"
        description="Este coach no existe o ya no está disponible."
        onRetry={() => void refetch()}
      />
    );
  }

  const initials = getInitials(coach.display_name);
  // Filtrar solo paquetes activos
  const activePackages = coach.packages.filter((p) => p.active);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
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

        <Text style={styles.coachName}>{coach.display_name}</Text>

        {coach.years_experience !== null && (
          <Text style={styles.experience}>
            {coach.years_experience}{" "}
            {coach.years_experience === 1 ? "año" : "años"} de experiencia
          </Text>
        )}

        {coach.specialties.length > 0 && (
          <View style={styles.specialties}>
            {coach.specialties.map((s) => (
              <Pill key={s} label={s} variant="default" />
            ))}
          </View>
        )}
      </View>

      {/* Bio */}
      {coach.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre el coach</Text>
          <Text style={styles.bio}>{coach.bio}</Text>
        </View>
      ) : null}

      {/* Packages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paquetes disponibles</Text>
        {activePackages.length === 0 ? (
          <Card>
            <Text style={styles.noPackages}>
              Este coach no tiene paquetes publicados todavía.
            </Text>
          </Card>
        ) : (
          activePackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              currencySymbol={currencySymbol}
              onContratar={handleContratar}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[12],
  },
  hero: {
    alignItems: "center",
    paddingVertical: spacing[6],
    gap: spacing[3],
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.gray700,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 32,
    letterSpacing: 1,
  },
  coachName: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 32,
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
  experience: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 14,
  },
  specialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    justifyContent: "center",
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[3],
  },
  bio: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 15,
    lineHeight: 22,
  },
  packageCard: {
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  packageName: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 22,
    letterSpacing: 0.5,
  },
  packageDesc: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 14,
    lineHeight: 20,
  },
  packageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[2],
  },
  packagePrice: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 14,
  },
  packagePriceAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 18,
    fontWeight: "700",
  },
  contratarBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 44,
    justifyContent: "center",
  },
  contratarText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  noPackages: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: spacing[4],
  },
  heroSkeleton: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[6],
    alignItems: "flex-start",
  },
  skeletonInfo: {
    flex: 1,
    gap: spacing[2],
  },
});
