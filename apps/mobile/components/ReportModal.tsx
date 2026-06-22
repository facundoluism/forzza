/**
 * ReportModal — modal genérico para reportar contenido (P1.5).
 * Invoca submit-content-report con el target_type/target_id y un reason + details opcionales.
 * Cumple requisito Google Play de reporte in-app de contenido.
 */
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

export type ReportTargetType =
  | "coach_profile"
  | "video"
  | "message"
  | "progress_photo"
  | "routine"
  | "workout_session";

interface ReportModalProps {
  visible: boolean;
  targetType: ReportTargetType;
  targetId: string;
  onClose: () => void;
}

const REASON_KEYS = [
  "spam",
  "inappropriate",
  "harassment",
  "misinformation",
  "other",
] as const;

type ReasonKey = (typeof REASON_KEYS)[number];

export function ReportModal({
  visible,
  targetType,
  targetId,
  onClose,
}: ReportModalProps): React.JSX.Element {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<ReasonKey | null>(null);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleClose() {
    setSelectedReason(null);
    setDetails("");
    setSubmitting(false);
    setSubmitted(false);
    onClose();
  }

  async function handleSubmit() {
    if (!selectedReason) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("submit-content-report", {
        body: {
          target_type: targetType,
          target_id: targetId,
          reason: selectedReason,
          details: details.trim() || undefined,
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      Alert.alert(t("report.error_title"), t("report.error_desc"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {submitted ? (
            /* ── Success state ── */
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={styles.successTitle}>{t("report.success_title")}</Text>
              <Text style={styles.successDesc}>{t("report.success_desc")}</Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleClose}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>{t("common.close")}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Form state ── */
            <ScrollView
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>{t("report.title")}</Text>
              <Text style={styles.subtitle}>{t("report.subtitle")}</Text>

              {/* Reason selector */}
              <Text style={styles.label}>{t("report.reason_label")}</Text>
              <View style={styles.reasonList}>
                {REASON_KEYS.map((key) => {
                  const isSelected = selectedReason === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      style={[styles.reasonRow, isSelected && styles.reasonRowSelected]}
                      onPress={() => setSelectedReason(key)}
                      activeOpacity={0.7}
                      testID={`report-reason-${key}`}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          isSelected && styles.radioOuterSelected,
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <Text
                        style={[
                          styles.reasonText,
                          isSelected && styles.reasonTextSelected,
                        ]}
                      >
                        {t(`report.reason_${key}`)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Details (optional) */}
              <Text style={styles.label}>{t("report.details_label")}</Text>
              <TextInput
                style={styles.detailsInput}
                value={details}
                onChangeText={setDetails}
                placeholder={t("report.details_placeholder")}
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={3}
                maxLength={500}
                textAlignVertical="top"
                testID="report-details-input"
              />

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    (!selectedReason || submitting) && styles.primaryBtnDisabled,
                  ]}
                  onPress={() => { void handleSubmit(); }}
                  disabled={!selectedReason || submitting}
                  activeOpacity={0.8}
                  testID="report-submit-btn"
                >
                  {submitting ? (
                    <ActivityIndicator color={colors.bg} size="small" />
                  ) : (
                    <Text style={styles.primaryBtnText}>{t("report.submit")}</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleClose}
                  disabled={submitting}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelBtnText}>{t("common.cancel")}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingBottom: spacing[8],
    maxHeight: "85%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginTop: spacing[3],
    marginBottom: spacing[2],
  },
  formContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
  },
  title: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.xl,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[1],
    marginTop: spacing[3],
  },
  subtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginBottom: spacing[5],
    lineHeight: 20,
  },
  label: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[2],
  },
  reasonList: {
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  reasonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    minHeight: 48,
  },
  reasonRowSelected: {
    borderColor: colors.lime,
    backgroundColor: colors.limeGlow,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioOuterSelected: {
    borderColor: colors.lime,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.lime,
  },
  reasonText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    flex: 1,
  },
  reasonTextSelected: {
    color: colors.lime,
    fontWeight: "700",
  },
  detailsInput: {
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    color: colors.text,
    fontFamily: typography.body,
    fontSize: fontSize.base,
    minHeight: 80,
    marginBottom: spacing[5],
  },
  actions: {
    gap: spacing[3],
  },
  primaryBtn: {
    backgroundColor: colors.error,
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  primaryBtnDisabled: {
    opacity: 0.4,
  },
  primaryBtnText: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize.base,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cancelBtn: {
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    paddingVertical: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
  },
  // Success state
  successContainer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[8],
    alignItems: "center",
    gap: spacing[4],
  },
  successIcon: {
    fontSize: 48,
    color: colors.lime,
  },
  successTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.xl,
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  successDesc: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    textAlign: "center",
    lineHeight: 22,
  },
});
