import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Linking,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WebView } from "react-native-webview";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useState, useRef } from "react";
import { Card, Pill, Skeleton, ErrorState, EmptyState, ScreenHeader } from "@forzza/ui/native";
import { colors, spacing, typography, radius, fontSize } from "@forzza/ui/tokens";
import { ReportModal } from "@/components/ReportModal";

// ─── Constantes de tamaño para el player de video ─────────────────────────────
const SCREEN_WIDTH = Dimensions.get("window").width;
const VIDEO_WIDTH = SCREEN_WIDTH - spacing[4] * 2;
const VIDEO_HEIGHT = Math.round(VIDEO_WIDTH * (9 / 16));

// ─── Interfaces ───────────────────────────────────────────────────────────────

// Columnas reales de coach_packages: id, coach_id, tier, title, description, price, active, features
interface CoachPackage {
  id: string;
  title: string;
  description: string | null;
  price: number; // entero en centavos
  tier: "starter" | "pro" | "elite";
  active: boolean;
  features: string[];
}

interface CoachProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  specialties: string[];
  interests: string[];
  avatar_url: string | null;
  years_experience: number | null;
  status: string;
  avg_rating: number | null;
  rating_count: number;
  presentation_video_path: string | null;
  packages: CoachPackage[];
}

interface GalleryImage {
  id: string;
  file_path: string;
  display_order: number;
  signedUrl: string;
}

interface StudentProfile {
  birth_date: string | null;
  parental_consent_at: string | null;
}

interface CoachRating {
  id: string;
  student_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  // joined via student_profiles
  student_display_name: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isMinor(birthDate: string): boolean {
  const age =
    (Date.now() - new Date(birthDate).getTime()) /
    (365.25 * 24 * 60 * 60 * 1000);
  return age < 18;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

/** Renders 1-5 filled/empty stars using token colors only */
function StarRating({
  value,
  size = 20,
  onSelect,
}: {
  value: number;
  size?: number;
  onSelect?: (v: number) => void;
}): React.JSX.Element {
  return (
    <View style={starStyles.row}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        if (onSelect) {
          return (
            <TouchableOpacity
              key={star}
              onPress={() => onSelect(star)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              testID={`star-${star}`}
            >
              <Text
                style={[
                  starStyles.star,
                  { fontSize: size },
                  filled ? starStyles.starFilled : starStyles.starEmpty,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          );
        }
        return (
          <Text
            key={star}
            style={[
              starStyles.star,
              { fontSize: size },
              filled ? starStyles.starFilled : starStyles.starEmpty,
            ]}
          >
            ★
          </Text>
        );
      })}
    </View>
  );
}

const starStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing[1],
  },
  star: {
    fontFamily: typography.body,
  },
  starFilled: {
    color: colors.warning,
  },
  starEmpty: {
    color: colors.surface4,
  },
});

// ─── Carrusel de imágenes de galería ──────────────────────────────────────────

function GalleryCarousel({ images }: { images: GalleryImage[] }): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<GalleryImage>>(null);

  if (images.length === 0) return <View />;

  return (
    <View style={carouselStyles.container} testID="coach-gallery-carousel">
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / VIDEO_WIDTH);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={carouselStyles.slide} testID={`gallery-image-${item.id}`}>
            <Image
              source={{ uri: item.signedUrl }}
              style={carouselStyles.image}
              resizeMode="cover"
            />
          </View>
        )}
      />
      {images.length > 1 && (
        <View style={carouselStyles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[carouselStyles.dot, i === activeIndex && carouselStyles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const carouselStyles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  slide: {
    width: VIDEO_WIDTH,
    height: Math.round(VIDEO_WIDTH * (3 / 4)),
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface3,
  },
  image: {
    width: VIDEO_WIDTH,
    height: Math.round(VIDEO_WIDTH * (3 / 4)),
    borderRadius: radius.lg,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing[1],
    marginTop: spacing[2],
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface4,
  },
  dotActive: {
    backgroundColor: colors.lime,
    width: 16,
  },
});

// ─── Player de video de presentación (signed URL via WebView) ─────────────────

async function fetchPresentationVideoSignedUrl(videoPath: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("coach-gallery")
    .createSignedUrl(videoPath, 3600);
  if (error) throw error;
  return data?.signedUrl ?? null;
}

function PresentationVideoPlayer({ videoPath }: { videoPath: string }): React.JSX.Element {
  const { t } = useTranslation();

  const {
    data: signedUrl,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["coach_presentation_video", videoPath],
    queryFn: () => fetchPresentationVideoSignedUrl(videoPath),
    staleTime: 1000 * 60 * 50, // 50 min (TTL es 60 min)
  });

  if (isLoading) {
    return (
      <View style={videoStyles.loading} testID="presentation-video-loading">
        <ActivityIndicator color={colors.lime} />
      </View>
    );
  }

  if (isError || !signedUrl) {
    return (
      <View style={videoStyles.error} testID="presentation-video-error">
        <Text style={videoStyles.errorText}>
          {t("marketplace.coach.videoError")}
        </Text>
        <TouchableOpacity
          onPress={() => { void refetch(); }}
          style={videoStyles.retryBtn}
        >
          <Text style={videoStyles.retryText}>{t("common.retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // HTML mínimo para reproducir el video con controles nativos dentro de WebView
  const html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000}video{width:100%;height:100vh;object-fit:contain}</style></head><body><video src="${signedUrl}" controls playsinline preload="metadata"></video></body></html>`;

  return (
    <View style={videoStyles.wrapper} testID="presentation-video-player">
      <WebView
        source={{ html }}
        style={videoStyles.webview}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        originWhitelist={["*"]}
      />
      <TouchableOpacity
        style={videoStyles.openBtn}
        onPress={() => { void Linking.openURL(signedUrl); }}
        activeOpacity={0.7}
        testID="presentation-video-open-link"
      >
        <Text style={videoStyles.openBtnText}>
          {t("marketplace.coach.videoOpenExternal")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const videoStyles = StyleSheet.create({
  wrapper: {
    gap: spacing[2],
  },
  webview: {
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface3,
  },
  loading: {
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
    backgroundColor: colors.surface3,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    width: VIDEO_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    alignItems: "center",
    gap: spacing[3],
  },
  errorText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textAlign: "center",
  },
  retryBtn: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
    borderWidth: 1,
    borderColor: colors.lime,
    borderRadius: radius.md,
  },
  retryText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
  },
  openBtn: {
    alignSelf: "flex-end",
    paddingVertical: spacing[1],
    paddingHorizontal: spacing[2],
  },
  openBtnText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    textDecorationLine: "underline",
  },
});

// ─── Package card ─────────────────────────────────────────────────────────────

function PackageCard({
  pkg,
  currencySymbol,
  onContratar,
  hireLabel,
  featuresLabel,
}: {
  pkg: CoachPackage;
  currencySymbol: string;
  onContratar: (packageId: string) => void;
  hireLabel: string;
  featuresLabel: string;
}) {
  // Precio en centavos → mostrar formateado
  const price = (pkg.price / 100).toLocaleString("es-AR");
  // El paquete pro recibe estilo destacado
  const isHighlighted = pkg.tier === "pro";
  const hasFeatures = pkg.features.length > 0;

  return (
    <View
      style={[
        styles.packageCard,
        isHighlighted && styles.packageCardHighlighted,
      ]}
    >
      {isHighlighted && (
        <View style={styles.packageBadge}>
          <Text style={styles.packageBadgeText}>RECOMENDADO</Text>
        </View>
      )}
      <Text style={styles.packageName}>{pkg.title}</Text>
      {pkg.description ? (
        <Text style={styles.packageDesc}>{pkg.description}</Text>
      ) : null}

      {hasFeatures && (
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresLabel}>{featuresLabel}</Text>
          {pkg.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.packageFooter}>
        <Text style={[styles.packagePriceAmount, isHighlighted && styles.packagePriceHighlighted]}>
          {currencySymbol}
          {price}
        </Text>
        <TouchableOpacity
          style={styles.contratarBtn}
          activeOpacity={0.8}
          onPress={() => onContratar(pkg.id)}
        >
          <Text style={styles.contratarText}>{hireLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Rating form ──────────────────────────────────────────────────────────────

interface RatingFormProps {
  coachId: string;
  userId: string;
  existingRating: CoachRating | null;
}

function RatingForm({ coachId, userId, existingRating }: RatingFormProps): React.JSX.Element {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedStar, setSelectedStar] = useState<number>(existingRating?.rating ?? 0);
  const [comment, setComment] = useState<string>(existingRating?.comment ?? "");
  const [expanded, setExpanded] = useState(false);

  const { mutate: submitRating, isPending } = useMutation({
    mutationFn: async () => {
      if (selectedStar === 0) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from("coach_ratings")
        .upsert(
          {
            coach_id: coachId,
            student_id: userId,
            rating: selectedStar,
            comment: comment.trim() || null,
          },
          { onConflict: "coach_id,student_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["coach_ratings", coachId] });
      void queryClient.invalidateQueries({ queryKey: ["coach_profile", coachId] });
      setExpanded(false);
      Alert.alert(t("coachRatings.successTitle"), t("coachRatings.successDesc"));
    },
    onError: () => {
      Alert.alert(t("coachRatings.errorTitle"), t("coachRatings.errorDesc"));
    },
  });

  if (!expanded) {
    return (
      <TouchableOpacity
        style={styles.rateToggleBtn}
        onPress={() => setExpanded(true)}
        testID="rate-coach-toggle"
      >
        <Text style={styles.rateToggleText}>
          {existingRating
            ? t("coachRatings.editRating")
            : t("coachRatings.rateThisCoach")}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Card style={styles.ratingFormCard} padding="lg">
      <Text style={styles.ratingFormTitle}>{t("coachRatings.yourRating")}</Text>

      <StarRating value={selectedStar} size={32} onSelect={setSelectedStar} />

      <Text style={styles.ratingFormLabel}>{t("coachRatings.commentLabel")}</Text>
      <TextInput
        style={styles.ratingCommentInput}
        value={comment}
        onChangeText={setComment}
        placeholder={t("coachRatings.commentPlaceholder")}
        placeholderTextColor={colors.gray600}
        multiline
        numberOfLines={3}
        testID="rating-comment-input"
      />

      <View style={styles.ratingFormActions}>
        <TouchableOpacity
          style={[
            styles.submitRatingBtn,
            (isPending || selectedStar === 0) && styles.submitRatingBtnDisabled,
          ]}
          onPress={() => submitRating()}
          disabled={isPending || selectedStar === 0}
          testID="submit-rating-btn"
        >
          {isPending ? (
            <ActivityIndicator color={colors.black} size="small" />
          ) : (
            <Text style={styles.submitRatingText}>
              {existingRating ? t("coachRatings.update") : t("coachRatings.submit")}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelRatingBtn}
          onPress={() => setExpanded(false)}
          disabled={isPending}
        >
          <Text style={styles.cancelRatingText}>{t("common.cancel")}</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

// ─── Reviews section ──────────────────────────────────────────────────────────

function ReviewsSection({
  coachId,
  userId,
  avgRating,
  ratingCount,
}: {
  coachId: string;
  userId: string;
  avgRating: number | null;
  ratingCount: number;
}): React.JSX.Element {
  const { t } = useTranslation();

  const {
    data: ratingsData,
    isLoading: ratingsLoading,
    isError: ratingsError,
  } = useQuery<{ ratings: CoachRating[]; myRating: CoachRating | null }>({
    queryKey: ["coach_ratings", coachId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_ratings")
        .select("id, student_id, rating, comment, created_at")
        .eq("coach_id", coachId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const rows = (data ?? []) as CoachRating[];
      const myRating = rows.find((r) => r.student_id === userId) ?? null;
      return { ratings: rows, myRating };
    },
    enabled: !!coachId,
  });

  // Check if the student ever had an assignment with this coach (any status)
  const { data: hasAssignment } = useQuery<boolean>({
    queryKey: ["coach_assignment_check", coachId, userId],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_assignments")
        .select("id")
        .eq("coach_id", coachId)
        .eq("student_id", userId)
        .limit(1)
        .maybeSingle();
      if (error) return false;
      return data !== null;
    },
    enabled: !!coachId && !!userId,
  });

  const myRating = ratingsData?.myRating ?? null;
  const allRatings = ratingsData?.ratings ?? [];
  const otherRatings = allRatings.filter((r) => r.student_id !== userId);

  return (
    <View style={styles.section}>
      <View style={styles.ratingHeaderRow}>
        <Text style={styles.sectionTitle}>{t("coachRatings.sectionTitle")}</Text>
        {ratingCount > 0 && avgRating !== null && (
          <View style={styles.ratingHeaderRight}>
            <StarRating value={Math.round(avgRating)} size={14} />
            <Text style={styles.ratingCountText}>
              {t("coachRatings.ratingCount", { count: ratingCount })}
            </Text>
          </View>
        )}
      </View>

      {/* Form: only shown if student has/had an assignment */}
      {hasAssignment === true && (
        <RatingForm
          coachId={coachId}
          userId={userId}
          existingRating={myRating}
        />
      )}

      {hasAssignment === false && (
        <Text style={styles.noAssignmentText}>{t("coachRatings.noAssignment")}</Text>
      )}

      {/* My existing rating (shown even when form is collapsed) */}
      {myRating && !hasAssignment && (
        <Card style={styles.reviewCard} padding="lg">
          <View style={styles.reviewHeader}>
            <StarRating value={myRating.rating} size={16} />
            <Text style={styles.reviewDate}>
              {new Date(myRating.created_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>
          {myRating.comment ? (
            <Text style={styles.reviewComment}>{myRating.comment}</Text>
          ) : null}
        </Card>
      )}

      {/* Loading */}
      {ratingsLoading && (
        <View style={{ gap: spacing[3] }}>
          <Skeleton width="100%" height={80} />
          <Skeleton width="100%" height={80} />
        </View>
      )}

      {/* Error */}
      {ratingsError && !ratingsLoading && (
        <Text style={styles.errorText}>{t("coachRatings.errorDesc")}</Text>
      )}

      {/* Other reviews list */}
      {!ratingsLoading && !ratingsError && (
        otherRatings.length === 0 && ratingCount === 0 ? (
          <EmptyState
            title={t("coachRatings.noReviews")}
            description=""
            icon="⭐"
          />
        ) : (
          otherRatings.map((r) => (
            <Card key={r.id} style={styles.reviewCard} padding="lg">
              <View style={styles.reviewHeader}>
                <StarRating value={r.rating} size={16} />
                <Text style={styles.reviewDate}>
                  {new Date(r.created_at).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </View>
              {r.comment ? (
                <Text style={styles.reviewComment}>{r.comment}</Text>
              ) : null}
            </Card>
          ))
        )
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CoachProfileScreen() {
  const { coachId } = useLocalSearchParams<{ coachId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [reportCoachVisible, setReportCoachVisible] = useState(false);

  const { data: coach, isLoading, isError, refetch } = useQuery({
    queryKey: ["coach_profile", coachId],
    queryFn: async (): Promise<CoachProfile | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_profiles")
        .select(
          "id, user_id, display_name, bio, specialties, interests, avatar_url, years_experience, status, avg_rating, rating_count, presentation_video_path, packages:coach_packages(id, title, description, price, tier, active, features)"
        )
        .eq("id", coachId!)
        .eq("status", "approved")
        .single();
      if (error) return null;
      return data as CoachProfile | null;
    },
    enabled: !!coachId,
  });

  // Galería: SELECT de coach_gallery + signed URLs para cada imagen
  const { data: galleryImages } = useQuery<GalleryImage[]>({
    queryKey: ["coach_gallery", coachId],
    queryFn: async (): Promise<GalleryImage[]> => {
      if (!coachId) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_gallery")
        .select("id, file_path, display_order")
        .eq("coach_id", coachId)
        .order("display_order", { ascending: true });
      if (error || !data) return [];

      // Generar signed URLs para cada imagen del bucket privado
      const withUrls = await Promise.all(
        (data as { id: string; file_path: string; display_order: number }[]).map(async (row) => {
          const { data: signedData } = await supabase.storage
            .from("coach-gallery")
            .createSignedUrl(row.file_path, 3600);
          return {
            ...row,
            signedUrl: signedData?.signedUrl ?? "",
          };
        })
      );

      // Filtrar imágenes cuya signed URL se generó correctamente
      return withUrls.filter((img) => img.signedUrl !== "");
    },
    enabled: !!coachId,
    staleTime: 1000 * 60 * 50, // 50 min (TTL signed URLs es 60 min)
  });

  const { data: studentProfile } = useQuery({
    queryKey: ["student_profile_consent", user?.id],
    queryFn: async (): Promise<StudentProfile | null> => {
      if (!user) return null;
      const { data } = await supabase
        .from("student_profiles")
        .select("birth_date, parental_consent_at")
        .eq("user_id", user.id)
        .single();
      return data as StudentProfile | null;
    },
    enabled: !!user,
  });

  const { data: countryConfig } = useQuery({
    queryKey: ["country_config_symbol"],
    queryFn: async () => {
      const { data } = await supabase
        .from("country_config")
        .select("currency_symbol")
        .eq("country", "AR")
        .single();
      return data;
    },
  });

  const currencySymbol = countryConfig?.currency_symbol ?? "$";

  function handleContratar(packageId: string) {
    if (
      studentProfile?.birth_date &&
      isMinor(studentProfile.birth_date) &&
      !studentProfile.parental_consent_at
    ) {
      Alert.alert(
        t("marketplace.coach.consentRequired"),
        t("marketplace.coach.consentRequiredDesc"),
        [{ text: t("common.close") }]
      );
      return;
    }

    router.push(
      `/marketplace/checkout?coach_id=${coachId}&package_id=${packageId}` as never
    );
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <View style={[styles.screenHeader, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("marketplace.coach.screenTitle")} onBack={() => router.back()} />
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero skeleton centrado */}
        <View style={styles.heroSkeletonCenter}>
          <Skeleton width={96} height={96} borderRadius={9999} />
          <View style={{ height: spacing[3] }} />
          <Skeleton width={180} height={32} />
          <View style={{ height: spacing[2] }} />
          <Skeleton width={120} height={14} />
          <View style={{ height: spacing[2] }} />
          <Skeleton width={200} height={14} />
        </View>
        <View style={{ height: spacing[6] }} />
        <Skeleton width="100%" height={140} />
        <View style={{ height: spacing[3] }} />
        <Skeleton width="100%" height={140} />
      </ScrollView>
      </View>
    );
  }

  if (isError || !coach) {
    return (
      <View style={styles.screen}>
        <View style={[styles.screenHeader, { paddingTop: insets.top + spacing[4] }]}>
          <ScreenHeader title={t("marketplace.coach.screenTitle")} onBack={() => router.back()} />
        </View>
        <ErrorState
          title={t("marketplace.coach.notFound")}
          description={t("marketplace.coach.notFoundDesc")}
          onRetry={() => void refetch()}
        />
      </View>
    );
  }

  const initials = getInitials(coach.display_name);
  const activePackages = coach.packages.filter((p) => p.active);

  const yearsExp = coach.years_experience;
  const experienceText =
    yearsExp !== null
      ? t("marketplace.coach.experience", {
          count: yearsExp,
          unit: t("marketplace.coach.year", { count: yearsExp }),
        })
      : null;

  const avgRatingDisplay =
    coach.avg_rating !== null
      ? parseFloat(String(coach.avg_rating)).toFixed(1)
      : null;

  const hasGallery = (galleryImages?.length ?? 0) > 0;
  const hasVideo = !!coach.presentation_video_path;
  const hasInterests = coach.interests.length > 0;

  return (
    <View style={styles.screen}>
      <View style={[styles.screenHeader, { paddingTop: insets.top + spacing[4] }]}>
        <ScreenHeader title={t("marketplace.coach.screenTitle")} onBack={() => router.back()} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        {/* Avatar grande con borde lime */}
        <View style={styles.avatarWrapper}>
          {coach.avatar_url ? (
            <Image
              source={{ uri: coach.avatar_url }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}
        </View>

        <Text style={styles.coachName}>{coach.display_name}</Text>

        {/* Fila de metadata muted */}
        <View style={styles.heroMetaRow}>
          {experienceText !== null && (
            <Text style={styles.heroMeta}>{experienceText}</Text>
          )}
          {experienceText !== null && coach.rating_count > 0 && (
            <Text style={styles.heroMetaDot}>·</Text>
          )}
          {/* Rating summary in hero */}
          {coach.rating_count > 0 && avgRatingDisplay !== null && (
            <View style={styles.heroRatingRow} testID="coach-avg-rating">
              <Text style={styles.heroRatingStar}>★</Text>
              <Text style={styles.heroRatingText}>
                {avgRatingDisplay}
              </Text>
              <Text style={styles.heroRatingCount}>
                ({t("coachRatings.ratingCount", { count: coach.rating_count })})
              </Text>
            </View>
          )}
        </View>

        {coach.specialties.length > 0 && (
          <View style={styles.specialties}>
            {coach.specialties.map((s) => (
              <Pill key={s} label={s} variant="default" />
            ))}
          </View>
        )}
      </View>

      {/* Galería de imágenes — solo si hay imágenes */}
      {hasGallery && galleryImages !== undefined && (
        <View style={styles.section} testID="coach-gallery-section">
          <Text style={styles.sectionTitle}>{t("marketplace.coach.gallery").toUpperCase()}</Text>
          <GalleryCarousel images={galleryImages} />
        </View>
      )}

      {/* Video de presentación — solo si existe */}
      {hasVideo && coach.presentation_video_path !== null && (
        <View style={styles.section} testID="coach-video-section">
          <Text style={styles.sectionTitle}>{t("marketplace.coach.presentationVideo").toUpperCase()}</Text>
          <PresentationVideoPlayer videoPath={coach.presentation_video_path} />
        </View>
      )}

      {/* Bio */}
      {coach.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("marketplace.coach.about").toUpperCase()}</Text>
          <Text style={styles.bio}>{coach.bio}</Text>
        </View>
      ) : null}

      {/* Especialidades */}
      {coach.specialties.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("marketplace.coach.specialties").toUpperCase()}</Text>
          <View style={styles.pillsRow}>
            {coach.specialties.map((s) => (
              <Pill key={s} label={s} variant="default" />
            ))}
          </View>
        </View>
      )}

      {/* Intereses — sección diferenciada, pills con variante secundaria */}
      {hasInterests && (
        <View style={styles.section} testID="coach-interests-section">
          <Text style={styles.sectionTitle}>{t("marketplace.coach.interests").toUpperCase()}</Text>
          <View style={styles.pillsRow}>
            {coach.interests.map((interest) => (
              <Pill key={interest} label={interest} color={colors.info} />
            ))}
          </View>
        </View>
      )}

      {/* Packages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("marketplace.coach.packages").toUpperCase()}</Text>
        {activePackages.length === 0 ? (
          <View style={styles.noPackagesCard}>
            <Text style={styles.noPackages}>
              {t("marketplace.coach.noPackages")}
            </Text>
          </View>
        ) : (
          activePackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              currencySymbol={currencySymbol}
              onContratar={handleContratar}
              hireLabel={t("marketplace.coach.hire")}
              featuresLabel={t("marketplace.coach.featuresLabel")}
            />
          ))
        )}
      </View>

      {/* Reviews */}
      {user && (
        <ReviewsSection
          coachId={coach.id}
          userId={user.id}
          avgRating={coach.avg_rating}
          ratingCount={coach.rating_count}
        />
      )}

      {/* P1.5 — Report coach profile */}
      <TouchableOpacity
        style={styles.reportBtn}
        onPress={() => setReportCoachVisible(true)}
        activeOpacity={0.7}
        testID="report-coach-btn"
      >
        <Text style={styles.reportBtnText}>{t("report.btn_coach")}</Text>
      </TouchableOpacity>
      </ScrollView>

      {/* Report modal */}
      {coachId !== undefined && (
        <ReportModal
          visible={reportCoachVisible}
          targetType="coach_profile"
          targetId={coachId}
          onClose={() => setReportCoachVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screenHeader: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[12],
  },
  hero: {
    alignItems: "center",
    paddingVertical: spacing[6],
    gap: spacing[3],
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.limeGlow,
    borderWidth: 3,
    borderColor: colors.lime,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.limeGlow,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 36,
    letterSpacing: 1,
  },
  coachName: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize.screenTitle,
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
    flexWrap: "wrap",
    justifyContent: "center",
  },
  heroMeta: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  heroMetaDot: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
  },
  heroRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroRatingStar: {
    color: colors.warning,
    fontSize: fontSize.sm,
  },
  heroRatingText: {
    fontFamily: typography.mono,
    color: colors.warning,
    fontSize: fontSize.sm,
  },
  heroRatingCount: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  specialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    justifyContent: "center",
  },
  pillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[3],
  },
  bio: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 15,
    lineHeight: 22,
  },
  packageCard: {
    backgroundColor: colors.surface3,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  packageCardHighlighted: {
    backgroundColor: colors.limeGlow,
    borderColor: colors.lime,
    borderWidth: 2,
  },
  packageBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
  },
  packageBadgeText: {
    fontFamily: typography.body,
    color: colors.black,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
  },
  packageName: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize["2xl"],
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  packageDesc: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: fontSize.md,
    lineHeight: 20,
  },
  packageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[2],
  },
  packagePriceAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  packagePriceHighlighted: {
    fontSize: fontSize["2xl"],
  },
  contratarBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 44,
    justifyContent: "center",
  },
  contratarText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize.base,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  featuresContainer: {
    gap: spacing[2],
    paddingTop: spacing[1],
  },
  featuresLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing[1],
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing[2],
  },
  featureCheck: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.sm,
    lineHeight: 20,
    minWidth: 16,
  },
  featureText: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: fontSize.sm,
    lineHeight: 20,
    flex: 1,
  },
  noPackagesCard: {
    backgroundColor: colors.surface3,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
  },
  noPackages: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.md,
    textAlign: "center",
    paddingVertical: spacing[2],
  },
  heroSkeletonCenter: {
    alignItems: "center",
    paddingVertical: spacing[6],
    gap: spacing[2],
  },
  skeletonInfo: {
    flex: 1,
    gap: spacing[2],
  },
  // Ratings section
  ratingHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[3],
  },
  ratingHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  ratingCountText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  noAssignmentText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    fontStyle: "italic",
    marginBottom: spacing[3],
  },
  errorText: {
    fontFamily: typography.body,
    color: colors.error,
    fontSize: fontSize.sm,
    textAlign: "center",
    marginVertical: spacing[4],
  },
  reviewCard: {
    marginBottom: spacing[3],
    gap: spacing[2],
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewDate: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
  },
  reviewComment: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  // Rating form
  rateToggleBtn: {
    borderWidth: 1,
    borderColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    alignItems: "center",
    marginBottom: spacing[4],
    minHeight: 44,
    justifyContent: "center",
  },
  rateToggleText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  ratingFormCard: {
    marginBottom: spacing[4],
    gap: spacing[3],
  },
  ratingFormTitle: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
    fontWeight: "700",
  },
  ratingFormLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: spacing[2],
  },
  ratingCommentInput: {
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[3],
    color: colors.text,
    fontFamily: typography.body,
    fontSize: fontSize.base,
    minHeight: 80,
    textAlignVertical: "top",
  },
  ratingFormActions: {
    flexDirection: "row",
    gap: spacing[3],
    marginTop: spacing[2],
  },
  submitRatingBtn: {
    flex: 1,
    backgroundColor: colors.lime,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  submitRatingBtnDisabled: {
    opacity: 0.4,
  },
  submitRatingText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize.base,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  cancelRatingBtn: {
    flex: 1,
    backgroundColor: colors.surface3,
    borderRadius: radius.md,
    paddingVertical: spacing[3],
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelRatingText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.base,
  },
  // Report coach profile
  reportBtn: {
    alignSelf: "center",
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
  },
  reportBtnText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
