import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { purchasePro, restorePurchases } from "@/services/revenuecat";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";
import { useState, useEffect, useLayoutEffect } from "react";
import { TRACKED_EVENTS } from "@forzza/core";
import { track } from "@/lib/analytics";

interface CountryConfig {
  pro_monthly_price_cents: number;
  currency_code: string;
  currency_symbol: string;
}

interface PlanFeature {
  text: string;
  available: boolean;
}

function FeatureRow({ feature, proCard = false }: { feature: PlanFeature; proCard?: boolean }) {
  return (
    <View style={styles.featureRow}>
      <Text
        style={[
          styles.featureIcon,
          {
            color: feature.available
              ? proCard ? colors.lime : colors.success
              : colors.error,
          },
        ]}
      >
        {feature.available ? "✓" : "✗"}
      </Text>
      <Text
        style={[
          styles.featureText,
          { color: feature.available ? colors.text : colors.muted },
        ]}
      >
        {feature.text}
      </Text>
    </View>
  );
}

export default function UpgradeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [activating, setActivating] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('upgrade.screenTitle') });
  }, [t, navigation]);

  useEffect(() => {
    track(TRACKED_EVENTS.UPGRADE_MODAL_SHOWN);
  }, []);

  const FREE_FEATURES: PlanFeature[] = [
    { text: t('upgrade.free_feat1'), available: true },
    { text: t('upgrade.free_feat2'), available: true },
    { text: t('upgrade.free_feat3'), available: true },
    { text: t('upgrade.free_feat4'), available: true },
    { text: t('upgrade.pro_feat2'), available: false },
    { text: t('upgrade.pro_feat1'), available: false },
  ];

  const PRO_FEATURES: PlanFeature[] = [
    { text: t('upgrade.pro_feat1'), available: true },
    { text: t('upgrade.pro_feat2'), available: true },
    { text: t('upgrade.pro_feat3'), available: true },
    { text: t('upgrade.pro_feat4'), available: true },
    { text: t('upgrade.pro_feat5'), available: true },
  ];

  const { data: config, isLoading: configLoading } = useQuery<CountryConfig>({
    queryKey: ["country-config"],
    queryFn: async (): Promise<CountryConfig> => {
      // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("country_config")
        .select("pro_monthly_price_cents, currency_code, currency_symbol")
        .eq("country", "AR") // PK es "country", no "country_code"
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
    track(TRACKED_EVENTS.UPGRADE_CTA_TAPPED);
    setActivating(true);
    try {
      const result = await purchasePro();

      if (result.userCancelled) {
        // User dismissed the sheet — no alert needed
        return;
      }

      if (!result.success) {
        Alert.alert(
          t('upgrade.errorPurchaseTitle'),
          result.error ?? t('upgrade.errorPurchaseDesc')
        );
        return;
      }

      // Success: navigate back and let the PRO entitlement propagate via
      // RevenueCat listener / next getCustomerInfo call.
      Alert.alert(t('upgrade.screenTitle'), t('upgrade.activateProSuccess'));
    } catch {
      Alert.alert(t('upgrade.errorPurchaseTitle'), t('upgrade.errorPurchaseDesc'));
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
          t('upgrade.errorRestoreTitle'),
          result.error ?? t('upgrade.errorRestoreDesc')
        );
      } else {
        Alert.alert(t('upgrade.screenTitle'), t('upgrade.restoreSuccess'));
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
      {/* Header: logoBox + título con última palabra en lime */}
      <View style={styles.headerRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>F</Text>
        </View>
      </View>
      <Text style={styles.sectionLabel}>{t('upgrade.planSectionLabel')}</Text>
      <Text style={styles.title}>
        {t('upgrade.title').split(' ').slice(0, -1).join(' ')}{" "}
        <Text style={styles.titleAccent}>{t('upgrade.title').split(' ').at(-1)}</Text>
      </Text>
      <Text style={styles.subtitle}>
        {t('upgrade.subtitle')}
      </Text>

      {/* Free card */}
      <View style={[styles.card, styles.cardFree]}>
        <Text style={styles.cardPlanLabel}>{t('upgrade.freePlanLabel')}</Text>
        <Text style={styles.cardPrice}>$0</Text>
        <Text style={styles.cardPriceNote}>{t('upgrade.freePlanName')}</Text>
        <View style={styles.features}>
          {FREE_FEATURES.map((f) => (
            <FeatureRow key={f.text} feature={f} proCard={false} />
          ))}
        </View>
        <View style={[styles.ctaButton, styles.ctaButtonFree]}>
          <Text style={styles.ctaLabelFree}>
            {t('upgrade.currentPlan')}
          </Text>
        </View>
        <Text style={styles.coachNote}>{t('upgrade.coachNote')}</Text>
      </View>

      {/* PRO card */}
      <View style={[styles.card, styles.cardPro]}>
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>{t('upgrade.recommended')}</Text>
        </View>
        <Text style={styles.cardPlanLabelPro}>PRO</Text>
        <Text style={styles.cardPricePro}>{formatPrice()}</Text>
        <Text style={styles.cardPriceNote}>
          {t('upgrade.perMonth')}
        </Text>
        <View style={styles.features}>
          {PRO_FEATURES.map((f) => (
            <FeatureRow key={f.text} feature={f} proCard={true} />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.ctaButton, styles.ctaButtonPro, (activating || configLoading) && styles.ctaDisabled]}
          onPress={() => {
            void handleActivatePro();
          }}
          disabled={activating || configLoading}
        >
          {activating ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.ctaLabelPro}>
              {t('upgrade.activatePro').toUpperCase()}
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
          <ActivityIndicator color={colors.muted} size="small" />
        ) : (
          <Text style={styles.restoreLabel}>{t('upgrade.restorePurchase')}</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerNote}>
        {t('upgrade.priceNote')}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing[6],
    paddingBottom: spacing[20],
  },
  headerRow: {
    alignItems: "center",
    marginBottom: spacing[3],
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize["2xl"],
  },
  sectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: spacing[1],
  },
  title: {
    fontFamily: typography.heading,
    fontSize: fontSize["4xl"],
    color: colors.white,
    textAlign: "center",
    marginBottom: spacing[2],
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  titleAccent: {
    color: colors.lime,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: fontSize.md,
    color: colors.muted,
    textAlign: "center",
    marginBottom: spacing[8],
    lineHeight: 22,
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing[6],
    marginBottom: spacing[6],
    position: "relative",
  },
  cardFree: {
    backgroundColor: colors.surface3,
    borderWidth: 1,
    borderColor: colors.surface4,
  },
  cardPro: {
    backgroundColor: colors.limeGlow,
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
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.black,
    letterSpacing: 1,
  },
  cardPlanLabel: {
    fontFamily: typography.heading,
    fontSize: fontSize["2xl"],
    color: colors.muted,
    letterSpacing: 1,
    marginBottom: spacing[2],
    textTransform: "uppercase",
  },
  cardPlanLabelPro: {
    fontFamily: typography.heading,
    fontSize: fontSize["2xl"],
    color: colors.lime,
    letterSpacing: 1,
    marginBottom: spacing[2],
    textTransform: "uppercase",
  },
  cardPrice: {
    fontFamily: typography.mono,
    fontSize: fontSize["4xl"],
    fontWeight: "900",
    color: colors.muted,
    lineHeight: 44,
  },
  cardPricePro: {
    fontFamily: typography.mono,
    fontSize: fontSize["4xl"],
    fontWeight: "900",
    color: colors.lime,
    lineHeight: 44,
  },
  cardPriceNote: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    color: colors.muted,
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
    borderBottomColor: colors.border,
  },
  featureIcon: {
    fontFamily: typography.body,
    fontWeight: "700",
    fontSize: fontSize.base,
    width: 20,
    textAlign: "center",
  },
  featureText: {
    fontFamily: typography.body,
    fontSize: fontSize.md,
    flex: 1,
  },
  ctaButton: {
    padding: spacing[4],
    borderRadius: radius.lg,
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  ctaButtonFree: {
    backgroundColor: colors.surface4,
  },
  ctaButtonPro: {
    backgroundColor: colors.lime,
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaLabelFree: {
    fontFamily: typography.body,
    fontWeight: "700",
    fontSize: fontSize.base,
    color: colors.muted,
    letterSpacing: 0.5,
  },
  ctaLabelPro: {
    fontFamily: typography.heading,
    fontSize: fontSize.xl,
    color: colors.black,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  coachNote: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: spacing[3],
    lineHeight: 16,
  },
  restoreButton: {
    alignItems: "center",
    paddingVertical: spacing[3],
    marginBottom: spacing[4],
  },
  restoreLabel: {
    fontFamily: typography.body,
    fontSize: fontSize.sm,
    color: colors.muted,
    textDecorationLine: "underline",
  },
  footerNote: {
    fontFamily: typography.body,
    fontSize: fontSize.xs,
    color: colors.gray,
    textAlign: "center",
    lineHeight: 18,
  },
});
