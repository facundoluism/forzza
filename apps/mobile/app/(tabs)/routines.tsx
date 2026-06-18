import { memo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useEntitlements } from "@/hooks/useEntitlements";
import { EmptyState, Card, Skeleton, UpgradeModal } from "@forzza/ui/native";
import { colors, fontSize, spacing, radius, typography } from "@forzza/ui/tokens";

const FREE_ROUTINE_LIMIT = 3;

// Shape canónico del JSONB routines.exercises
interface RoutineExercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
}

interface Routine {
  id: string;
  title: string;
  created_at: string;
  student_id: string;
  exercises: RoutineExercise[];
}

function SkeletonRoutineCard(): React.JSX.Element {
  return (
    <Card style={styles.card}>
      <Skeleton width="70%" height={22} />
      <View style={{ height: spacing[2] }} />
      <Skeleton width="40%" height={14} />
      <View style={{ height: spacing[1] }} />
      <Skeleton width="30%" height={14} />
    </Card>
  );
}

const RoutineCard = memo(function RoutineCard({
  routine,
  featured = false,
}: {
  routine: Routine;
  featured?: boolean;
}): React.JSX.Element {
  const router = useRouter();
  const { t } = useTranslation();
  const exerciseCount = routine.exercises?.length ?? 0;
  const setCount = routine.exercises?.reduce((acc, ex) => acc + ex.sets, 0) ?? 0;

  return (
    <Card
      style={[styles.card, featured && styles.cardFeatured]}
      featured={featured}
      onPress={() => router.push(`/routine/${routine.id}`)}
    >
      <Text style={styles.routineName}>{routine.title}</Text>
      <View style={styles.meta}>
        <View style={styles.statPill}>
          <Text style={styles.statPillValue}>{exerciseCount}</Text>
          <Text style={styles.statPillLabel}>{t("routines.exercise", { count: exerciseCount }).toUpperCase()}</Text>
        </View>
        <View style={styles.statPillSep} />
        <View style={styles.statPill}>
          <Text style={styles.statPillValue}>{setCount}</Text>
          <Text style={styles.statPillLabel}>SETS</Text>
        </View>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Card>
  );
});

export default function RoutinesTab(): React.JSX.Element {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isPro } = useEntitlements();
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const insets = useSafeAreaInsets();

  const { data: routines, isLoading, isError } = useQuery({
    queryKey: ["routines", user?.id],
    queryFn: async (): Promise<Routine[]> => {
      if (!user) return [];
      // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("routines")
        .select("id, title, exercises, created_at, student_id")
        .eq("student_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Routine[];
    },
    enabled: !!user,
  });

  const handleCreateRoutine = (): void => {
    const count = routines?.length ?? 0;
    if (!isPro && count >= FREE_ROUTINE_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }
    router.push("/routine/new");
  };

  const containerStyle = [styles.container, { paddingTop: insets.top + spacing[2] }];

  if (isLoading) {
    return (
      <View style={containerStyle}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>{t("routines.title")}</Text>
            <Text style={styles.screenSubtitle}>{t("routines.subtitle")}</Text>
          </View>
        </View>
        <SkeletonRoutineCard />
        <View style={{ height: spacing[3] }} />
        <SkeletonRoutineCard />
        <View style={{ height: spacing[3] }} />
        <SkeletonRoutineCard />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={containerStyle}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.screenTitle}>{t("routines.title")}</Text>
            <Text style={styles.screenSubtitle}>{t("routines.subtitle")}</Text>
          </View>
        </View>
        <EmptyState
          title={t("routines.error_title")}
          description={t("routines.error_desc")}
          icon="⚠️"
        />
      </View>
    );
  }

  const atLimit = !isPro && (routines?.length ?? 0) >= FREE_ROUTINE_LIMIT;

  return (
    <View style={containerStyle}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.screenTitle}>{t("routines.title")}</Text>
          <Text style={styles.screenSubtitle}>{t("routines.subtitle")}</Text>
        </View>
        <Pressable
          style={[styles.addButton, atLimit && styles.addButtonLimited]}
          onPress={handleCreateRoutine}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {atLimit && (
        <View style={styles.limitBanner}>
          <Text style={styles.limitBannerText}>
            {t("routines.freeLimit", { count: FREE_ROUTINE_LIMIT })}
          </Text>
        </View>
      )}

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <RoutineCard routine={item} featured={index === 0} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            title={t("routines.empty_title")}
            description={t("routines.empty_desc")}
            icon="📋"
          />
        }
      />

      <UpgradeModal
        visible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setShowUpgradeModal(false);
          // TODO: deep-link to upgrade page when mobile linking is set up
        }}
        feature={t("routines.upgradeFeature")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing[4],
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing[5],
  },
  screenTitle: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: fontSize.screenTitle,
    letterSpacing: -1,
    textTransform: "uppercase",
  },
  screenSubtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.lime,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  addButtonLimited: {
    backgroundColor: colors.gray700,
    shadowColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 28,
    lineHeight: 32,
  },
  limitBanner: {
    backgroundColor: colors.limeGlow,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lime,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginBottom: spacing[4],
  },
  limitBannerText: {
    fontFamily: typography.body,
    color: colors.lime,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: spacing[8],
    flexGrow: 1,
  },
  card: {
    position: "relative",
    gap: spacing[2],
  },
  cardFeatured: {
    borderColor: colors.limeGlow,
  },
  routineName: {
    fontFamily: typography.heading,
    color: colors.text,
    fontSize: 22,
    letterSpacing: -0.5,
    textTransform: "uppercase",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  statPill: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  statPillValue: {
    fontFamily: typography.mono,
    color: colors.lime,
    fontSize: fontSize.lg,
    fontWeight: "700",
  },
  statPillLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    letterSpacing: 0.5,
  },
  statPillSep: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
    marginHorizontal: spacing[1],
  },
  arrow: {
    position: "absolute",
    right: spacing[4],
    top: "50%",
  },
  arrowText: {
    color: colors.muted,
    fontSize: 24,
  },
});
