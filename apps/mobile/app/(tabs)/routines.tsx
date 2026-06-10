import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useEntitlements } from "@/hooks/useEntitlements";
import { EmptyState, Card, Skeleton, UpgradeModal } from "@forzza/ui/native";
import { colors, spacing, radius, typography } from "@forzza/ui/tokens";

const FREE_ROUTINE_LIMIT = 3;

interface Routine {
  id: string;
  name: string;
  created_at: string;
  student_id: string;
  exercise_count: Array<{ count: number }>;
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

function RoutineCard({ routine }: { routine: Routine }): React.JSX.Element {
  const router = useRouter();
  const exerciseCount = routine.exercise_count[0]?.count ?? 0;
  const createdDate = new Date(routine.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/routine/${routine.id}`)}
    >
      <Card style={styles.card}>
        <Text style={styles.routineName}>{routine.name}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            {exerciseCount} {exerciseCount === 1 ? "ejercicio" : "ejercicios"}
          </Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>Creada el {createdDate}</Text>
        </View>
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function RoutinesTab(): React.JSX.Element {
  const { user } = useAuth();
  const { isPro } = useEntitlements();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { data: routines, isLoading, isError } = useQuery({
    queryKey: ["routines", user?.id],
    queryFn: async (): Promise<Routine[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("routines" as never)
        .select("*, exercise_count:routine_exercises(count)")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .eq("student_id" as any, user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .order("created_at" as any, { ascending: false });
      if (error) throw error;
      return (data ?? []) as Routine[];
    },
    enabled: !!user,
  });

  const handleCreateRoutine = (): void => {
    const count = routines?.length ?? 0;
    if (!isPro && count >= FREE_ROUTINE_LIMIT) {
      setShowUpgradeModal(true);
      return;
    }
    // In V1 routine creation is coach-driven; show UpgradeModal as stub
    setShowUpgradeModal(true);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Mis Rutinas</Text>
        </View>
        <SkeletonRoutineCard />
        <SkeletonRoutineCard />
        <SkeletonRoutineCard />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
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
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Mis Rutinas</Text>
        <TouchableOpacity
          style={[styles.addButton, atLimit && styles.addButtonLimited]}
          onPress={handleCreateRoutine}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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
        ListEmptyComponent={
          <EmptyState
            title="No tenés rutinas todavía"
            description="Tu coach todavía no te asignó ninguna rutina. ¡Ya va a llegar!"
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
    backgroundColor: colors.black,
    paddingTop: spacing[12],
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
    color: colors.white,
    fontSize: 32,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  addButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonLimited: {
    backgroundColor: colors.gray700,
  },
  addButtonText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: 28,
    lineHeight: 32,
  },
  limitBanner: {
    backgroundColor: colors.gray900,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray700,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginBottom: spacing[4],
  },
  limitBannerText: {
    fontFamily: typography.body,
    color: colors.gray400,
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
    color: colors.white,
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
    color: colors.gray500,
    fontSize: 13,
  },
  metaDot: {
    color: colors.gray700,
    fontSize: 13,
  },
  arrow: {
    position: "absolute",
    right: spacing[4],
    top: "50%",
  },
  arrowText: {
    color: colors.gray600,
    fontSize: 24,
  },
});
