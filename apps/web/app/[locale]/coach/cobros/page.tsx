import { requireCoach } from "@/lib/auth/coach";
import type { Metadata } from "next";
import { InvoiceUploadButton } from "./InvoiceUploadButton";
import { InvoiceViewButton } from "./InvoiceViewButton";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ErrorState } from "@forzza/ui/web";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "coach" });
  return { title: t("cobros.metaTitle") };
}

type SettlementStatus =
  | "pending"
  | "pending_invoice"
  | "invoiced"
  | "approved"
  | "rejected"
  | "transferred";

interface Settlement {
  id: string;
  period_start: string;
  period_end: string;
  gross_amount: number;
  commission: number;
  net_amount: number;
  status: SettlementStatus;
  invoice_path: string | null;
  transferred_at: string | null;
  invoice_signed_url?: string | null;
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

function formatCents(cents: number, symbol = "$"): string {
  return `${symbol} ${(cents / 100).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function getThisMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  return { start, end };
}

function getLastMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();
  return { start, end };
}

export default async function CobrosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "coach" });

  const { supabase, coachProfileId } = await requireCoach();

  const { data: settlements, error } = await supabase
    .from("settlements")
    .select(
      "id, period_start, period_end, gross_amount, commission, net_amount, status, invoice_path, transferred_at"
    )
    .eq("coach_id", coachProfileId)
    .order("period_start", { ascending: false });

  if (error) {
    console.error("Error fetching settlements:", error);
    return (
      <ErrorState
        title={t("cobros.errorTitle")}
        description={t("cobros.errorDesc")}
      />
    );
  }

  const rawRows = (settlements ?? []) as Settlement[];

  // Generar signed URLs para facturas existentes (TTL 1 hora) — bucket privado "invoices"
  const rows: Settlement[] = await Promise.all(
    rawRows.map(async (s) => {
      if (!s.invoice_path) return s;
      try {
        const { data: signedData } = await supabase.storage
          .from("invoices")
          .createSignedUrl(s.invoice_path, 3600);
        return { ...s, invoice_signed_url: signedData?.signedUrl ?? null };
      } catch {
        return { ...s, invoice_signed_url: null };
      }
    })
  );

  const thisMonth = getThisMonthRange();
  const lastMonth = getLastMonthRange();

  const thisMonthTotal = rows
    .filter(
      (s) =>
        s.period_start >= thisMonth.start && s.period_start <= thisMonth.end
    )
    .reduce((sum, s) => sum + s.net_amount, 0);

  const lastMonthTotal = rows
    .filter(
      (s) =>
        s.period_start >= lastMonth.start && s.period_start <= lastMonth.end
    )
    .reduce((sum, s) => sum + s.net_amount, 0);

  const statusLabel: Record<SettlementStatus, string> = {
    pending: t("cobros.statusPending"),
    pending_invoice: t("cobros.statusPendingInvoice"),
    invoiced: t("cobros.statusInvoiced"),
    approved: t("cobros.statusApproved"),
    rejected: t("cobros.statusRejected"),
    transferred: t("cobros.statusTransferred"),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("cobros.title")}</h1>
        <p className="text-muted text-sm mt-1">{t("cobros.subtitle")}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-muted text-xs uppercase tracking-wider mb-2">
            {t("cobros.thisMonth")}
          </p>
          <p className="text-lime text-2xl font-bold">
            {formatCents(thisMonthTotal)}
          </p>
          <p className="text-muted text-xs mt-1 opacity-60">neto estimado</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-muted text-xs uppercase tracking-wider mb-2">
            {t("cobros.lastMonth")}
          </p>
          <p className="text-text text-2xl font-bold">
            {formatCents(lastMonthTotal)}
          </p>
          <p className="text-muted text-xs mt-1 opacity-60">neto cobrado</p>
        </div>
      </div>

      {/* Settlements table */}
      {rows.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-4xl mb-4">💰</p>
          <p className="text-text text-lg font-semibold">{t("cobros.emptyState")}</p>
          <p className="text-muted text-sm mt-2">
            {t("cobros.emptySubtitle")}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">{t("cobros.colPeriod")}</th>
                <th className="text-right px-6 py-3 hidden md:table-cell">{t("cobros.colGross")}</th>
                <th className="text-right px-6 py-3 hidden md:table-cell">{t("cobros.colCommission")}</th>
                <th className="text-right px-6 py-3">{t("cobros.colNet")}</th>
                <th className="text-left px-6 py-3">{t("cobros.colStatus")}</th>
                <th className="text-right px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-2">
              {rows.map((s) => (
                <tr key={s.id} className="hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-text font-medium">
                      {formatDate(s.period_start)}
                    </p>
                    <p className="text-muted text-xs opacity-60">
                      {t("cobros.periodTo")} {formatDate(s.period_end)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right text-muted hidden md:table-cell">
                    {formatCents(s.gross_amount)}
                  </td>
                  <td className="px-6 py-4 text-right text-red-400 hidden md:table-cell">
                    -{formatCents(s.commission)}
                  </td>
                  <td className="px-6 py-4 text-right text-lime font-semibold">
                    {formatCents(s.net_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}
                    >
                      {statusLabel[s.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(s.status === "pending" || s.status === "pending_invoice") && (
                      <InvoiceUploadButton settlementId={s.id} />
                    )}
                    {(s.status === "invoiced" || s.status === "approved" || s.status === "rejected" || s.status === "transferred") && s.invoice_signed_url && (
                      <InvoiceViewButton signedUrl={s.invoice_signed_url} />
                    )}
                    {(s.status === "invoiced" || s.status === "approved" || s.status === "rejected" || s.status === "transferred") && !s.invoice_signed_url && (
                      <span className="text-muted text-xs opacity-60">{t("cobros.pending")}</span>
                    )}
                    {s.status === "transferred" && s.transferred_at && (
                      <p className="text-muted text-xs mt-1 opacity-60">
                        {formatDate(s.transferred_at)}
                      </p>
                    )}
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
