import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { EmptyState, ErrorState, Skeleton, Pill } from "@forzza/ui/native";
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
      <View style={styles.paymentLeft}>
        <Text style={styles.paymentAmount}>{formatAmount(payment.amount, payment.currency)}</Text>
        <Text style={styles.paymentDate}>{date}</Text>
        {payment.gateway && (
          <Text style={styles.paymentGateway}>
            {t("paymentsHistory.gateway")}: {payment.gateway}
          </Text>
        )}
      </View>
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
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.screenTitle}>{t("paymentsHistory.screenTitle")}</Text>
          <View style={styles.skeletonRow}><Skeleton width="100%" height={72} /></View>
          <View style={styles.skeletonRow}><Skeleton width="100%" height={72} /></View>
          <View style={styles.skeletonRow}><Skeleton width="100%" height={72} /></View>
        </ScrollView>
      </View>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.content}>
          <Text style={styles.screenTitle}>{t("paymentsHistory.screenTitle")}</Text>
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
      <View style={[styles.container, { paddingTop: insets.top + spacing[4] }]}>
        <View style={styles.content}>
          <Text style={styles.screenTitle}>{t("paymentsHistory.screenTitle")}</Text>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[4] }]}
    >
      <Text style={styles.screenTitle}>{t("paymentsHistory.screenTitle")}</Text>
      {payments.map((payment) => (
        <PaymentRow key={payment.id} payment={payment} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },
  screenTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    fontWeight: "900",
    letterSpacing: -1,
    textTransform: "uppercase",
    marginBottom: spacing[5],
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  paymentLeft: {
    flex: 1,
    marginRight: spacing[3],
  },
  paymentAmount: {
    fontFamily: typography.mono,
    color: colors.text,
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
    marginBottom: spacing[3],
    borderRadius: radius.lg,
  },
});
