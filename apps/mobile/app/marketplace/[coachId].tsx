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
} from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import { Card, Pill, Skeleton, ErrorState, EmptyState } from "@forzza/ui/native";
import { colors, spacing, typography, radius, fontSize } from "@forzza/ui/tokens";

// Columnas reales de coach_packages: id, coach_id, tier, title, description, price, active
interface CoachPackage {
  id: string;
  title: string;
  description: string | null;
  price: number; // entero en centavos
  tier: "starter" | "pro" | "elite";
  active: boolean;
}

interface CoachProfile {
  id: string;
  user_id: string;
  display_name: string;
  bio: string | null;
  specialties: string[];
  avatar_url: string | null;
  years_experience: number | null;
  status: string;
  avg_rating: number | null;
  rating_count: number;
  packages: CoachPackage[];
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

function PackageCard({
  pkg,
  currencySymbol,
  onContratar,
  hireLabel,
}: {
  pkg: CoachPackage;
  currencySymbol: string;
  onContratar: (packageId: string) => void;
  hireLabel: string;
}) {
  // Precio en centavos → mostrar formateado
  const price = (pkg.price / 100).toLocaleString("es-AR");

  return (
    <Card style={styles.packageCard} padding="lg">
      <Text style={styles.packageName}>{pkg.title}</Text>
      {pkg.description ? (
        <Text style={styles.packageDesc}>{pkg.description}</Text>
      ) : null}

      <View style={styles.packageFooter}>
        <Text style={styles.packagePrice}>
          <Text style={styles.packagePriceAmount}>
            {currencySymbol}
            {price}
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.contratarBtn}
          activeOpacity={0.8}
          onPress={() => onContratar(pkg.id)}
        >
          <Text style={styles.contratarText}>{hireLabel}</Text>
        </TouchableOpacity>
      </View>
    </Card>
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
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { user } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({ title: t("marketplace.coach.screenTitle") });
  }, [t, navigation]);

  const { data: coach, isLoading, isError, refetch } = useQuery({
    queryKey: ["coach_profile", coachId],
    queryFn: async (): Promise<CoachProfile | null> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_profiles")
        .select(
          "id, user_id, display_name, bio, specialties, avatar_url, years_experience, status, avg_rating, rating_count, packages:coach_packages(id, title, description, price, tier, active)"
        )
        .eq("id", coachId!)
        .eq("status", "approved")
        .single();
      if (error) return null;
      return data as CoachProfile | null;
    },
    enabled: !!coachId,
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
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.heroSkeleton}>
          <Skeleton width={96} height={96} borderRadius={48} />
          <View style={styles.skeletonInfo}>
            <Skeleton width="60%" height={28} />
            <Skeleton width="80%" height={14} />
            <Skeleton width="50%" height={14} />
          </View>
        </View>
        <Skeleton width="100%" height={140} />
        <View style={{ height: spacing[3] }} />
        <Skeleton width="100%" height={140} />
      </ScrollView>
    );
  }

  if (isError || !coach) {
    return (
      <ErrorState
        title={t("marketplace.coach.notFound")}
        description={t("marketplace.coach.notFoundDesc")}
        onRetry={() => void refetch()}
      />
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

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
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

        <Text style={styles.coachName}>{coach.display_name}</Text>

        {/* Rating summary in hero */}
        {coach.rating_count > 0 && avgRatingDisplay !== null && (
          <View style={styles.heroRatingRow} testID="coach-avg-rating">
            <StarRating value={Math.round(coach.avg_rating ?? 0)} size={18} />
            <Text style={styles.heroRatingText}>
              {avgRatingDisplay} · {t("coachRatings.ratingCount", { count: coach.rating_count })}
            </Text>
          </View>
        )}

        {experienceText !== null && (
          <Text style={styles.experience}>{experienceText}</Text>
        )}

        {coach.specialties.length > 0 && (
          <View style={styles.specialties}>
            {coach.specialties.map((s) => (
              <Pill key={s} label={s} variant="default" />
            ))}
          </View>
        )}
      </View>

      {/* Bio */}
      {coach.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("marketplace.coach.about")}</Text>
          <Text style={styles.bio}>{coach.bio}</Text>
        </View>
      ) : null}

      {/* Packages */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("marketplace.coach.packages")}</Text>
        {activePackages.length === 0 ? (
          <Card>
            <Text style={styles.noPackages}>
              {t("marketplace.coach.noPackages")}
            </Text>
          </Card>
        ) : (
          activePackages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              currencySymbol={currencySymbol}
              onContratar={handleContratar}
              hireLabel={t("marketplace.coach.hire")}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.black,
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
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
  },
  avatarFallback: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    backgroundColor: colors.gray700,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontFamily: typography.heading,
    color: colors.lime,
    fontSize: 32,
    letterSpacing: 1,
  },
  coachName: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 32,
    letterSpacing: 1,
    textAlign: "center",
    textTransform: "uppercase",
  },
  heroRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  heroRatingText: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: fontSize.sm,
  },
  experience: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 14,
  },
  specialties: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing[2],
    justifyContent: "center",
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 12,
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
    marginBottom: spacing[3],
    gap: spacing[3],
  },
  packageName: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: 22,
    letterSpacing: 0.5,
  },
  packageDesc: {
    fontFamily: typography.body,
    color: colors.gray300,
    fontSize: 14,
    lineHeight: 20,
  },
  packageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing[2],
  },
  packagePrice: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 14,
  },
  packagePriceAmount: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: 18,
    fontWeight: "700",
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
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  noPackages: {
    fontFamily: typography.body,
    color: colors.gray500,
    fontSize: 14,
    textAlign: "center",
    paddingVertical: spacing[4],
  },
  heroSkeleton: {
    flexDirection: "row",
    gap: spacing[3],
    marginBottom: spacing[6],
    alignItems: "flex-start",
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
});
