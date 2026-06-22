/**
 * Banner de consentimiento de analytics (primera vez).
 *
 * Muestra un modal la primera vez que el usuario abre la app (decided === false).
 * Al aceptar → el store marca decided + analyticsEnabled = true, y analytics.ts
 * inicializa PostHog la próxima vez que se llame a track().
 * Al rechazar → decided = true, analyticsEnabled = false; PostHog nunca se inicia.
 *
 * No inicializar PostHog hasta que el usuario ACEPTE (ver analytics.ts).
 */

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useAnalyticsConsentStore } from "@/stores/analyticsConsentStore";
import { initAnalyticsIfAllowed } from "@/lib/analytics";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

const PRIVACY_URL = "https://forzza.app/legales/privacidad";

export function AnalyticsConsentBanner(): React.JSX.Element | null {
  const { t } = useTranslation();
  const { decided, accept, reject } = useAnalyticsConsentStore();

  // Solo mostrar si el usuario todavía no decidió
  if (decided) return null;

  function handleAccept() {
    accept();
    // Inicializar PostHog ahora que el usuario aceptó
    initAnalyticsIfAllowed();
  }

  function handleReject() {
    reject();
    // No se inicializa PostHog
  }

  function handlePrivacyLink() {
    void Linking.openURL(PRIVACY_URL);
  }

  return (
    <Modal
      visible={!decided}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Ícono */}
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📊</Text>
          </View>

          {/* Título */}
          <Text style={styles.title}>{t("analyticsConsent.title")}</Text>

          {/* Cuerpo */}
          <Text style={styles.body}>{t("analyticsConsent.body")}</Text>

          {/* Link política de privacidad */}
          <TouchableOpacity onPress={handlePrivacyLink} activeOpacity={0.7}>
            <Text style={styles.link}>{t("analyticsConsent.privacyLink")}</Text>
          </TouchableOpacity>

          {/* Botones */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={handleReject}
              activeOpacity={0.7}
              testID="analytics-consent-reject"
            >
              <Text style={styles.rejectText}>{t("analyticsConsent.reject")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handleAccept}
              activeOpacity={0.7}
              testID="analytics-consent-accept"
            >
              <Text style={styles.acceptText}>{t("analyticsConsent.accept")}</Text>
            </TouchableOpacity>
          </View>

          {/* Nota de privacidad */}
          <Text style={styles.note}>{t("analyticsConsent.note")}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.72)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing[5],
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[6],
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[4],
  },
  icon: {
    fontSize: 26,
  },
  title: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["2xl"],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: spacing[3],
  },
  body: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: spacing[3],
  },
  link: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
    textDecorationLine: "underline",
    marginBottom: spacing[5],
  },
  actions: {
    flexDirection: "row",
    gap: spacing[3],
    width: "100%",
    marginBottom: spacing[4],
  },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  rejectText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    fontWeight: "600",
  },
  acceptButton: {
    flex: 1,
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  acceptText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize.base,
    letterSpacing: 0.5,
  },
  note: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: fontSize.xs,
    textAlign: "center",
    lineHeight: 16,
  },
});
