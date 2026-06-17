import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useEntitlements } from "@/hooks/useEntitlements";
import { Button, Skeleton, EmptyState, ErrorState } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

interface Subscription {
  id: string;
  current_period_end: string | null;
  gateway: string | null;
  status: string;
}

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(locale === "es" ? "es-AR" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function ManageSubscriptionScreen() {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isPro, isLoading: entitlementsLoading } = useEntitlements();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("manageSubscription.screenTitle") });
  }, [t, navigation]);

  const {
    data: subscription,
    isLoading: subLoading,
    isError,
    refetch,
  } = useQuery<Subscription | null>({
    queryKey: ["active-subscription"],
    queryFn: async (): Promise<Subscription | null> => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id, current_period_end, gateway, status")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: isPro,
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = entitlementsLoading || subLoading;

  function handleCancelPro() {
    Alert.alert(
      t("manageSubscription.cancelAlert_title"),
      t("manageSubscription.cancelAlert_msg"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("manageSubscription.cancelAlert_confirm"),
          style: "destructive",
          onPress: () => {
            void openStoreManagement();
          },
        },
      ]
    );
  }

  async function openStoreManagement() {
    const gateway = subscription?.gateway ?? null;

    let url: string;
    if (gateway === "mercadopago") {
      url = "https://www.mercadopago.com.ar/subscriptions";
    } else if (Platform.OS === "ios") {
      url = "itms-apps://apps.apple.com/account/subscriptions";
    } else {
      url = "https://play.google.com/store/account/subscriptions";
    }

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      // Fallback for iOS deep link not supported in simulator
      if (Platform.OS === "ios") {
        void Linking.openURL("https://apps.apple.com/account/subscriptions");
      } else {
        void Linking.openURL(url);
      }
      return;
    }
    void Linking.openURL(url);
  }

  // Loading state
  if (isLoading) {
    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing[4] }]}
      >
        <View style={{ marginBottom: spacing[3] }}>
          <Skeleton width="60%" height={20} />
        </View>
        <View style={{ marginBottom: spacing[4] }}>
          <Skeleton width="100%" height={100} />
        </View>
        <Skeleton width="100%" height={52} />
      </ScrollView>
    );
  }

  // Empty / non-PRO state
  if (!isPro) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + spacing[4] }]}>
        <EmptyState
          title={t("manageSubscription.notPro_title")}
          description={t("manageSubscription.notPro_desc")}
          actionLabel={t("manageSubscription.notPro_cta")}
          onAction={() => { router.replace("/upgrade"); }}
        />
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top + spacing[4] }]}>
        <ErrorState
          title={t("manageSubscription.error_title")}
          description={t("manageSubscription.error_desc")}
          onRetry={() => { void refetch(); }}
        />
      </View>
    );
  }

  const periodEnd = formatDate(subscription?.current_period_end ?? null, i18n.language);
  const gateway = subscription?.gateway ?? null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing[4] }]}
    >
      <Text style={styles.title}>{t("manageSubscription.screenTitle")}</Text>

      {/* Active PRO card */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>{t("manageSubscription.plan")}</Text>
          <Text style={styles.cardValuePro}>PRO</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>{t("manageSubscription.activeUntil")}</Text>
          <Text style={styles.cardValue}>{periodEnd}</Text>
        </View>
        {gateway && (
          <>
            <View style={styles.divider} />
            <View style={styles.cardRow}>
              <Text style={styles.cardLabel}>{t("manageSubscription.gateway")}</Text>
              <Text style={styles.cardValue}>
                {gateway === "mercadopago" ? "Mercado Pago" : t("manageSubscription.gatewayStore")}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Access note */}
      <Text style={styles.note}>{t("manageSubscription.accessNote")}</Text>

      {/* Cancel CTA */}
      <View style={styles.actions}>
        <Button
          label={t("manageSubscription.cancelPro")}
          variant="danger"
          fullWidth
          onPress={handleCancelPro}
          testID="manage-sub-cancel-btn"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing[6],
    paddingBottom: spacing[20],
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing[6],
    justifyContent: "center",
  },
  title: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: spacing[6],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[4],
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing[2],
  },
  cardLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.md,
  },
  cardValue: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  cardValuePro: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: fontSize.lg,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing[1],
  },
  note: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: spacing[6],
    lineHeight: 18,
  },
  actions: {
    gap: spacing[3],
  },
});
