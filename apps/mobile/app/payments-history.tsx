import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { EmptyState, ErrorState, Skeleton, Pill, ScreenHeader } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  gateway: string | null;
  created_at: string;
}

type PillVariant = "default" | "success" | "error" | "warning" | "active";

function statusToPillVariant(status: string): PillVariant {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
    case "in_process":
      return "default";
    case "rejected":
      return "error";
    case "refunded":
      return "warning";
    default:
      return "default";
  }
}

function statusLabel(t: (key: string) => string, status: string): string {
  switch (status) {
    case "approved":
      return t("paymentsHistory.status_approved");
    case "pending":
      return t("paymentsHistory.status_pending");
    case "rejected":
      return t("paymentsHistory.status_rejected");
    case "refunded":
      return t("paymentsHistory.status_refunded");
    case "in_process":
      return t("paymentsHistory.status_in_process");
    default:
      return status;
  }
}

function formatAmount(amount: number, currency: string): string {
  const major = amount / 100;
  return `${currency} ${major.toLocaleString("es-AR")}`;
}

function PaymentRow({ payment }: { payment: Payment }): React.JSX.Element {
  const { t } = useTranslation();
  const date = new Date(payment.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <View style={styles.paymentRow} testID={`payment-row-${payment.id}`}>
      {/* iconBox */}
      <View style={styles.paymentIconBox}>
        <Text style={styles.paymentIconEmoji}>💳</Text>
      </View>
      {/* Centro */}
      <View style={styles.paymentLeft}>
        <Text style={styles.paymentAmount}>{formatAmount(payment.amount, payment.currency)}</Text>
        <Text style={styles.paymentDate}>{date}</Text>
        {payment.gateway && (
          <Text style={styles.paymentGateway}>
            {t("paymentsHistory.gateway")}: {payment.gateway}
          </Text>
        )}
      </View>
      {/* Pill derecha */}
      <Pill
        label={statusLabel(t, payment.status)}
        variant={statusToPillVariant(payment.status)}
      />
    </View>
  );
}

export default function PaymentsHistoryScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  const {
    data: payments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Payment[]>({
    queryKey: ["payments-history", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("payments")
        .select("id, amount, currency, status, gateway, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Payment[];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000,
  });

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("paymentsHistory.screenTitle")} onBack={() => router.back()} />
          <Text style={styles.headerSubtitle}>{t("paymentsHistory.subtitle")}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.skeletonRow}><Skeleton width="100%" height={80} /></View>
          <View style={styles.skeletonRow}><Skeleton width="100%" height={80} /></View>
          <View style={styles.skeletonRow}><Skeleton width="100%" height={80} /></View>
        </ScrollView>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("paymentsHistory.screenTitle")} onBack={() => router.back()} />
          <Text style={styles.headerSubtitle}>{t("paymentsHistory.subtitle")}</Text>
        </View>
        <View style={styles.content}>
          <ErrorState
            title={t("paymentsHistory.error_title")}
            description={t("paymentsHistory.error_desc")}
            onRetry={() => { void refetch(); }}
          />
        </View>
      </View>
    );
  }

  // ── Empty ────────────────────────────────────────────────────────────────────
  if (payments.length === 0) {
    return (
      <View style={styles.container}>
        <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("paymentsHistory.screenTitle")} onBack={() => router.back()} />
          <Text style={styles.headerSubtitle}>{t("paymentsHistory.subtitle")}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <EmptyState
            title={t("paymentsHistory.empty_title")}
            description={t("paymentsHistory.empty_desc")}
            icon="💳"
          />
        </View>
      </View>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <View style={[styles.headerBlock, { paddingTop: insets.top + spacing[4] }]}>
        <ScreenHeader title={t("paymentsHistory.screenTitle")} onBack={() => router.back()} />
        <Text style={styles.headerSubtitle}>{t("paymentsHistory.subtitle")}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Label de sección */}
        <Text style={styles.sectionLabel}>{t("paymentsHistory.sectionLabel")}</Text>
        {payments.map((payment) => (
          <PaymentRow key={payment.id} payment={payment} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  emptyContainer: {
    flex: 1,
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
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[2],
    gap: spacing[3],
  },
  paymentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.info}15`,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  paymentIconEmoji: {
    fontSize: 20,
  },
  paymentLeft: {
    flex: 1,
  },
  paymentAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.lg,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  paymentDate: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginBottom: spacing[1],
  },
  paymentGateway: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: fontSize.xs,
    textTransform: "capitalize",
  },
  skeletonRow: {
    marginBottom: spacing[2],
    borderRadius: radius.lg,
  },
});
