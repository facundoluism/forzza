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
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useEntitlements } from "@/hooks/useEntitlements";
import { EmptyState, Card, Skeleton, UpgradeModal } from "@forzza/ui/native";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";

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

const RoutineCard = memo(function RoutineCard({ routine }: { routine: Routine }): React.JSX.Element {
  const router = useRouter();
  const exerciseCount = routine.exercises?.length ?? 0;
  const createdDate = new Date(routine.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card
      style={styles.card}
      onPress={() => router.push(`/routine/${routine.id}`)}
    >
      <Text style={styles.routineName}>{routine.title}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          <Text style={styles.metaMono}>{exerciseCount}</Text>
          {" "}{exerciseCount === 1 ? "ejercicio" : "ejercicios"}
        </Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>Creada el {createdDate}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={styles.arrowText}>›</Text>
      </View>
    </Card>
  );
});

export default function RoutinesTab(): React.JSX.Element {
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
          <Text style={styles.screenTitle}>Mis Rutinas</Text>
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
          <Text style={styles.screenTitle}>Mis Rutinas</Text>
        </View>
        <EmptyState
          title="No se pudieron cargar las rutinas"
          description="Revisá tu conexión e intentá de nuevo."
          icon="⚠️"
        />
      </View>
    );
  }

  const atLimit = !isPro && (routines?.length ?? 0) >= FREE_ROUTINE_LIMIT;

  return (
    <View style={containerStyle}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Mis Rutinas</Text>
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
            Límite del plan gratuito: {FREE_ROUTINE_LIMIT} rutinas
          </Text>
        </View>
      )}

      <FlatList
        data={routines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RoutineCard routine={item} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing[3] }} />}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <EmptyState
            title="No tenés rutinas todavía"
            description="Creá tu primera rutina tocando el botón «+» o esperá a que tu coach te asigne una."
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
        feature="crear más de 3 rutinas"
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
    fontSize: 32,
    letterSpacing: -1,
    textTransform: "uppercase",
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
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginBottom: spacing[4],
  },
  limitBannerText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: spacing[8],
    flexGrow: 1,
  },
  card: {
    position: "relative",
  },
  routineName: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing[2],
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  metaText: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: 13,
  },
  metaMono: {
    fontFamily: typography.mono,
    color: colors.muted,
    fontSize: 13,
  },
  metaDot: {
    color: colors.border,
    fontSize: 13,
  },
  arrow: {
    position: "absolute",
    right: spacing[4],
    top: "50%",
  },
  arrowText: {
    color: colors.gray500,
    fontSize: 24,
  },
});
