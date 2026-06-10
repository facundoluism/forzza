import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { restorePurchases } from "@/services/revenuecat";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";
import { useState } from "react";

interface CountryConfig {
  pro_monthly_price_cents: number;
  currency_code: string;
  currency_symbol: string;
}

interface PlanFeature {
  text: string;
  available: boolean;
}

const FREE_FEATURES: PlanFeature[] = [
  { text: "Hasta 3 rutinas", available: true },
  { text: "Historial últimos 10 días", available: true },
  { text: "Tracking de series y reps", available: true },
  { text: "Historial completo", available: false },
  { text: "Rutinas ilimitadas", available: false },
  { text: "Métricas corporales", available: false },
];

const PRO_FEATURES: PlanFeature[] = [
  { text: "Rutinas ilimitadas", available: true },
  { text: "Historial completo sin límites", available: true },
  { text: "Tracking de series y reps", available: true },
  { text: "Métricas corporales", available: true },
  { text: "Fotos de progreso", available: true },
  { text: "Soporte prioritario", available: true },
  { text: "Acceso anticipado a nuevas funciones", available: true },
];

function FeatureRow({ feature }: { feature: PlanFeature }) {
  return (
    <View style={styles.featureRow}>
      <Text
        style={[
          styles.featureIcon,
          { color: feature.available ? colors.lime : colors.gray600 },
        ]}
      >
        {feature.available ? "✓" : "✕"}
      </Text>
      <Text
        style={[
          styles.featureText,
          { color: feature.available ? colors.white : colors.gray600 },
        ]}
      >
        {feature.text}
      </Text>
    </View>
  );
}

export default function UpgradeScreen() {
  const [activating, setActivating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const { data: config, isLoading: configLoading } = useQuery<CountryConfig>({
    queryKey: ["country-config"],
    queryFn: async (): Promise<CountryConfig> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("country_config")
        .select("pro_monthly_price_cents, currency_code, currency_symbol")
        .eq("country_code", "AR")
        .single();
      if (error) throw error;
      return data as CountryConfig;
    },
    staleTime: 10 * 60 * 1000,
  });

  function formatPrice(): string {
    if (configLoading || !config) return "...";
    const amount = config.pro_monthly_price_cents / 100;
    const symbol = config.currency_symbol ?? "$";
    return `${symbol}${amount.toLocaleString("es-AR")}`;
  }

  async function handleActivatePro() {
    setActivating(true);
    try {
      const { data, error } = await supabase.functions.invoke<{
        init_point: string;
        subscription_id: string;
      }>("mp-create-preapproval");

      if (error || !data?.init_point) {
        Alert.alert(
          "Error",
          error?.message ?? "No se pudo iniciar el pago. Intentá de nuevo."
        );
        return;
      }

      await Linking.openURL(data.init_point);
    } catch {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setActivating(false);
    }
  }

  async function handleRestorePurchases() {
    setRestoring(true);
    try {
      const result = await restorePurchases();
      if (!result.success) {
        Alert.alert(
          "Restaurar compra",
          result.error ?? "No se encontraron compras previas."
        );
      } else {
        Alert.alert("Listo", "Tu suscripción fue restaurada.");
      }
    } finally {
      setRestoring(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <Text style={styles.title}>
        Elegí tu{" "}
        <Text style={{ color: colors.lime }}>plan</Text>
      </Text>
      <Text style={styles.subtitle}>
        Empezá gratis y actualizá cuando estés listo.
      </Text>

      {/* Free card */}
      <View style={[styles.card, styles.cardFree]}>
        <Text style={styles.cardName}>Free</Text>
        <Text style={styles.cardPrice}>$0</Text>
        <Text style={styles.cardPriceNote}>Para siempre gratis</Text>
        <View style={styles.features}>
          {FREE_FEATURES.map((f) => (
            <FeatureRow key={f.text} feature={f} />
          ))}
        </View>
        <View style={[styles.ctaButton, styles.ctaButtonFree]}>
          <Text style={[styles.ctaLabel, { color: colors.white }]}>
            Tu plan actual
          </Text>
        </View>
      </View>

      {/* PRO card */}
      <View style={[styles.card, styles.cardPro]}>
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>RECOMENDADO</Text>
        </View>
        <Text style={[styles.cardName, { color: colors.lime }]}>PRO</Text>
        <Text style={styles.cardPrice}>{formatPrice()}</Text>
        <Text style={styles.cardPriceNote}>
          por mes · cancelá cuando quieras
        </Text>
        <View style={styles.features}>
          {PRO_FEATURES.map((f) => (
            <FeatureRow key={f.text} feature={f} />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.ctaButton, styles.ctaButtonPro]}
          onPress={() => {
            void handleActivatePro();
          }}
          disabled={activating || configLoading}
        >
          {activating ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={[styles.ctaLabel, { color: colors.black }]}>
              Activar PRO
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Restore purchases */}
      <TouchableOpacity
        style={styles.restoreButton}
        onPress={() => {
          void handleRestorePurchases();
        }}
        disabled={restoring}
      >
        {restoring ? (
          <ActivityIndicator color={colors.gray400} size="small" />
        ) : (
          <Text style={styles.restoreLabel}>Restaurar compra</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        Todos los precios en ARS. Sin sorpresas: cancelá en cualquier momento
        desde tu perfil.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    padding: spacing[6],
    paddingBottom: spacing[20],
  },
  title: {
    fontFamily: typography.heading,
    fontSize: 40,
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing[2],
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.gray400,
    textAlign: "center",
    marginBottom: spacing[8],
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.gray900,
    borderRadius: radius.lg,
    padding: spacing[6],
    marginBottom: spacing[6],
    position: "relative",
  },
  cardFree: {
    borderWidth: 2,
    borderColor: colors.gray700,
  },
  cardPro: {
    borderWidth: 2,
    borderColor: colors.lime,
  },
  recommendedBadge: {
    position: "absolute",
    top: -14,
    alignSelf: "center",
    backgroundColor: colors.lime,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },
  recommendedText: {
    fontFamily: typography.body,
    fontSize: 10,
    fontWeight: "700",
    color: colors.black,
    letterSpacing: 1,
  },
  cardName: {
    fontFamily: typography.heading,
    fontSize: 28,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  cardPrice: {
    fontFamily: typography.mono,
    fontSize: 36,
    fontWeight: "900",
    color: colors.white,
    lineHeight: 40,
  },
  cardPriceNote: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.gray400,
    marginTop: spacing[1],
    marginBottom: spacing[4],
  },
  features: {
    marginBottom: spacing[4],
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray800,
  },
  featureIcon: {
    fontFamily: typography.body,
    fontWeight: "700",
    fontSize: 16,
    width: 20,
    textAlign: "center",
  },
  featureText: {
    fontFamily: typography.body,
    fontSize: 14,
    flex: 1,
  },
  ctaButton: {
    padding: spacing[4],
    borderRadius: radius.md,
    alignItems: "center",
  },
  ctaButtonFree: {
    backgroundColor: colors.gray800,
  },
  ctaButtonPro: {
    backgroundColor: colors.lime,
  },
  ctaLabel: {
    fontFamily: typography.body,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: spacing[3],
    marginBottom: spacing[4],
  },
  restoreLabel: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.gray400,
    textDecorationLine: "underline",
  },
  footerNote: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.gray600,
    textAlign: "center",
    lineHeight: 18,
  },
});
