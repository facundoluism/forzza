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
import { Card, ErrorState } from "@forzza/ui/native";
import { colors, spacing, typography, radius } from "@forzza/ui/tokens";

// Columnas reales de coach_packages: id, coach_id, tier, title, description, price, active
interface CheckoutPackage {
  id: string;
  title: string;
  description: string | null;
  price: number; // entero en centavos
  tier: "starter" | "pro" | "elite";
  active: boolean;
  // join embed a coach_profiles (solo display_name)
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
      // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_packages")
        .select(
          "id, title, description, price, tier, active, coach:coach_profiles(display_name)"
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
        .eq("country", "AR") // PK es "country", no "country_code"
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
      <ErrorState
        title="Paquete no disponible"
        description="No pudimos cargar los detalles de este paquete."
      />
    );
  }

  const coachName = pkg.coach?.display_name ?? "Coach";
  // Precio en centavos → formateado
  const price = (pkg.price / 100).toLocaleString("es-AR");

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
          <Text style={styles.summaryValue}>{pkg.title}</Text>
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
          </View>
        </View>
      </Card>

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
