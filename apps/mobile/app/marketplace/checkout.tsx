import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Card } from "@forzza/ui/native";
import { colors, spacing, typography, radius } from "@forzza/ui/tokens";

interface CheckoutPackage {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  billing_type: "mensual" | "paquete";
  features: string[];
  coach: {
    display_name: string;
  } | null;
}

interface StudentProfile {
  birth_date: string | null;
  parental_consent_at: string | null;
}

interface CountryConfig {
  currency_symbol: string;
}

function isMinor(birthDate: string): boolean {
  const age =
    (Date.now() - new Date(birthDate).getTime()) /
    (365.25 * 24 * 60 * 60 * 1000);
  return age < 18;
}

export default function CheckoutScreen() {
  const { coach_id, package_id } = useLocalSearchParams<{
    coach_id: string;
    package_id: string;
  }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const { data: pkg, isLoading: pkgLoading } = useQuery({
    queryKey: ["checkout_package", package_id, coach_id],
    queryFn: async (): Promise<CheckoutPackage | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_packages")
        .select(
          "id, name, description, price_cents, billing_type, features, coach:coach_profiles(display_name)"
        )
        .eq("id", package_id!)
        .eq("coach_id", coach_id!)
        .single();
      if (error) return null;
      return data as CheckoutPackage | null;
    },
    enabled: !!package_id && !!coach_id,
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
    queryFn: async (): Promise<CountryConfig | null> => {
      const { data } = await supabase
        .from("country_config")
        .select("currency_symbol")
        .eq("country_code", "AR")
        .single();
      return data as CountryConfig | null;
    },
  });

  const currencySymbol = countryConfig?.currency_symbol ?? "$";

  const minorBlocked =
    studentProfile?.birth_date &&
    isMinor(studentProfile.birth_date) &&
    !studentProfile.parental_consent_at;

  async function handleConfirm() {
    if (minorBlocked) return;
    if (!coach_id || !package_id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        init_point: string;
      }>("coach-checkout", {
        body: { coach_id, package_id },
      });

      if (error) throw error;
      if (!data?.init_point) throw new Error("No se recibió el link de pago");

      await Linking.openURL(data.init_point);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error inesperado";
      Alert.alert("Error al procesar el pago", message, [{ text: "Cerrar" }]);
    } finally {
      setLoading(false);
    }
  }

  if (pkgLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          No pudimos cargar los detalles de este paquete.
        </Text>
      </View>
    );
  }

  const coachName = pkg.coach?.display_name ?? "Coach";
  const price = (pkg.price_cents / 100).toLocaleString("es-AR");
  const billingLabel = pkg.billing_type === "mensual" ? "por mes" : "paquete único";

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resumen de tu contratación</Text>

      {/* Summary card */}
      <Card style={styles.summaryCard} padding="lg">
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Coach</Text>
          <Text style={styles.summaryValue}>{coachName}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Paquete</Text>
          <Text style={styles.summaryValue}>{pkg.name}</Text>
        </View>
        {pkg.description ? (
          <Text style={styles.summaryDesc}>{pkg.description}</Text>
        ) : null}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Precio</Text>
          <View style={styles.priceGroup}>
            <Text style={styles.priceAmount}>
              {currencySymbol}
              {price}
            </Text>
            <Text style={styles.pricePer}>{billingLabel}</Text>
          </View>
        </View>
      </Card>

      {/* Features */}
      {pkg.features.length > 0 && (
        <View style={styles.featuresSection}>
          <Text style={styles.featureTitle}>Incluye</Text>
          {pkg.features.map((feat, idx) => (
            <View key={idx} style={styles.featureRow}>
              <Text style={styles.featureBullet}>{"•"}</Text>
              <Text style={styles.featureText}>{feat}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Minor blocked warning */}
      {minorBlocked && (
        <Card style={styles.warningCard} padding="md">
          <Text style={styles.warningText}>
            Necesitás el consentimiento de tu tutor/a. Volvé a tu perfil para
            completarlo.
          </Text>
        </Card>
      )}

      {/* Refund policy */}
      <Text style={styles.refundNote}>
        Tenés 72 horas desde la contratación para solicitar un reembolso completo.
      </Text>

      {/* CTA */}
      <TouchableOpacity
        style={[
          styles.confirmBtn,
          (minorBlocked || loading) && styles.confirmBtnDisabled,
        ]}
        activeOpacity={0.8}
        onPress={() => void handleConfirm()}
        disabled={!!minorBlocked || loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.black} />
        ) : (
          <Text style={styles.confirmText}>Confirmar y pagar</Text>
        )}
      </TouchableOpacity>
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
  title: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 30,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing[4],
  },
  summaryCard: {
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryLabel: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontFamily: typography.body,
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  summaryDesc: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 13,
    lineHeight: 18,
    marginTop: -spacing[1],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray800,
  },
  priceGroup: {
    alignItems: "flex-end",
  },
  priceAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 22,
    fontWeight: "700",
  },
  pricePer: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
  },
  featuresSection: {
    marginBottom: spacing[4],
    gap: spacing[2],
  },
  featureTitle: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  featureRow: {
    flexDirection: "row",
    gap: spacing[2],
  },
  featureBullet: {
    color: colors.lime,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 20,
  },
  featureText: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  warningCard: {
    borderColor: colors.warning,
    borderWidth: 1,
    marginBottom: spacing[4],
    backgroundColor: colors.warning + "11",
  },
  warningText: {
    fontFamily: typography.body,
    color: colors.warning,
    fontSize: 14,
    lineHeight: 20,
  },
  refundNote: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 12,
    textAlign: "center",
    marginBottom: spacing[6],
    lineHeight: 18,
  },
  confirmBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    alignItems: "center",
  },
  confirmBtnDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 20,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  centered: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: spacing[6],
  },
});
