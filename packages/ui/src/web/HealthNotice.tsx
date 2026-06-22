export interface HealthNoticeProps {
  text: string;
  /** Optional URL to link to the full health disclaimer page */
  href?: string;
  /** Link label (replaces the full text as the link anchor if provided separately) */
  linkLabel?: string;
  /** Optional label for screen-reader accessibility */
  accessibilityLabel?: string;
}

/**
 * HealthNotice — aviso corto de disclaimer de salud/fitness.
 * Texto estático localizado. No intrusivo: nota al pie con borde izquierdo lime tenue.
 * API idéntica al componente native.
 */
export function HealthNotice({
  text,
  href,
  linkLabel,
  accessibilityLabel,
}: HealthNoticeProps) {
  return (
    <p
      aria-label={accessibilityLabel ?? text}
      style={{
        margin: 0,
        padding: "8px 12px",
        borderLeft: "2px solid rgba(200,255,0,0.5)",
        backgroundColor: "rgba(200,255,0,0.04)",
        borderRadius: "4px",
        fontSize: "12px",
        color: "var(--color-muted)",
        lineHeight: "1.5",
        maxWidth: "680px",
        textAlign: "left",
      }}
    >
      {text}
      {href && (
        <>
          {" "}
          <a
            href={href}
            style={{
              color: "var(--color-lime)",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            {linkLabel ?? href}
          </a>
        </>
      )}
    </p>
  );
}
