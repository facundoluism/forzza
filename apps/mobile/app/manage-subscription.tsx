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
import { router, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useEntitlements } from "@/hooks/useEntitlements";
import { Button, Skeleton, EmptyState, ErrorState, ScreenHeader } from "@forzza/ui/native";
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
  const nav = useRouter();
  const { isPro, isLoading: entitlementsLoading } = useEntitlements();

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
      <View style={styles.scroll}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("manageSubscription.screenTitle")} onBack={() => nav.back()} />
          <Text style={styles.headerSubtitle}>{t("manageSubscription.subtitle")}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ marginBottom: spacing[3] }}>
            <Skeleton width="60%" height={20} />
          </View>
          <View style={{ marginBottom: spacing[4] }}>
            <Skeleton width="100%" height={120} />
          </View>
          <Skeleton width="100%" height={52} />
        </ScrollView>
      </View>
    );
  }

  // Empty / non-PRO state
  if (!isPro) {
    return (
      <View style={styles.scroll}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("manageSubscription.screenTitle")} onBack={() => nav.back()} />
          <Text style={styles.headerSubtitle}>{t("manageSubscription.subtitle")}</Text>
        </View>
        <View style={styles.centered}>
          <EmptyState
            title={t("manageSubscription.notPro_title")}
            description={t("manageSubscription.notPro_desc")}
            actionLabel={t("manageSubscription.notPro_cta")}
            onAction={() => { router.replace("/upgrade"); }}
          />
        </View>
      </View>
    );
  }

  // Error state
  if (isError) {
    return (
      <View style={styles.scroll}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("manageSubscription.screenTitle")} onBack={() => nav.back()} />
          <Text style={styles.headerSubtitle}>{t("manageSubscription.subtitle")}</Text>
        </View>
        <View style={styles.centered}>
          <ErrorState
            title={t("manageSubscription.error_title")}
            description={t("manageSubscription.error_desc")}
            onRetry={() => { void refetch(); }}
          />
        </View>
      </View>
    );
  }

  const periodEnd = formatDate(subscription?.current_period_end ?? null, i18n.language);
  const gateway = subscription?.gateway ?? null;

  return (
    <View style={styles.scroll}>
      {/* Header visual */}
      <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
        <ScreenHeader title={t("manageSubscription.screenTitle")} onBack={() => nav.back()} />
        <Text style={styles.headerSubtitle}>{t("manageSubscription.subtitle")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Label de sección */}
        <Text style={styles.sectionLabel}>{t("manageSubscription.sectionActive")}</Text>

        {/* Card de datos PRO */}
        <View style={styles.card}>
          {/* Fila Plan + badge PRO */}
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>{t("manageSubscription.plan")}</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <View style={styles.divider} />
          {/* Fila fecha */}
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>{t("manageSubscription.activeUntil")}</Text>
            <Text style={styles.cardValueDate}>{periodEnd}</Text>
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

        {/* Nota de acceso — info card con borde lime */}
        <View style={styles.noteCard}>
          <Text style={styles.note}>{t("manageSubscription.accessNote")}</Text>
        </View>

        {/* CTA cancelar */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  headerBlock: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing[1],
  },
  headerSubtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
  },
  container: {
    padding: spacing[4],
    paddingBottom: spacing[20],
  },
  centered: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: spacing[6],
    justifyContent: "center",
  },
  sectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: spacing[3],
  },
  card: {
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing[4],
    overflow: "hidden",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
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
  cardValueDate: {
    fontFamily: typography.mono,
    color: colors.text,
    fontSize: fontSize.md,
  },
  proBadge: {
    backgroundColor: colors.limeGlow,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  proBadgeText: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: fontSize.lg,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing[4],
  },
  noteCard: {
    borderLeftWidth: 2,
    borderLeftColor: colors.lime,
    paddingLeft: spacing[3],
    marginBottom: spacing[6],
  },
  note: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing[4],
    gap: spacing[3],
  },
});
