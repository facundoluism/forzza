import { requireAdmin } from "@/lib/auth/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SettlementActionButtons } from "./SettlementActionButtons";
import { ErrorState } from "@forzza/ui/web";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });
  return { title: t("liquidaciones.metaTitle") };
}

type SettlementStatus =
  | "pending"
  | "pending_invoice"
  | "invoiced"
  | "approved"
  | "rejected"
  | "transferred";

interface SettlementRow {
  id: string;
  coach_id: string;
  period_start: string;
  period_end: string;
  gross_amount: number;
  commission: number;
  net_amount: number;
  currency: string;
  status: SettlementStatus;
  invoice_number: string | null;
  invoice_path: string | null;
  invoice_rejection_reason: string | null;
  transferred_at: string | null;
  coach_profiles?: { display_name: string | null } | null;
}

const statusColors: Record<SettlementStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  pending_invoice: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  invoiced: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  approved: "bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20",
  rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
  transferred: "bg-green-500/10 text-green-400 border border-green-500/20",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCents(cents: number, currency = "ARS"): string {
  return `${currency} ${(cents / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function AdminLiquidacionesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "admin" });

  const { adminClient } = await requireAdmin();

  // TODO: regenerate db-types after applying 20260616000001_settlement_approval_flow.sql.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: settlements, error } = await (adminClient as any)
    .from("settlements")
    .select(
      "id, coach_id, period_start, period_end, gross_amount, commission, net_amount, currency, status, invoice_number, invoice_path, invoice_rejection_reason, transferred_at, coach_profiles(display_name)"
    )
    .order("period_start", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Error fetching settlements:", error);
    return (
      <ErrorState
        title={t("liquidaciones.errorTitle")}
        description={t("liquidaciones.errorDesc")}
      />
    );
  }

  const rows = (settlements ?? []) as SettlementRow[];
  const pendingOwnerCount = rows.filter((s) => s.status === "invoiced").length;
  const approvedCount = rows.filter((s) => s.status === "approved").length;
  const pendingAmount = rows
    .filter((s) => s.status === "invoiced" || s.status === "approved")
    .reduce((sum, s) => sum + s.net_amount, 0);

  const statusLabel: Record<SettlementStatus, string> = {
    pending: t("liquidaciones.statusPending"),
    pending_invoice: t("liquidaciones.statusPendingInvoice"),
    invoiced: t("liquidaciones.statusInvoiced"),
    approved: t("liquidaciones.statusApproved"),
    rejected: t("liquidaciones.statusRejected"),
    transferred: t("liquidaciones.statusTransferred"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("liquidaciones.title")}</h1>
        <p className="mt-1 text-muted text-sm">
          {t("liquidaciones.subtitle")}
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="mb-2 text-muted text-xs uppercase tracking-wider">
            {t("liquidaciones.toApprove")}
          </p>
          <p className="text-2xl font-bold text-text">{pendingOwnerCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="mb-2 text-muted text-xs uppercase tracking-wider">
            {t("liquidaciones.readyToTransfer")}
          </p>
          <p className="text-2xl font-bold text-[#C8FF00]">{approvedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="mb-2 text-muted text-xs uppercase tracking-wider">
            {t("liquidaciones.netPending")}
          </p>
          <p className="font-mono text-2xl font-bold text-[#C8FF00]">
            {formatCents(pendingAmount)}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="mb-4 text-4xl">$</p>
          <p className="text-text text-lg font-semibold">
            {t("liquidaciones.emptyState")}
          </p>
          <p className="mt-2 text-muted text-sm">
            {t("liquidaciones.emptySubtitle")}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-2 text-muted text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left">{t("liquidaciones.colCoach")}</th>
                <th className="hidden px-6 py-3 text-left md:table-cell">{t("liquidaciones.colPeriod")}</th>
                <th className="hidden px-6 py-3 text-right lg:table-cell">{t("liquidaciones.colGross")}</th>
                <th className="hidden px-6 py-3 text-right lg:table-cell">{t("liquidaciones.colCommission")}</th>
                <th className="px-6 py-3 text-right">{t("liquidaciones.colNet")}</th>
                <th className="px-6 py-3 text-left">{t("liquidaciones.colInvoice")}</th>
                <th className="px-6 py-3 text-left">{t("liquidaciones.colStatus")}</th>
                <th className="px-6 py-3 text-right">{t("liquidaciones.colAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {rows.map((settlement) => (
                <tr key={settlement.id} className="transition-colors hover:bg-surface-2">
                  <td className="px-6 py-4">
                    <p className="text-text font-medium">
                      {settlement.coach_profiles?.display_name ?? "Coach"}
                    </p>
                    <p className="font-mono text-muted text-xs">
                      {settlement.coach_id.slice(0, 8)}...
                    </p>
                    <p className="mt-1 text-muted text-xs md:hidden">
                      {formatDate(settlement.period_start)} {t("liquidaciones.periodTo")}{" "}
                      {formatDate(settlement.period_end)}
                    </p>
                  </td>
                  <td className="hidden px-6 py-4 text-muted text-xs md:table-cell">
                    {formatDate(settlement.period_start)} {t("liquidaciones.periodTo")}{" "}
                    {formatDate(settlement.period_end)}
                  </td>
                  <td className="hidden px-6 py-4 text-right text-muted lg:table-cell">
                    {formatCents(settlement.gross_amount, settlement.currency)}
                  </td>
                  <td className="hidden px-6 py-4 text-right text-red-400 lg:table-cell">
                    -{formatCents(settlement.commission, settlement.currency)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-[#C8FF00]">
                    {formatCents(settlement.net_amount, settlement.currency)}
                  </td>
                  <td className="px-6 py-4">
                    {settlement.invoice_number ? (
                      <div>
                        <p className="font-mono text-text text-xs">
                          {settlement.invoice_number}
                        </p>
                        <p className="text-muted text-xs">
                          {settlement.invoice_path ? t("liquidaciones.invoiceUploaded") : t("liquidaciones.noFile")}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted text-xs">{t("liquidaciones.noInvoice")}</span>
                    )}
                    {settlement.invoice_rejection_reason && (
                      <p className="mt-1 max-w-48 text-red-400 text-xs">
                        {settlement.invoice_rejection_reason}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[settlement.status]}`}
                    >
                      {statusLabel[settlement.status]}
                    </span>
                    {settlement.transferred_at && (
                      <p className="mt-1 text-muted text-xs">
                        {formatDate(settlement.transferred_at)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SettlementActionButtons
                      settlementId={settlement.id}
                      status={settlement.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
