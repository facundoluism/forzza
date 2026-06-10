import { colors, spacing } from "@forzza/ui";
import { Button, Card, Pill, EmptyState, ErrorState, Skeleton } from "@forzza/ui/web";

export default function StyleguidePage() {
  return (
    <main style={{ backgroundColor: colors.black, minHeight: "100vh", padding: `${spacing[8]}px` }}>
      <h1 style={{ color: colors.lime, fontFamily: "BebasNeue, sans-serif", fontSize: "48px", marginBottom: `${spacing[8]}px` }}>
        FORZZA — Styleguide
      </h1>

      {/* Colores */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <h2 style={{ color: colors.white, marginBottom: `${spacing[4]}px` }}>Colores</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing[3]}px` }}>
          {Object.entries(colors).map(([name, value]) => (
            <div key={name} style={{ textAlign: "center" }}>
              <div style={{
                width: "80px",
                height: "80px",
                backgroundColor: value,
                borderRadius: `${spacing[2]}px`,
                border: `1px solid ${colors.gray700}`,
              }} />
              <p style={{ color: colors.gray400, fontSize: "11px", marginTop: "4px" }}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Botones */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <h2 style={{ color: colors.white, marginBottom: `${spacing[4]}px` }}>Botones</h2>
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

      {/* Pills */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <h2 style={{ color: colors.white, marginBottom: `${spacing[4]}px` }}>Pills</h2>
        <div style={{ display: "flex", gap: `${spacing[2]}px`, flexWrap: "wrap" }}>
          <Pill label="Default" variant="default" />
          <Pill label="Active" variant="active" />
          <Pill label="Success" variant="success" />
          <Pill label="Warning" variant="warning" />
          <Pill label="Error" variant="error" />
        </div>
      </section>

      {/* Cards */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <h2 style={{ color: colors.white, marginBottom: `${spacing[4]}px` }}>Cards</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: `${spacing[4]}px` }}>
          <Card padding="sm"><p style={{ color: colors.gray300, margin: 0 }}>Card sm padding</p></Card>
          <Card padding="md"><p style={{ color: colors.gray300, margin: 0 }}>Card md padding</p></Card>
          <Card padding="lg"><p style={{ color: colors.gray300, margin: 0 }}>Card lg padding</p></Card>
        </div>
      </section>

      {/* Estados */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <h2 style={{ color: colors.white, marginBottom: `${spacing[4]}px` }}>Estados</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: `${spacing[4]}px` }}>
          <Card>
            <EmptyState title="Sin datos" description="No hay nada aquí todavía." actionLabel="Agregar" onAction={() => {}} />
          </Card>
          <Card>
            <ErrorState title="Error de conexión" onRetry={() => {}} />
          </Card>
        </div>
      </section>

      {/* Skeletons */}
      <section style={{ marginBottom: `${spacing[10]}px` }}>
        <h2 style={{ color: colors.white, marginBottom: `${spacing[4]}px` }}>Skeleton</h2>
        <Card>
          <div style={{ display: "flex", flexDirection: "column", gap: `${spacing[3]}px` }}>
            <Skeleton height={20} width="60%" />
            <Skeleton height={14} />
            <Skeleton height={14} width="80%" />
            <Skeleton height={14} width="40%" />
          </div>
        </Card>
      </section>
    </main>
  );
}
