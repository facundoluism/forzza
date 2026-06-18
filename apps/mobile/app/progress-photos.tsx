// HUMAN_REQUIRED: expo-image-picker requires permissions config in app.json:
//   iOS: NSPhotoLibraryUsageDescription, NSCameraUsageDescription
//   Android: READ_EXTERNAL_STORAGE, READ_MEDIA_IMAGES (API 33+)
// These must be added by the release-store-engineer before building.
// Permission denial is handled gracefully — the screen does not crash.
//
// SECURITY NOTE: storage_path and signed URLs are NEVER logged, never sent to
// analytics, and never stored in persistent storage (AsyncStorage). They exist
// only in React Query cache and component state for the lifetime of the screen.

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { randomUUID } from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/hooks/useEntitlements";
import { supabase } from "@/lib/supabase";
import { EmptyState, ErrorState, UpgradeModal, ScreenHeader } from "@forzza/ui/native";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

const BUCKET = "progress-photos";

interface ProgressPhoto {
  id: string;
  storage_path: string;
  notes: string | null;
  recorded_at: string;
}

interface PhotoWithUrl {
  photo: ProgressPhoto;
  signedUrl: string;
}

const COLUMN_GAP = spacing[2];
const SCREEN_WIDTH = Dimensions.get("window").width;
const PHOTO_WIDTH = (SCREEN_WIDTH - spacing[4] * 2 - COLUMN_GAP) / 2;

export default function ProgressPhotosScreen(): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { isPro, isLoading: entitlementsLoading } = useEntitlements();
  const queryClient = useQueryClient();

  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const [pendingNotes, setPendingNotes] = useState("");
  const [showComparator, setShowComparator] = useState(false);

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (entitlementsLoading) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  // ── PRO gate ─────────────────────────────────────────────────────────────────
  if (!isPro) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header con back */}
        <View style={[styles.header, { paddingTop: spacing[4] }]}>
          <ScreenHeader title={t("progressPhotos.screenTitle")} onBack={() => router.back()} />
        </View>

        {/* Gate state centrado */}
        <View style={styles.gateContainer}>
          <View style={styles.gateIconBox}>
            <Text style={styles.gateIcon}>📸</Text>
          </View>
          <Text style={styles.gateTitleText}>{t("progressPhotos.pro_gateTitle")}</Text>
          <Text style={styles.gateDescText}>{t("progressPhotos.pro_gateDesc")}</Text>
          <TouchableOpacity
            style={styles.gateCtaButton}
            onPress={() => router.back()}
          >
            <Text style={styles.gateCtaText}>{t("progressPhotos.pro_gateCta")}</Text>
          </TouchableOpacity>
        </View>

        <UpgradeModal
          visible={false}
          onClose={() => router.back()}
          onUpgrade={() => router.back()}
          feature={t("progressPhotos.pro_gate")}
        />
      </View>
    );
  }

  return (
    <ProgressPhotosContent
      userId={user!.id}
      insets={insets}
      queryClient={queryClient}
      pendingImageUri={pendingImageUri}
      setPendingImageUri={setPendingImageUri}
      pendingNotes={pendingNotes}
      setPendingNotes={setPendingNotes}
      showComparator={showComparator}
      setShowComparator={setShowComparator}
    />
  );
}

// Split into inner component so hooks always run (isPro check is above the hook calls)
function ProgressPhotosContent({
  userId,
  insets: _insets,
  queryClient,
  pendingImageUri,
  setPendingImageUri,
  pendingNotes,
  setPendingNotes,
  showComparator,
  setShowComparator,
}: {
  userId: string;
  insets: { top: number; bottom: number };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryClient: any;
  pendingImageUri: string | null;
  setPendingImageUri: (v: string | null) => void;
  pendingNotes: string;
  setPendingNotes: (v: string) => void;
  showComparator: boolean;
  setShowComparator: (v: boolean) => void;
}): React.JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();

  // ── Fetch photos + signed URLs ───────────────────────────────────────────────
  const {
    data: photosWithUrls = [],
    isLoading: photosLoading,
    isError: photosError,
    refetch,
  } = useQuery<PhotoWithUrl[]>({
    queryKey: ["progress-photos", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_photos")
        .select("id, storage_path, notes, recorded_at")
        .eq("student_id", userId)
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) return [];

      const rows = data as ProgressPhoto[];

      // Resolve signed URLs in parallel — NEVER log URLs or paths
      const withUrls = await Promise.all(
        rows.map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(photo.storage_path, 3600);
          // Store URL only in memory — never in console, analytics, or AsyncStorage
          return {
            photo,
            signedUrl: urlData?.signedUrl ?? "",
          } satisfies PhotoWithUrl;
        })
      );

      return withUrls;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // ── Upload mutation ──────────────────────────────────────────────────────────
  const { mutate: savePhoto, isPending: uploading } = useMutation({
    mutationFn: async ({ uri, notes }: { uri: string; notes: string }) => {
      const uuid = randomUUID();
      const storagePath = `${userId}/${uuid}.jpg`;

      // Fetch image as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, blob, {
          contentType: "image/jpeg",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from("progress_photos")
        .insert({
          student_id: userId,
          storage_path: storagePath,
          notes: notes.trim() || null,
          recorded_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;
      // storagePath is intentionally NOT logged or tracked here
    },
    onSuccess: () => {
      setPendingImageUri(null);
      setPendingNotes("");
      void queryClient.invalidateQueries({ queryKey: ["progress-photos", userId] });
    },
    onError: () => {
      Alert.alert(t("common.error"), t("common.noConnection"));
    },
  });

  async function handlePickImage() {
    const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permResult.granted) {
      Alert.alert(t("progressPhotos.permissionDenied"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      // Store only the local file URI — never log it
      setPendingImageUri(result.assets[0]!.uri);
    }
  }

  function handleSavePhoto() {
    if (!pendingImageUri) return;
    savePhoto({ uri: pendingImageUri, notes: pendingNotes });
  }

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (photosLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.lime} size="large" />
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────────
  if (photosError) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: spacing[4] }]}>
          <ScreenHeader title={t("progressPhotos.screenTitle")} onBack={() => router.back()} />
        </View>
        <ErrorState
          title={t("progressPhotos.error_title")}
          description={t("progressPhotos.error_desc")}
          onRetry={() => { void refetch(); }}
        />
      </View>
    );
  }

  // ── Comparator view ───────────────────────────────────────────────────────────
  if (showComparator && photosWithUrls.length >= 2) {
    const oldest = photosWithUrls[photosWithUrls.length - 1]!;
    const newest = photosWithUrls[0]!;

    return (
      <View style={styles.container}>
        {/* Header comparador — onBack cierra el comparador (acción interna) */}
        <View style={[styles.header, { paddingTop: spacing[4] }]}>
          <ScreenHeader
            title={t("progressPhotos.comparatorTitle")}
            onBack={() => setShowComparator(false)}
          />
        </View>

        <View style={styles.comparatorRow}>
          <View style={styles.comparatorItem}>
            <Text style={styles.comparatorLabel}>{t("progressPhotos.before")}</Text>
            {oldest.signedUrl ? (
              <Image
                source={{ uri: oldest.signedUrl }}
                style={styles.comparatorImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.comparatorImage, styles.imagePlaceholder]} />
            )}
            <Text style={styles.comparatorDate}>
              {new Date(oldest.photo.recorded_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
          <View style={styles.comparatorItem}>
            <Text style={styles.comparatorLabel}>{t("progressPhotos.after")}</Text>
            {newest.signedUrl ? (
              <Image
                source={{ uri: newest.signedUrl }}
                style={styles.comparatorImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.comparatorImage, styles.imagePlaceholder]} />
            )}
            <Text style={styles.comparatorDate}>
              {new Date(newest.photo.recorded_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header con acciones */}
      <View style={[styles.header, { paddingTop: spacing[4] }]}>
        <ScreenHeader
          title={t("progressPhotos.screenTitleShort")}
          onBack={() => router.back()}
          {...(photosWithUrls.length > 0
            ? { subtitle: t("progressPhotos.recordsCount", { count: photosWithUrls.length }) }
            : {})}
          right={
            <View style={styles.headerActions}>
              {photosWithUrls.length >= 2 && !pendingImageUri && (
                <TouchableOpacity
                  style={styles.compareButton}
                  onPress={() => setShowComparator(true)}
                  testID="progress-photos-compare-btn"
                >
                  <Text style={styles.compareButtonText}>{t("progressPhotos.compare")}</Text>
                </TouchableOpacity>
              )}
              {!pendingImageUri && (
                <TouchableOpacity
                  style={styles.addButtonSmall}
                  onPress={() => { void handlePickImage(); }}
                  testID="progress-photos-add-btn"
                >
                  <Text style={styles.addButtonSmallText}>{t("progressPhotos.addPhotoShort")}</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pending image preview */}
        {pendingImageUri ? (
          <View style={styles.pendingContainer}>
            <Image
              source={{ uri: pendingImageUri }}
              style={styles.pendingImage}
              resizeMode="cover"
            />
            <TextInput
              style={styles.notesInput}
              value={pendingNotes}
              onChangeText={setPendingNotes}
              placeholder={t("progressPhotos.notesPlaceholder")}
              placeholderTextColor={colors.gray600}
              multiline
              numberOfLines={2}
              testID="progress-photos-notes"
            />
            <View style={styles.pendingButtons}>
              <TouchableOpacity
                style={[styles.saveButton, uploading && styles.buttonDisabled]}
                onPress={handleSavePhoto}
                disabled={uploading}
                testID="progress-photos-save-btn"
              >
                {uploading
                  ? <ActivityIndicator color={colors.bg} />
                  : <Text style={styles.saveButtonText}>{t("progressPhotos.save")}</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => { setPendingImageUri(null); setPendingNotes(""); }}
                disabled={uploading}
              >
                <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Timeline section label */}
        {photosWithUrls.length === 0 ? (
          <EmptyState
            title={t("progressPhotos.empty_title")}
            description={t("progressPhotos.empty_desc")}
            icon="📸"
          />
        ) : (
          <>
            <Text style={styles.sectionLabel}>{t("progressPhotos.sectionLabel")}</Text>
            {/* Timeline list */}
            {photosWithUrls.map(({ photo, signedUrl }) => (
              <View key={photo.id} style={styles.timelineRow}>
                {/* Miniatura */}
                <View style={styles.timelineThumbBox}>
                  {signedUrl ? (
                    <Image
                      source={{ uri: signedUrl }}
                      style={styles.timelineThumb}
                      resizeMode="cover"
                      accessibilityIgnoresInvertColors
                    />
                  ) : (
                    <View style={[styles.timelineThumb, styles.imagePlaceholder]} />
                  )}
                </View>
                {/* Info */}
                <View style={styles.timelineInfo}>
                  <Text style={styles.timelineDate}>
                    {new Date(photo.recorded_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  {photo.notes ? (
                    <Text style={styles.timelineNotes} numberOfLines={2}>{photo.notes}</Text>
                  ) : null}
                </View>
              </View>
            ))}

            {/* Grilla de fotos al final */}
            <Text style={[styles.sectionLabel, { marginTop: spacing[5] }]}>
              {t("progressPhotos.sectionGrid")}
            </Text>
            <View style={styles.photoGrid}>
              {photosWithUrls.map(({ photo, signedUrl }) => (
                <View key={`grid-${photo.id}`} style={styles.photoItem}>
                  {signedUrl ? (
                    <Image
                      source={{ uri: signedUrl }}
                      style={styles.photoThumb}
                      resizeMode="cover"
                      accessibilityIgnoresInvertColors
                    />
                  ) : (
                    <View style={[styles.photoThumb, styles.imagePlaceholder]} />
                  )}
                  <Text style={styles.photoDate}>
                    {new Date(photo.recorded_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Text>
                  {photo.notes ? (
                    <Text style={styles.photoNotes} numberOfLines={2}>{photo.notes}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </>
        )}

        {/* CTA agregar si no hay imagen pendiente */}
        {!pendingImageUri && (
          <TouchableOpacity
            style={styles.addButtonDashed}
            onPress={() => { void handlePickImage(); }}
          >
            <Text style={styles.addButtonDashedText}>{t("progressPhotos.addPhotoToday")}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Header ──
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing[2],
    alignItems: "center",
  },
  compareButton: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lime,
    backgroundColor: colors.limeGlow,
  },
  compareButtonText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addButtonSmall: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.md,
    backgroundColor: colors.lime,
  },
  addButtonSmallText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize.sm,
    letterSpacing: 0.5,
  },

  // ── Scroll content ──
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[8],
  },

  // ── Section label ──
  sectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: spacing[3],
  },

  // ── Timeline ──
  timelineRow: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[4],
    alignItems: "flex-start",
  },
  timelineThumbBox: {
    width: 80,
    flexShrink: 0,
  },
  timelineThumb: {
    width: 80,
    aspectRatio: 0.75,
    borderRadius: radius.md,
    backgroundColor: colors.surface3,
  },
  timelineInfo: {
    flex: 1,
    paddingTop: spacing[1],
  },
  timelineDate: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.xs,
    fontWeight: "700",
    marginBottom: spacing[1],
  },
  timelineNotes: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },

  // ── Photo grid ──
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: COLUMN_GAP,
  },
  photoItem: {
    width: PHOTO_WIDTH,
  },
  photoThumb: {
    width: PHOTO_WIDTH,
    height: PHOTO_WIDTH,
    borderRadius: radius.lg,
    marginBottom: spacing[1],
    backgroundColor: colors.surface3,
  },
  imagePlaceholder: {
    backgroundColor: colors.surface3,
  },
  photoDate: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: fontSize.xs,
    marginBottom: spacing[1],
  },
  photoNotes: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: fontSize.xs,
    lineHeight: 16,
    marginBottom: spacing[3],
  },

  // ── Pending image ──
  pendingContainer: {
    marginBottom: spacing[5],
  },
  pendingImage: {
    width: "100%",
    height: 240,
    borderRadius: radius.lg,
    marginBottom: spacing[3],
  },
  notesInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    color: colors.text,
    fontFamily: typography.body,
    fontSize: fontSize.base,
    minHeight: 72,
    textAlignVertical: "top",
    marginBottom: spacing[3],
  },
  pendingButtons: {
    flexDirection: "row",
    gap: spacing[3],
  },
  saveButton: {
    flex: 1,
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  saveButtonText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize.xl,
    letterSpacing: 1,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  cancelButtonText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
  },
  buttonDisabled: {
    opacity: 0.5,
  },

  // ── Dashed add CTA ──
  addButtonDashed: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.surface4,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
    marginTop: spacing[3],
  },
  addButtonDashedText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    fontWeight: "600",
  },

  // ── Comparator ──
  comparatorRow: {
    flexDirection: "row",
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  comparatorItem: {
    flex: 1,
    alignItems: "center",
  },
  comparatorLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing[2],
  },
  comparatorImage: {
    width: "100%",
    aspectRatio: 0.75,
    borderRadius: radius.lg,
    backgroundColor: colors.surface3,
  },
  comparatorDate: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: fontSize.xs,
    marginTop: spacing[2],
    textAlign: "center",
  },

  // ── PRO gate ──
  gateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing[6],
  },
  gateIconBox: {
    width: 68,
    height: 68,
    borderRadius: radius.xl,
    backgroundColor: colors.limeGlow,
    borderWidth: 1,
    borderColor: colors.limeDim,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing[4],
  },
  gateIcon: {
    fontSize: 30,
  },
  gateTitleText: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize["2xl"],
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: spacing[2],
  },
  gateDescText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing[5],
  },
  gateCtaButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  gateCtaText: {
    fontFamily: typography.heading,
    color: colors.bg,
    fontSize: fontSize["2xl"],
    letterSpacing: 1,
  },
});
