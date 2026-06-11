import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { colors, spacing, fontSize, typography } from "@forzza/ui/tokens";
import {
  Button,
  Card,
  Pill,
  EmptyState,
  ErrorState,
  Skeleton,
  Toast,
  UpgradeModal,
  SectionLabel,
  StatTile,
  NumInput,
  WeightInput,
  Tabs,
  PaymentSummary,
  NotificationRow,
  LineChart,
  Sheet,
  RestTimer,
  Confetti,
  Input,
} from "@forzza/ui/native";

const TABS_DEMO = [
  { key: "rutinas", label: "Rutinas" },
  { key: "historial", label: "Historial" },
  { key: "progreso", label: "Progreso" },
  { key: "coaches", label: "Coaches" },
];

const CHART_DATA = [40, 65, 52, 78, 90, 84, 95, 70, 88, 100, 92, 110];

function SectionHeading({ children }: { children: string }) {
  return (
    <Text style={styles.sectionHeading}>{children}</Text>
  );
}

export default function StyleguideScreen() {
  const [activeTab, setActiveTab] = useState("rutinas");
  const [numValue, setNumValue] = useState(8);
  const [weightValue, setWeightValue] = useState(80);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);

  return (
    <View style={styles.root}>
      <Confetti active={confettiActive} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>FORZZA</Text>
        <Text style={styles.subtitle}>Styleguide de componentes nativos</Text>

        {/* ── SectionLabel ── */}
        <View style={styles.section}>
          <SectionHeading>SectionLabel</SectionHeading>
          <Card padding="md">
            <View style={{ gap: spacing[4] }}>
              <SectionLabel>Estadísticas del mes</SectionLabel>
              <SectionLabel>Progreso semanal</SectionLabel>
              <SectionLabel style={{ color: colors.lime }}>Destacado</SectionLabel>
            </View>
          </Card>
        </View>

        {/* ── StatTile ── */}
        <View style={styles.section}>
          <SectionHeading>StatTile</SectionHeading>
          <View style={styles.row}>
            <StatTile value="24" label="Sesiones" />
            <StatTile value="92%" label="Asistencia" />
            <StatTile value="PRO" label="Plan" color={colors.purple} />
          </View>
          <View style={[styles.row, { marginTop: spacing[2] }]}>
            <StatTile value="8 500" label="Kg levant." />
            <StatTile value="3:45" label="Prom." color={colors.info} />
            <StatTile value="12" label="Alumnos" color={colors.orange} />
          </View>
        </View>

        {/* ── Button ── */}
        <View style={styles.section}>
          <SectionHeading>Button</SectionHeading>
          <View style={styles.col}>
            <View style={styles.row}>
              <Button label="Primary" variant="primary" />
              <Button label="Secondary" variant="secondary" />
            </View>
            <View style={styles.row}>
              <Button label="Ghost" variant="ghost" />
              <Button label="Danger" variant="danger" />
            </View>
            <View style={styles.row}>
              <Button label="Loading" loading />
              <Button label="Disabled" disabled />
            </View>
            <View style={styles.row}>
              <Button label="Small" size="sm" />
              <Button label="Large" size="lg" />
            </View>
          </View>
        </View>

        {/* ── Input ── */}
        <View style={styles.section}>
          <SectionHeading>Input</SectionHeading>
          <View style={styles.col}>
            <Input label="Email" placeholder="nombre@forzza.app" keyboardType="email-address" />
            <Input label="Contraseña" placeholder="••••••••" secureTextEntry />
            <Input label="Con error" placeholder="Ingresar texto" error="Campo requerido" />
            <Input label="Deshabilitado" placeholder="No editable" editable={false} />
          </View>
        </View>

        {/* ── NumInput ── */}
        <View style={styles.section}>
          <SectionHeading>NumInput</SectionHeading>
          <Card padding="lg">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing[8], justifyContent: "center" }}>
              <NumInput
                label="Series"
                value={numValue}
                onChange={setNumValue}
                min={1}
                max={20}
              />
              <NumInput
                label="Repeticiones"
                value={numValue * 2}
                onChange={() => {}}
                min={1}
                max={50}
                step={2}
              />
              <NumInput
                label="Descanso (s)"
                value={90}
                onChange={() => {}}
                min={0}
                step={15}
              />
              <NumInput
                label="Disabled"
                value={5}
                onChange={() => {}}
                disabled
              />
            </View>
          </Card>
        </View>

        {/* ── WeightInput ── */}
        <View style={styles.section}>
          <SectionHeading>WeightInput</SectionHeading>
          <Card padding="lg">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing[8], justifyContent: "center" }}>
              <WeightInput
                value={weightValue}
                onChange={setWeightValue}
                unit={weightUnit}
                onUnitChange={setWeightUnit}
              />
              <WeightInput value={60} onChange={() => {}} unit="lb" />
              <WeightInput value={100} onChange={() => {}} disabled />
            </View>
          </Card>
        </View>

        {/* ── Pill ── */}
        <View style={styles.section}>
          <SectionHeading>Pill</SectionHeading>
          <View style={styles.row}>
            <Pill label="Default" variant="default" />
            <Pill label="Active" variant="active" />
            <Pill label="Success" variant="success" />
          </View>
          <View style={[styles.row, { marginTop: spacing[2] }]}>
            <Pill label="Warning" variant="warning" />
            <Pill label="Error" variant="error" />
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.section}>
          <SectionHeading>Tabs</SectionHeading>
          <Card padding="sm">
            <Tabs tabs={TABS_DEMO} activeKey={activeTab} onTabChange={setActiveTab} />
            <View style={{ padding: spacing[4] }}>
              <Text style={styles.mutedText}>
                Tab activo:{" "}
                <Text style={{ color: colors.lime, fontWeight: "700" }}>{activeTab}</Text>
              </Text>
            </View>
          </Card>
        </View>

        {/* ── Card variants ── */}
        <View style={styles.section}>
          <SectionHeading>Card</SectionHeading>
          <View style={styles.col}>
            <Card padding="sm" variant="surface">
              <Text style={styles.mutedText}>variant="surface" · padding sm</Text>
            </Card>
            <Card padding="md" variant="surface2">
              <Text style={styles.mutedText}>variant="surface2" · padding md</Text>
            </Card>
            <Card padding="lg" variant="surface3">
              <Text style={styles.mutedText}>variant="surface3" · padding lg</Text>
            </Card>
            <Card padding="md" featured>
              <Text style={styles.mutedText}>featured=true (borde lime + glow)</Text>
            </Card>
            <Card padding="md" onPress={() => {}}>
              <Text style={styles.mutedText}>onPress — toca para escalar</Text>
            </Card>
          </View>
        </View>

        {/* ── LineChart ── */}
        <View style={styles.section}>
          <SectionHeading>LineChart</SectionHeading>
          <View style={styles.col}>
            <Card padding="md">
              <SectionLabel style={{ marginBottom: spacing[3] }}>Kg levantados (12 sem.)</SectionLabel>
              <LineChart data={CHART_DATA} width={300} height={80} showDots />
            </Card>
            <Card padding="md">
              <SectionLabel style={{ marginBottom: spacing[3] }}>Asistencia</SectionLabel>
              <LineChart
                data={[70, 80, 60, 85, 90, 75, 95]}
                width={300}
                height={60}
                color={colors.info}
              />
            </Card>
            <Card padding="md">
              <SectionLabel style={{ marginBottom: spacing[3] }}>Progreso de peso</SectionLabel>
              <LineChart
                data={[78, 77.5, 77, 76.8, 76.5, 76, 75.8]}
                width={300}
                height={60}
                color={colors.orange}
                showDots
              />
            </Card>
          </View>
        </View>

        {/* ── PaymentSummary ── */}
        <View style={styles.section}>
          <SectionHeading>PaymentSummary</SectionHeading>
          <View style={styles.col}>
            <PaymentSummary bruto={1500000} comision={300000} neto={1200000} currency="ARS" />
            <PaymentSummary bruto={5000000} comision={1000000} neto={4000000} currency="CLP" />
          </View>
        </View>

        {/* ── NotificationRow ── */}
        <View style={styles.section}>
          <SectionHeading>NotificationRow</SectionHeading>
          <Card padding="sm" style={{ overflow: "hidden" }}>
            <NotificationRow
              icon={<Text style={{ fontSize: 18 }}>💪</Text>}
              title="Nueva rutina asignada"
              body="Tu coach Marcos te asignó la rutina Fuerza A — semana 3. Entrena hoy a las 18 hs."
              time="5 min"
              read={false}
              onPress={() => {}}
            />
            <View style={styles.divider} />
            <NotificationRow
              icon={<Text style={{ fontSize: 18 }}>✅</Text>}
              title="Pago procesado"
              body="Tu suscripción PRO fue renovada exitosamente por ARS 15.000."
              time="ayer"
              read
            />
            <View style={styles.divider} />
            <NotificationRow
              icon={<Text style={{ fontSize: 18 }}>🔔</Text>}
              title="Recordatorio de rutina"
              body="Tenes una sesión pendiente: Cardio HIIT. No te olvides de completarla hoy."
              time="lunes"
              read={false}
            />
          </Card>
        </View>

        {/* ── Toast ── */}
        <View style={styles.section}>
          <SectionHeading>Toast</SectionHeading>
          <View style={styles.col}>
            <Toast message="Rutina guardada correctamente." type="success" />
            <Toast message="No se pudo conectar con el servidor." type="error" />
            <Toast message="Tu plan vence en 3 días." type="warning" />
            <Toast message="Tenes 2 nuevas notificaciones." type="info" />
          </View>
        </View>

        {/* ── RestTimer ── */}
        <View style={styles.section}>
          <SectionHeading>RestTimer</SectionHeading>
          <Card padding="lg">
            <View style={{ alignItems: "center", gap: spacing[8] }}>
              <View style={{ alignItems: "center", gap: spacing[3] }}>
                <SectionLabel>Descanso (90 seg)</SectionLabel>
                <RestTimer seconds={90} onComplete={() => {}} size={160} />
              </View>
              <View style={{ flexDirection: "row", gap: spacing[8] }}>
                <View style={{ alignItems: "center", gap: spacing[2] }}>
                  <SectionLabel>30 seg</SectionLabel>
                  <RestTimer seconds={30} size={100} color={colors.orange} />
                </View>
                <View style={{ alignItems: "center", gap: spacing[2] }}>
                  <SectionLabel>3 min</SectionLabel>
                  <RestTimer seconds={180} size={100} color={colors.info} />
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* ── Sheet ── */}
        <View style={styles.section}>
          <SectionHeading>Sheet</SectionHeading>
          <Button
            label="Abrir Sheet"
            variant="secondary"
            onPress={() => setSheetOpen(true)}
          />
          <Sheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
            <View style={{ padding: spacing[4], gap: spacing[3] }}>
              <Text style={styles.sheetTitle}>Opciones de rutina</Text>
              {["Editar rutina", "Duplicar rutina", "Archivar rutina"].map((item) => (
                <Button
                  key={item}
                  label={item}
                  variant="ghost"
                  onPress={() => setSheetOpen(false)}
                />
              ))}
              <Button
                label="Eliminar rutina"
                variant="danger"
                onPress={() => setSheetOpen(false)}
              />
            </View>
          </Sheet>
        </View>

        {/* ── UpgradeModal ── */}
        <View style={styles.section}>
          <SectionHeading>UpgradeModal</SectionHeading>
          <Button
            label="Abrir UpgradeModal"
            variant="primary"
            onPress={() => setUpgradeOpen(true)}
          />
          <UpgradeModal
            visible={upgradeOpen}
            onClose={() => setUpgradeOpen(false)}
            onUpgrade={() => setUpgradeOpen(false)}
            feature="historial completo"
          />
        </View>

        {/* ── Confetti ── */}
        <View style={styles.section}>
          <SectionHeading>Confetti</SectionHeading>
          <Card padding="md">
            <Text style={[styles.mutedText, { marginBottom: spacing[3] }]}>
              Toca el botón para disparar la animación de confetti.
            </Text>
            <Button
              label={confettiActive ? "Confetti activo..." : "Disparar Confetti"}
              variant="primary"
              onPress={() => {
                setConfettiActive(true);
                setTimeout(() => setConfettiActive(false), 3000);
              }}
            />
          </Card>
        </View>

        {/* ── EmptyState / ErrorState ── */}
        <View style={styles.section}>
          <SectionHeading>EmptyState / ErrorState</SectionHeading>
          <View style={styles.col}>
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
          </View>
        </View>

        {/* ── Skeleton ── */}
        <View style={[styles.section, { marginBottom: spacing[16] }]}>
          <SectionHeading>Skeleton</SectionHeading>
          <View style={styles.col}>
            <Card>
              <View style={{ gap: spacing[3] }}>
                <Skeleton height={20} width={160} />
                <Skeleton height={14} />
                <Skeleton height={14} width={220} />
                <Skeleton height={14} width={100} />
              </View>
            </Card>
            <Card>
              <View style={{ gap: spacing[3] }}>
                <Skeleton height={80} />
                <Skeleton height={16} width={180} />
                <Skeleton height={12} width={120} />
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
  },
  title: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: fontSize["5xl"],
    letterSpacing: 2,
    marginBottom: spacing[1],
  },
  subtitle: {
    color: colors.muted,
    fontSize: fontSize.sm,
    marginBottom: spacing[10],
    letterSpacing: 0.5,
  },
  sectionHeading: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize["2xl"],
    letterSpacing: 1,
    marginBottom: spacing[3],
  },
  section: {
    marginBottom: spacing[10],
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[3],
    alignItems: "center",
  },
  col: {
    flexDirection: "column",
    gap: spacing[3],
  },
  mutedText: {
    fontSize: fontSize.sm,
    color: colors.muted,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sheetTitle: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize["2xl"],
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
});
