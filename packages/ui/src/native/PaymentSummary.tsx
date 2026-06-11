import { View, Text, StyleSheet, type ViewProps } from "react-native";
import { colors, spacing, radius, fontSize, typography } from "../tokens";

export interface PaymentSummaryProps extends Omit<ViewProps, "style"> {
  bruto: number;
  comision: number;
  neto: number;
  currency?: string;
  style?: ViewProps["style"];
}

function formatAmount(amount: number, currency: string): string {
  return `${currency} ${(amount / 100).toFixed(2)}`;
}

export function PaymentSummary({
  bruto,
  comision,
  neto,
  currency = "ARS",
  style,
  ...rest
}: PaymentSummaryProps) {
  const comisionPct = bruto > 0 ? Math.round((comision / bruto) * 100) : 20;

  return (
    <View style={[styles.container, style]} {...rest}>
      <Row label="Bruto" value={formatAmount(bruto, currency)} valueStyle={styles.valueBruto} />
      <View style={styles.divider} />
      <Row
        label={`Comisión (${comisionPct}%)`}
        value={`- ${formatAmount(comision, currency)}`}
        valueStyle={styles.valueComision}
      />
      <View style={styles.divider} />
      <Row label="Neto" value={formatAmount(neto, currency)} valueStyle={styles.valueNeto} featured />
    </View>
  );
}

interface RowProps {
  label: string;
  value: string;
  valueStyle?: object;
  featured?: boolean;
}

function Row({ label, value, valueStyle, featured }: RowProps) {
  return (
    <View style={[styles.row, featured && styles.rowFeatured]}>
      <Text style={[styles.rowLabel, featured && styles.rowLabelFeatured]}>{label}</Text>
      <Text style={[styles.rowValue, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  rowFeatured: {
    paddingVertical: spacing[4],
  },
  rowLabel: {
    fontSize: fontSize.sm,
    color: colors.muted,
    fontWeight: "500",
  },
  rowLabelFeatured: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: "700",
  },
  rowValue: {
    fontFamily: typography.mono,
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: "600",
  },
  valueBruto: {
    color: colors.text,
  },
  valueComision: {
    color: colors.error,
  },
  valueNeto: {
    fontSize: fontSize.md,
    color: colors.lime,
    fontWeight: "700",
  },
});
