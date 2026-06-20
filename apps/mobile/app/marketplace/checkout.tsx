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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { ErrorState, ScreenHeader } from "@forzza/ui/native";
import { colors, spacing, typography, radius, fontSize } from "@forzza/ui/tokens";

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
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      Alert.alert(t('marketplace.checkout.errorTitle'), message, [{ text: t('marketplace.checkout.close') }]);
    } finally {
      setLoading(false);
    }
  }

  if (pkgLoading) {
    return (
      <View style={styles.screen}>
        <View style={[styles.screenHeader, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("marketplace.checkout.screenTitle")} onBack={() => router.back()} />
        </View>
        <View style={styles.centered}>
          <ActivityIndicator color={colors.lime} size="large" />
        </View>
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.screen}>
        <View style={[styles.screenHeader, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("marketplace.checkout.screenTitle")} onBack={() => router.back()} />
        </View>
        <ErrorState
          title={t("marketplace.checkout.packageUnavailable")}
          description={t("marketplace.checkout.packageUnavailableDesc")}
        />
      </View>
    );
  }

  const coachName = pkg.coach?.display_name ?? "Coach";
  // Precio en centavos → formateado
  const price = (pkg.price / 100).toLocaleString("es-AR");

  return (
    <View style={styles.screen}>
      <View style={[styles.screenHeader, { paddingTop: insets.top + spacing[4] }]}>
        <ScreenHeader title={t("marketplace.checkout.screenTitle")} onBack={() => router.back()} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Subtítulo coach · paquete */}
      <Text style={styles.titleSubtitle}>
        {coachName} · {pkg.title}
      </Text>

      {/* Barra de progreso 2 pasos (visual only, siempre paso 1 activo) */}
      <View style={styles.stepBar}>
        <View style={styles.stepBarSegmentActive} />
        <View style={styles.stepBarSegment} />
      </View>
      <View style={styles.stepLabels}>
        <Text style={styles.stepLabelActive}>{t('marketplace.checkout.step1Label')}</Text>
        <Text style={styles.stepLabel}>{t('marketplace.checkout.step2Label')}</Text>
      </View>

      {/* Summary card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('marketplace.checkout.labelCoach').toUpperCase()}</Text>
          <Text style={styles.summaryValue}>{coachName}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('marketplace.checkout.labelPackage').toUpperCase()}</Text>
          <Text style={styles.summaryValue}>{pkg.title}</Text>
        </View>
        {pkg.description ? (
          <Text style={styles.summaryDesc}>{pkg.description}</Text>
        ) : null}
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('marketplace.checkout.labelPrice').toUpperCase()}</Text>
          <View style={styles.priceGroup}>
            <Text style={styles.priceAmount}>
              {currencySymbol}
              {price}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <Text style={styles.securePaymentNote}>{t('marketplace.checkout.securePayment')}</Text>
      </View>

      {/* Minor blocked warning */}
      {minorBlocked && (
        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            {t('marketplace.checkout.minorBlock')}
          </Text>
        </View>
      )}

      {/* Refund policy */}
      <Text style={styles.refundNote}>
        {t('marketplace.checkout.cancelInfo')}
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
          <Text style={styles.confirmText}>{t('marketplace.checkout.submit').toUpperCase()}</Text>
        )}
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenHeader: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[12],
  },
  titleSubtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginBottom: spacing[5],
  },
  stepBar: {
    flexDirection: "row",
    gap: spacing[2],
    marginBottom: spacing[1],
  },
  stepBarSegmentActive: {
    flex: 1,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.lime,
  },
  stepBarSegment: {
    flex: 1,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surface4,
  },
  stepLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing[5],
  },
  stepLabelActive: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  stepLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "right",
  },
  summaryCard: {
    backgroundColor: colors.surface2,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
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
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summaryValue: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  summaryDesc: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    lineHeight: 18,
    marginTop: -spacing[1],
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  priceGroup: {
    alignItems: "flex-end",
  },
  priceAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize["3xl"],
    fontWeight: "700",
  },
  securePaymentNote: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    textAlign: "center",
  },
  warningCard: {
    borderColor: colors.warning,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    backgroundColor: colors.warning + "11",
  },
  warningText: {
    fontFamily: typography.body,
    color: colors.warning,
    fontSize: fontSize.md,
    lineHeight: 20,
  },
  refundNote: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    textAlign: "center",
    marginBottom: spacing[6],
    lineHeight: 18,
  },
  confirmBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  confirmBtnDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize.xl,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.md,
    textAlign: "center",
    paddingHorizontal: spacing[6],
  },
});
