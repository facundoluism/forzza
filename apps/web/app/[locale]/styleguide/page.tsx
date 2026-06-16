"use client";

import { useState } from "react";
import { colors, spacing } from "@forzza/ui/tokens";
import {
  Button,
  Card,
  Pill,
  EmptyState,
  ErrorState,
  Skeleton,
  SectionLabel,
  StatTile,
  NumInput,
  WeightInput,
  Tabs,
  PaymentSummary,
  NotificationRow,
  LineChart,
  Sheet,
  Toast,
  DataTable,
  CalendarMonth,
  UpgradeModal,
  Input,
} from "@forzza/ui/web";

const TABS_DEMO = [
  { key: "rutinas", label: "Rutinas" },
  { key: "historial", label: "Historial" },
  { key: "progreso", label: "Progreso" },
  { key: "coaches", label: "Coaches" },
];

const TABLE_COLUMNS = [
  { key: "alumno", label: "Alumno", sortable: true },
  { key: "plan", label: "Plan", sortable: false },
  { key: "monto", label: "Monto", sortable: true },
  { key: "estado", label: "Estado", sortable: false },
];

const TABLE_DATA = [
  { alumno: "Facundo Alvarez", plan: "PRO mensual", monto: 15000, estado: "Activo" },
  { alumno: "Mariana Lopez", plan: "PRO mensual", monto: 15000, estado: "Activo" },
  { alumno: "Sebastian Rios", plan: "PRO anual", monto: 120000, estado: "Activo" },
  { alumno: "Valentina Cruz", plan: "Free", monto: 0, estado: "Free" },
  { alumno: "Diego Moreno", plan: "PRO mensual", monto: 15000, estado: "Vencido" },
  { alumno: "Camila Vega", plan: "PRO mensual", monto: 15000, estado: "Activo" },
];

const CHART_DATA = [40, 65, 52, 78, 90, 84, 95, 70, 88, 100, 92, 110];

const CALENDAR_EVENTS = [
  { date: "2026-06-02", color: colors.lime, label: "Fuerza" },
  { date: "2026-06-04", color: colors.lime, label: "Fuerza" },
  { date: "2026-06-05", color: colors.info, label: "Cardio" },
  { date: "2026-06-09", color: colors.lime, label: "Fuerza" },
  { date: "2026-06-11", color: colors.orange, label: "Full Body" },
  { date: "2026-06-12", color: colors.purple, label: "Espalda" },
  { date: "2026-06-16", color: colors.lime, label: "Fuerza" },
  { date: "2026-06-18", color: colors.info, label: "Cardio" },
  { date: "2026-06-20", color: colors.error, label: "Descanso" },
  { date: "2026-06-23", color: colors.lime, label: "Fuerza" },
  { date: "2026-06-25", color: colors.orange, label: "Piernas" },
];

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      style={{
        color: colors.white,
        marginBottom: `${spacing[4]}px`,
        fontFamily: "BebasNeue, sans-serif",
        fontSize: "24px",
        letterSpacing: "1px",
        marginTop: 0,
      }}
    >
      {children}
    </h2>
  );
}

export default function StyleguidePage() {
  const [activeTab, setActiveTab] = useState("rutinas");
  const [numValue, setNumValue] = useState(8);
  const [weightValue, setWeightValue] = useState(80);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  return (
    <main
      style={{
        backgroundColor: colors.bg,
        minHeight: "100vh",
        padding: `${spacing[8]}px`,
        fontFamily: "DMSans, sans-serif",
      }}
    >
      <h1
        style={{
          color: colors.lime,
          fontFamily: "BebasNeue, sans-serif",
          fontSize: "56px",
          marginBottom: `${spacing[2]}px`,
          letterSpacing: "2px",
          marginTop: 0,
        }}
      >
        FORZZA — Styleguide
      </h1>
      <p style={{ color: colors.muted, marginBottom: `${spacing[10]}px`, marginTop: 0 }}>
        Referencia visual de todos los componentes del design system.
      </p>

      {/* ── Colores ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Colores</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[3]}px` }}>
          {Object.entries(colors).map(([name, value]) => (
            <div key={name} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  backgroundColor: value,
                  borderRadius: "8px",
                  border: `1px solid ${colors.gray700}`,
                }}
              />
              <p style={{ color: colors.gray400, fontSize: "10px", marginTop: "4px", marginBottom: 0 }}>
                {name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SectionLabel ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>SectionLabel</SectionHeading>
        <Card padding="md">
          <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[4]}px` }}>
            <SectionLabel>Estadísticas del mes</SectionLabel>
            <SectionLabel>Progreso semanal</SectionLabel>
            <SectionLabel style={{ color: colors.lime }}>Destacado</SectionLabel>
          </div>
        </Card>
      </section>

      {/* ── StatTile ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>StatTile</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[3]}px` }}>
          <StatTile value="24" label="Sesiones" />
          <StatTile value="8 500" label="Kg levantados" />
          <StatTile value="92%" label="Asistencia" />
          <StatTile value="3:45" label="Tiempo prom." color={colors.info} />
          <StatTile value="12" label="Alumnos activos" color={colors.orange} />
          <StatTile value="PRO" label="Plan actual" color={colors.purple} />
        </div>
      </section>

      {/* ── Botones ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Button</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[3]}px`, alignItems: "center" }}>
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
          <Button label="Danger" variant="danger" />
          <Button label="Loading" loading />
          <Button label="Disabled" disabled />
          <Button label="Small" size="sm" />
          <Button label="Large" size="lg" />
        </div>
      </section>

      {/* ── Input ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Input</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: `${spacing[4]}px`,
          }}
        >
          <Input label="Email" placeholder="nombre@forzza.app" type="email" />
          <Input label="Contraseña" placeholder="••••••••" type="password" />
          <Input label="Con error" placeholder="Ingresar texto" error="Campo requerido" />
          <Input label="Deshabilitado" placeholder="No editable" disabled />
        </div>
      </section>

      {/* ── NumInput ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>NumInput</SectionHeading>
        <Card padding="lg">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: `${spacing[8]}px`,
              alignItems: "flex-start",
            }}
          >
            <NumInput label="Series" value={numValue} onChange={setNumValue} min={1} max={20} />
            <NumInput label="Repeticiones" value={numValue * 2} onChange={() => {}} min={1} max={50} step={2} />
            <NumInput label="Descanso (seg)" value={90} onChange={() => {}} min={0} step={15} />
            <NumInput label="Disabled" value={5} onChange={() => {}} disabled />
          </div>
        </Card>
      </section>

      {/* ── WeightInput ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>WeightInput</SectionHeading>
        <Card padding="lg">
          <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[8]}px`, alignItems: "flex-start" }}>
            <WeightInput
              value={weightValue}
              onChange={setWeightValue}
              unit={weightUnit}
              onUnitChange={setWeightUnit}
            />
            <WeightInput value={60} onChange={() => {}} unit="lb" />
            <WeightInput value={100} onChange={() => {}} disabled />
          </div>
        </Card>
      </section>

      {/* ── Pills ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Pill</SectionHeading>
        <div style={{ display: "flex", gap: `${spacing[2]}px`, flexWrap: "wrap" }}>
          <Pill label="Default" variant="default" />
          <Pill label="Active" variant="active" />
          <Pill label="Success" variant="success" />
          <Pill label="Warning" variant="warning" />
          <Pill label="Error" variant="error" />
        </div>
      </section>

      {/* ── Tabs ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Tabs</SectionHeading>
        <Card padding="sm">
          <Tabs tabs={TABS_DEMO} activeKey={activeTab} onTabChange={setActiveTab} />
          <div style={{ padding: `${spacing[4]}px` }}>
            <p style={{ color: colors.muted, margin: 0, fontSize: "14px" }}>
              Tab activo: <span style={{ color: colors.lime, fontWeight: 700 }}>{activeTab}</span>
            </p>
          </div>
        </Card>
      </section>

      {/* ── Cards ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Card</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: `${spacing[4]}px`,
          }}
        >
          <Card padding="sm">
            <p style={{ color: colors.gray300, margin: 0, fontSize: "13px" }}>padding sm</p>
          </Card>
          <Card padding="md">
            <p style={{ color: colors.gray300, margin: 0, fontSize: "13px" }}>padding md</p>
          </Card>
          <Card padding="lg">
            <p style={{ color: colors.gray300, margin: 0, fontSize: "13px" }}>padding lg</p>
          </Card>
        </div>
      </section>

      {/* ── LineChart ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>LineChart</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[4]}px` }}>
          <Card padding="md">
            <SectionLabel style={{ marginBottom: `${spacing[3]}px` }}>Kg levantados (12 sem.)</SectionLabel>
            <LineChart data={CHART_DATA} width={300} height={80} showDots />
          </Card>
          <Card padding="md">
            <SectionLabel style={{ marginBottom: `${spacing[3]}px` }}>Asistencia</SectionLabel>
            <LineChart
              data={[70, 80, 60, 85, 90, 75, 95]}
              width={220}
              height={60}
              color={colors.info}
            />
          </Card>
          <Card padding="md">
            <SectionLabel style={{ marginBottom: `${spacing[3]}px` }}>Progreso de peso</SectionLabel>
            <LineChart
              data={[78, 77.5, 77, 76.8, 76.5, 76, 75.8]}
              width={220}
              height={60}
              color={colors.orange}
              showDots
            />
          </Card>
        </div>
      </section>

      {/* ── CalendarMonth ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>CalendarMonth</SectionHeading>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[4]}px` }}>
          <CalendarMonth year={2026} month={6} events={CALENDAR_EVENTS} onDateClick={() => {}} />
          <CalendarMonth year={2026} month={7} />
        </div>
      </section>

      {/* ── PaymentSummary ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>PaymentSummary</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: `${spacing[4]}px`,
          }}
        >
          <PaymentSummary bruto={1500000} comision={300000} neto={1200000} currency="ARS" />
          <PaymentSummary bruto={5000000} comision={1000000} neto={4000000} currency="CLP" />
          <PaymentSummary bruto={1000} comision={200} neto={800} currency="USD" />
        </div>
      </section>

      {/* ── NotificationRow ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>NotificationRow</SectionHeading>
        <Card padding="sm">
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
            }}
          >
            <NotificationRow
              icon={<span style={{ fontSize: "18px" }}>💪</span>}
              title="Nueva rutina asignada"
              body="Tu coach Marcos te asignó la rutina Fuerza A — semana 3. Entrena hoy a las 18 hs."
              time="hace 5 min"
              read={false}
              onPress={() => {}}
            />
            <NotificationRow
              icon={<span style={{ fontSize: "18px" }}>✅</span>}
              title="Pago procesado"
              body="Tu suscripción PRO fue renovada exitosamente por ARS 15.000."
              time="ayer"
              read
            />
            <NotificationRow
              icon={<span style={{ fontSize: "18px" }}>🔔</span>}
              title="Recordatorio de rutina"
              body="Tenes una sesión pendiente: Cardio HIIT. No te olvides de completarla hoy."
              time="lunes"
              read={false}
            />
            <NotificationRow
              icon={<span style={{ fontSize: "18px" }}>⭐</span>}
              title="Coach destacado"
              body="El coach Lucas Fernandez tiene nuevos lugares disponibles."
              time="mar"
              read
            />
          </div>
        </Card>
      </section>

      {/* ── DataTable ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>DataTable</SectionHeading>
        <DataTable columns={TABLE_COLUMNS} data={TABLE_DATA} pageSize={4} />
      </section>

      {/* ── Toast ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Toast</SectionHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[3]}px`, alignItems: "flex-start" }}>
          <Toast message="Rutina guardada correctamente." type="success" />
          <Toast message="No se pudo conectar con el servidor." type="error" />
          <Toast message="Tu plan vence en 3 días." type="warning" />
          <Toast message="Tenes 2 nuevas notificaciones." type="info" />
          {toastVisible && (
            <Toast
              message="Toast con dismiss — click X para cerrar."
              type="info"
              onDismiss={() => setToastVisible(false)}
            />
          )}
          <Button
            label={toastVisible ? "Toast visible" : "Mostrar Toast con dismiss"}
            variant="secondary"
            size="sm"
            onClick={() => setToastVisible(true)}
          />
        </div>
      </section>

      {/* ── Sheet ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Sheet</SectionHeading>
        <Button label="Abrir Sheet" variant="secondary" onClick={() => setSheetOpen(true)} />
        <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
          <div style={{ padding: `${spacing[4]}px 0` }}>
            <h3
              style={{
                color: colors.white,
                fontFamily: "BebasNeue, sans-serif",
                fontSize: "28px",
                margin: `0 0 ${spacing[4]}px`,
                letterSpacing: "1px",
              }}
            >
              Opciones de rutina
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[3]}px` }}>
              {["Editar rutina", "Duplicar rutina", "Archivar rutina", "Eliminar rutina"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    style={{
                      background: "none",
                      border: `1px solid ${colors.border}`,
                      borderRadius: "8px",
                      padding: `${spacing[3]}px ${spacing[4]}px`,
                      color: item.includes("Eliminar") ? colors.error : colors.text,
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>
        </Sheet>
      </section>

      {/* ── UpgradeModal ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>UpgradeModal</SectionHeading>
        <Button label="Abrir UpgradeModal" variant="primary" onClick={() => setUpgradeOpen(true)} />
        <UpgradeModal
          visible={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          onUpgrade={() => setUpgradeOpen(false)}
          feature="historial completo"
        />
      </section>

      {/* ── Estados ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>EmptyState / ErrorState</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: `${spacing[4]}px`,
          }}
        >
          <Card>
            <EmptyState
              title="Sin rutinas"
              description="Todavia no tenes ninguna rutina asignada. Tu coach te enviara una pronto."
              actionLabel="Explorar coaches"
              onAction={() => {}}
            />
          </Card>
          <Card>
            <ErrorState title="Error de conexion" onRetry={() => {}} />
          </Card>
        </div>
      </section>

      {/* ── Skeleton ── */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <SectionHeading>Skeleton</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: `${spacing[4]}px`,
          }}
        >
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[3]}px` }}>
              <Skeleton height={20} width="55%" />
              <Skeleton height={14} />
              <Skeleton height={14} width="80%" />
              <Skeleton height={14} width="40%" />
            </div>
          </Card>
          <Card>
            <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[3]}px` }}>
              <Skeleton height={80} />
              <Skeleton height={16} width="70%" />
              <Skeleton height={12} width="50%" />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
