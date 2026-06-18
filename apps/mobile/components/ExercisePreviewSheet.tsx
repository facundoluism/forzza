import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import YoutubePlayer from "react-native-youtube-iframe";
import type { Database } from "@forzza/db-types";
import { Sheet, Tabs, Pill, ErrorState, EmptyState, ExerciseIcon, Button } from "@forzza/ui/native";
import { colors, spacing, fontSize, typography, radius } from "@forzza/ui/tokens";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useLanguageStore, type AppLanguage } from "@/stores/languageStore";
import { getExerciseIconKey } from "@/constants/exerciseIcons";
import { localizeMeta } from "@/constants/exerciseI18n";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ExerciseLibraryRow = Database["public"]["Tables"]["exercise_library"]["Row"];

type ExerciseVideoRow = Database["public"]["Tables"]["exercise_videos"]["Row"];

type ExerciseVideoData = Pick<
  ExerciseVideoRow,
  "youtube_id" | "title" | "channel_title" | "duration_seconds" | "lang"
>;

export interface ExercisePreviewSheetProps {
  exerciseId: string | null; // null = cerrado
  onClose: () => void;
  /** Props opcionales de la rutina: se muestran en el header si están presentes. */
  sets?: number | null;
  reps?: string | null;
  weightKg?: number | null;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchExerciseDetail(id: string): Promise<ExerciseLibraryRow> {
  const { data, error } = await supabase
    .from("exercise_library")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (!data) throw new Error("Ejercicio no encontrado.");
  return data;
}

async function fetchExerciseVideo(
  exerciseId: string,
  language: AppLanguage,
): Promise<ExerciseVideoData | null> {
  const { data, error } = await supabase
    .from("exercise_videos")
    .select("youtube_id, title, channel_title, duration_seconds, lang")
    .eq("exercise_id", exerciseId)
    .eq("status", "published");

  if (error) throw error;
  if (!data || data.length === 0) return null;

  // Preferir el video en el idioma activo; fallback al otro idioma
  const preferred = data.find((v) => v.lang === language);
  if (preferred) return preferred;
  return data[0] ?? null;
}

// Ancho de pantalla para calcular el alto 16:9 del player
const SCREEN_WIDTH = Dimensions.get("window").width;
// El sheet ocupa el ancho completo menos el padding horizontal del contenido
const PLAYER_WIDTH = SCREEN_WIDTH - spacing[5] * 2;
const PLAYER_HEIGHT = Math.round(PLAYER_WIDTH * (9 / 16));

// ─── Helpers de localización ──────────────────────────────────────────────────

/**
 * Devuelve un array de strings JSONB localizado, con fallback robusto:
 * - si el campo del idioma activo tiene items → úsalo
 * - si no, intenta el otro idioma
 * - si tampoco, devuelve []
 */
function localizeJsonbArray(
  esField: unknown,
  enField: unknown,
  language: string,
): string[] {
  const pick = (field: unknown): string[] | null => {
    if (Array.isArray(field) && field.length > 0) {
      return field as string[];
    }
    return null;
  };
  if (language === "es") {
    return pick(esField) ?? pick(enField) ?? [];
  }
  return pick(enField) ?? pick(esField) ?? [];
}

// ─── Tab: Ejecución ───────────────────────────────────────────────────────────

interface EjecucionTabProps {
  executionStepsEs: unknown;
  executionStepsEn: unknown;
  descriptionEs: string | null;
  descriptionEn: string | null;
  proTipEs: string | null;
  proTipEn: string | null;
  language: AppLanguage;
}

function EjecucionTab({
  executionStepsEs,
  executionStepsEn,
  descriptionEs,
  descriptionEn,
  proTipEs,
  proTipEn,
  language,
}: EjecucionTabProps): React.JSX.Element {
  const { t } = useTranslation();

  const steps = localizeJsonbArray(executionStepsEs, executionStepsEn, language);

  // Fallback a description cuando no hay steps
  const fallbackDesc =
    language === "es"
      ? (descriptionEs ?? descriptionEn ?? null)
      : (descriptionEn ?? descriptionEs ?? null);

  const proTip =
    language === "es"
      ? (proTipEs ?? proTipEn ?? null)
      : (proTipEn ?? proTipEs ?? null);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      {steps.length > 0 ? (
        <View style={styles.stepsList} testID="execution-steps-list">
          {steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText} testID="execution-empty">
          {fallbackDesc ?? t("exercisePreview.noSteps")}
        </Text>
      )}

      {proTip !== null && (
        <View style={styles.proTipBox} testID="pro-tip-box">
          <Text style={styles.proTipEmoji}>🧠</Text>
          <View style={styles.proTipContent}>
            <Text style={styles.proTipLabel}>{t("exercisePreview.proTipLabel")}</Text>
            <Text style={styles.proTipText}>{proTip}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Tab: Errores ─────────────────────────────────────────────────────────────

interface ErroresTabProps {
  commonErrorsEs: unknown;
  commonErrorsEn: unknown;
  language: AppLanguage;
}

function ErroresTab({
  commonErrorsEs,
  commonErrorsEn,
  language,
}: ErroresTabProps): React.JSX.Element {
  const { t } = useTranslation();

  const errors = localizeJsonbArray(commonErrorsEs, commonErrorsEn, language);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      {/* Banner de advertencia */}
      <View style={styles.errorsWarningBox} testID="errors-warning-banner">
        <Text style={styles.errorsWarningText}>{t("exercisePreview.errorsWarning")}</Text>
      </View>

      {errors.length > 0 ? (
        <View style={styles.errorsList} testID="errors-list">
          {errors.map((err, i) => (
            <View key={i} style={styles.errorRow}>
              <View style={styles.errorIconBox}>
                <Text style={styles.errorIconText}>✕</Text>
              </View>
              <Text style={styles.errorText}>{err}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText} testID="errors-empty">
          {t("exercisePreview.noErrors")}
        </Text>
      )}
    </ScrollView>
  );
}

// ─── Tab: Músculos ────────────────────────────────────────────────────────────

interface MusculosTabProps {
  primaryMuscles: string[];
  secondaryMuscles: string[];
  tertiaryMuscles: string[] | null;
  iconKey: string;
  language: AppLanguage;
}

function MusculosTab({
  primaryMuscles,
  secondaryMuscles,
  tertiaryMuscles,
  iconKey,
  language,
}: MusculosTabProps): React.JSX.Element {
  const { t } = useTranslation();

  const tertiary = tertiaryMuscles ?? [];

  type MuscleGroup = {
    muscles: string[];
    dotColor: string;
    isPrimary: boolean;
    sectionLabel: string;
  };

  const groups: MuscleGroup[] = [
    {
      muscles: primaryMuscles,
      dotColor: colors.lime,
      isPrimary: true,
      sectionLabel: t("exercisePreview.primaryMuscles"),
    },
    {
      muscles: secondaryMuscles,
      dotColor: colors.info,
      isPrimary: false,
      sectionLabel: t("exercisePreview.secondaryMuscles"),
    },
    {
      muscles: tertiary,
      dotColor: colors.muted,
      isPrimary: false,
      sectionLabel: t("exercisePreview.tertiaryMuscles"),
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      <View style={styles.muscleGroupList} testID="muscles-list">
        {groups.map((group) =>
          group.muscles.map((muscle, idx) => (
            <View
              key={`${group.sectionLabel}-${idx}`}
              style={styles.muscleRow}
            >
              <View style={[styles.muscleDot, { backgroundColor: group.dotColor }]} />
              <Text style={styles.muscleRowText}>
                {localizeMeta(muscle, "muscle", language)}
              </Text>
              {group.isPrimary && idx === 0 && (
                <Pill label={t("exercisePreview.primaryPill")} variant="active" />
              )}
            </View>
          ))
        )}
      </View>

      {/* Ícono grande al pie */}
      <View style={styles.muscleIconBox} testID="muscles-icon-box">
        <ExerciseIcon icon={iconKey} size={100} color={colors.lime} />
      </View>
    </ScrollView>
  );
}

// ─── Tab: Video ───────────────────────────────────────────────────────────────

interface VideoTabProps {
  exerciseId: string;
  language: AppLanguage;
}

async function fetchVideoRequest(exerciseId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("exercise_video_requests")
    .select("id")
    .eq("exercise_id", exerciseId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

async function insertVideoRequest(exerciseId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("exercise_video_requests")
    .upsert(
      { exercise_id: exerciseId, user_id: userId },
      { onConflict: "exercise_id,user_id", ignoreDuplicates: true }
    );
  if (error) throw error;
}

function VideoTab({ exerciseId, language }: VideoTabProps): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: video,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["exercise_video", exerciseId, language],
    queryFn: () => fetchExerciseVideo(exerciseId, language),
    enabled: true,
    staleTime: 1000 * 60 * 10, // 10 min
  });

  const requestQueryKey = ["exercise_video_request", exerciseId];

  const {
    data: alreadyRequested,
    isLoading: isRequestLoading,
  } = useQuery({
    queryKey: requestQueryKey,
    queryFn: () => fetchVideoRequest(exerciseId),
    // Solo cargar si no hay video y hay usuario autenticado
    enabled: !isLoading && !video && user !== null,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const requestMutation = useMutation({
    mutationFn: () => {
      if (!user) return Promise.reject(new Error("not_authenticated"));
      return insertVideoRequest(exerciseId, user.id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: requestQueryKey });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer} testID="video-tab-loading">
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title={t("exercisePreview.video_error_title")}
        description={t("exercisePreview.video_error_desc")}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  if (!video) {
    const isRequested = alreadyRequested === true || requestMutation.isSuccess;
    const isMutating = requestMutation.isPending;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tabContent}
        testID="video-tab-empty"
      >
        <EmptyState
          title={t("exercisePreview.video_empty_title")}
          description={t("exercisePreview.video_empty_desc")}
          icon="🎬"
        />

        {user !== null && (
          <View style={styles.videoRequestContainer}>
            {isRequested ? (
              <View style={styles.videoRequestedBox} testID="video-requested-state">
                <Text style={styles.videoRequestedTitle}>
                  {t("exercisePreview.video_requested_title")}
                </Text>
                <Text style={styles.videoRequestedDesc}>
                  {t("exercisePreview.video_requested_desc")}
                </Text>
              </View>
            ) : (
              <>
                {requestMutation.isError && (
                  <View style={styles.videoRequestErrorBox}>
                    <Text style={styles.videoRequestErrorText}>
                      {t("exercisePreview.video_request_error_title")}
                    </Text>
                    <Text style={styles.videoRequestErrorSubtext}>
                      {t("exercisePreview.video_request_error_desc")}
                    </Text>
                  </View>
                )}
                <Button
                  label={
                    isMutating
                      ? t("exercisePreview.video_requesting")
                      : t("exercisePreview.video_request_btn")
                  }
                  variant="secondary"
                  size="md"
                  fullWidth
                  loading={isMutating || isRequestLoading}
                  disabled={isMutating || isRequestLoading}
                  onPress={() => { requestMutation.mutate(); }}
                  testID="request-video-button"
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      testID="video-tab-content"
    >
      <View style={styles.playerWrapper}>
        <YoutubePlayer
          height={PLAYER_HEIGHT}
          videoId={video.youtube_id}
        />
      </View>
      <View style={styles.videoMeta}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {video.title}
        </Text>
        <Text style={styles.videoChannel}>
          {t("exercisePreview.video_channel", { channel: video.channel_title })}
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Contenido del sheet (estado success) ─────────────────────────────────────

function ExerciseDetailContent({
  exercise,
  sets,
  reps,
  weightKg,
}: {
  exercise: ExerciseLibraryRow;
  sets?: number | null | undefined;
  reps?: string | null | undefined;
  weightKg?: number | null | undefined;
}): React.JSX.Element {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);

  const DETAIL_TABS = [
    { key: "ejecucion", label: t("exercisePreview.tabs.execution") },
    { key: "errores",   label: t("exercisePreview.tabs.errors") },
    { key: "musculos",  label: t("exercisePreview.tabs.muscles") },
    { key: "video",     label: t("exercisePreview.tabs.video") },
  ] as const;

  type DetailTabKey = (typeof DETAIL_TABS)[number]["key"];
  const [activeTab, setActiveTab] = useState<DetailTabKey>("ejecucion");

  // Nombre según idioma: name_en cuando EN, fallback a name si null.
  const displayName =
    language === "en" && exercise.name_en ? exercise.name_en : exercise.name;

  // Grupo localizado para el pill del header
  const groupLabel = exercise.primary_group
    ? localizeMeta(exercise.primary_group, "muscle", language)
    : "—";

  // Key de ícono SVG: prioridad svg_icon DB → resolución dinámica → fallback
  const iconKey = getExerciseIconKey(
    exercise.svg_icon,
    exercise.movement_pattern,
    exercise.equipment,
    exercise.primary_group,
    exercise.icon_id,
  );

  const hasSetsReps = sets != null || reps != null || weightKg != null;

  return (
    <>
      {/* ── Header ── */}
      <View style={styles.detailHeader}>
        <View style={styles.detailIconBox} testID="detail-icon-box">
          <ExerciseIcon icon={iconKey} size={58} color={colors.lime} />
        </View>

        <View style={styles.detailHeaderText}>
          <Text style={styles.detailName} testID="detail-exercise-name">
            {displayName}
          </Text>

          <View style={styles.detailPillRow}>
            <Pill label={groupLabel} variant="active" />
          </View>

          {hasSetsReps && (
            <View style={styles.setsRepsRow} testID="sets-reps-row">
              {sets != null && (
                <View style={styles.setsRepsItem}>
                  <Text style={styles.setsRepsValue}>{sets}</Text>
                  <Text style={styles.setsRepsLabel}>Sets</Text>
                </View>
              )}
              {reps != null && (
                <View style={styles.setsRepsItem}>
                  <Text style={styles.setsRepsValue}>{reps}</Text>
                  <Text style={styles.setsRepsLabel}>Reps</Text>
                </View>
              )}
              {weightKg != null && (
                <View style={styles.setsRepsItem}>
                  <Text style={styles.setsRepsValue}>{weightKg}kg</Text>
                  <Text style={styles.setsRepsLabel}>Peso</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* ── Tabs ── */}
      <Tabs
        tabs={DETAIL_TABS as unknown as { key: string; label: string }[]}
        activeKey={activeTab}
        onTabChange={(key) => setActiveTab(key as DetailTabKey)}
        distribute
      />

      {/* ── Cuerpo del tab activo ── */}
      <View style={styles.tabBody}>
        {activeTab === "ejecucion" && (
          <EjecucionTab
            executionStepsEs={exercise.execution_steps_es}
            executionStepsEn={exercise.execution_steps_en}
            descriptionEs={exercise.description_es ?? null}
            descriptionEn={exercise.description_en ?? null}
            proTipEs={exercise.pro_tip_es ?? null}
            proTipEn={exercise.pro_tip_en ?? null}
            language={language}
          />
        )}
        {activeTab === "errores" && (
          <ErroresTab
            commonErrorsEs={exercise.common_errors_es}
            commonErrorsEn={exercise.common_errors_en}
            language={language}
          />
        )}
        {activeTab === "musculos" && (
          <MusculosTab
            primaryMuscles={exercise.primary_muscles ?? []}
            secondaryMuscles={exercise.secondary_muscles ?? []}
            tertiaryMuscles={exercise.tertiary_muscles ?? null}
            iconKey={iconKey}
            language={language}
          />
        )}
        {activeTab === "video" && (
          <VideoTab exerciseId={exercise.id} language={language} />
        )}
      </View>
    </>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ExercisePreviewSheet({
  exerciseId,
  onClose,
  sets,
  reps,
  weightKg,
}: ExercisePreviewSheetProps): React.JSX.Element {
  const { t } = useTranslation();
  const {
    data: exercise,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["exercise_library_detail", exerciseId],
    queryFn: () => fetchExerciseDetail(exerciseId!),
    enabled: exerciseId !== null,
    staleTime: 1000 * 60 * 10, // 10 min — datos de biblioteca cambian poco
  });

  const renderBody = (): React.JSX.Element => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer} testID="exercise-preview-loading">
          <ActivityIndicator color={colors.lime} size="large" />
        </View>
      );
    }

    if (isError || !exercise) {
      return (
        <ErrorState
          title={t("exercisePreview.error_title")}
          description={t("exercisePreview.error_desc")}
          onRetry={() => {
            void refetch();
          }}
        />
      );
    }

    return (
      <ExerciseDetailContent
        exercise={exercise}
        sets={sets}
        reps={reps}
        weightKg={weightKg}
      />
    );
  };

  return (
    <Sheet
      visible={exerciseId !== null}
      onClose={onClose}
      snapPoints={[640]}
      testID="exercise-preview-sheet"
    >
      {renderBody()}
    </Sheet>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing[10],
  },

  // ── Header ──
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[4],
    paddingHorizontal: spacing[5],
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailIconBox: {
    width: 72,
    height: 72,
    backgroundColor: colors.surface3,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface4,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  detailHeaderText: {
    flex: 1,
    gap: spacing[2],
  },
  detailName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["2xl"],
    letterSpacing: 0.5,
    lineHeight: 28,
  },
  detailPillRow: {
    flexDirection: "row",
  },
  setsRepsRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginTop: spacing[1],
  },
  setsRepsItem: {
    alignItems: "center",
  },
  setsRepsValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  setsRepsLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },

  // ── Tabs body ──
  tabBody: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
    gap: spacing[3],
  },

  // ── Texto vacío genérico ──
  emptyText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
    lineHeight: 24,
  },

  // ── Tab Ejecución: pasos ──
  stepsList: {
    gap: spacing[3],
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: radius.sm + 2,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    fontFamily: typography.mono,
    fontSize: fontSize.xs,
    color: colors.bg,
    fontWeight: "700",
  },
  stepText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
    flex: 1,
  },

  // ── Tab Ejecución: PRO TIP ──
  proTipBox: {
    flexDirection: "row",
    backgroundColor: colors.limeGlow,
    borderWidth: 1,
    borderColor: `${colors.lime}30`,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[3],
    marginTop: spacing[2],
  },
  proTipEmoji: {
    fontSize: fontSize.lg,
    flexShrink: 0,
  },
  proTipContent: {
    flex: 1,
    gap: spacing[1],
  },
  proTipLabel: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  proTipText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },

  // ── Tab Errores ──
  errorsWarningBox: {
    backgroundColor: `${colors.error}08`,
    borderWidth: 1,
    borderColor: `${colors.error}25`,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  errorsWarningText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: "600",
    lineHeight: 18,
  },
  errorsList: {
    gap: spacing[3],
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[3],
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
  },
  errorIconBox: {
    width: 26,
    height: 26,
    borderRadius: radius.sm + 2,
    backgroundColor: `${colors.error}15`,
    borderWidth: 1,
    borderColor: `${colors.error}40`,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  errorIconText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: "700",
  },
  errorText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
    flex: 1,
  },

  // ── Tab Video ──
  playerWrapper: {
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface3,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  },
  videoMeta: {
    gap: spacing[1],
    marginTop: spacing[3],
  },
  videoTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  videoChannel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },

  // ── Tab Músculos ──
  muscleGroupList: {
    gap: spacing[3],
  },
  muscleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
  },
  muscleDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    flexShrink: 0,
  },
  muscleRowText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.md,
    flex: 1,
  },
  muscleIconBox: {
    backgroundColor: colors.surface3,
    borderRadius: radius.lg,
    padding: spacing[4],
    alignItems: "center",
    justifyContent: "center",
    height: 130,
    marginTop: spacing[2],
  },

  // ── Tab Video: solicitar video ──
  videoRequestContainer: {
    gap: spacing[3],
    marginTop: spacing[2],
  },
  videoRequestedBox: {
    backgroundColor: colors.limeGlow,
    borderWidth: 1,
    borderColor: `${colors.lime}30`,
    borderRadius: radius.lg,
    padding: spacing[4],
    gap: spacing[2],
    alignItems: "center",
  },
  videoRequestedTitle: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: fontSize.md,
    fontWeight: "700",
  },
  videoRequestedDesc: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textAlign: "center",
    lineHeight: 20,
  },
  videoRequestErrorBox: {
    backgroundColor: `${colors.error}08`,
    borderWidth: 1,
    borderColor: `${colors.error}25`,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
  videoRequestErrorText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },
  videoRequestErrorSubtext: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
});
