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
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";
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
      {/* Header */}
      <Text style={styles.title}>
        {t('upgrade.title').split(' ').slice(0, -1).join(' ')}{" "}
        <Text style={{ color: colors.lime }}>{t('upgrade.title').split(' ').at(-1)}</Text>
      </Text>
      <Text style={styles.subtitle}>
        {t('upgrade.subtitle')}
      </Text>

      {/* Free card */}
      <View style={[styles.card, styles.cardFree]}>
        <Text style={styles.cardName}>Free</Text>
        <Text style={styles.cardPrice}>$0</Text>
        <Text style={styles.cardPriceNote}>{t('upgrade.freePlanName')}</Text>
        <View style={styles.features}>
          {FREE_FEATURES.map((f) => (
            <FeatureRow key={f.text} feature={f} />
          ))}
        </View>
        <View style={[styles.ctaButton, styles.ctaButtonFree]}>
          <Text style={[styles.ctaLabel, { color: colors.white }]}>
            {t('upgrade.currentPlan')}
          </Text>
        </View>
      </View>

      {/* PRO card */}
      <View style={[styles.card, styles.cardPro]}>
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>{t('upgrade.recommended')}</Text>
        </View>
        <Text style={[styles.cardName, { color: colors.lime }]}>PRO</Text>
        <Text style={styles.cardPrice}>{formatPrice()}</Text>
        <Text style={styles.cardPriceNote}>
          {t('upgrade.perMonth')}
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
              {t('upgrade.activatePro')}
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
