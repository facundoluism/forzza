import { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  type ListRenderItemInfo,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CoachCard, type CoachCardData } from "@/components/CoachCard";
import { EmptyState, Skeleton, ErrorState } from "@forzza/ui/native";
import { colors, fontSize, spacing, typography, radius } from "@forzza/ui/tokens";

interface CountryConfig {
  currency_symbol: string;
}

function CoachCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonRow}>
        <Skeleton width={64} height={64} borderRadius={32} />
        <View style={styles.skeletonInfo}>
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={14} />
          <Skeleton width="30%" height={14} />
        </View>
      </View>
    </View>
  );
}

export default function MarketplaceScreen() {
  const [search, setSearch] = useState("");

  const { data: coaches, isLoading, isError, refetch } = useQuery({
    queryKey: ["marketplace_coaches"],
    queryFn: async (): Promise<CoachCardData[]> => {
      // Columnas reales de coach_packages: id, title, price, tier, active
      // TODO: regenerar db-types — cast mínimo hasta que se actualice el esquema generado
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from("coach_profiles")
        .select(
          "id, display_name, avatar_url, specialties, packages:coach_packages(id, title, price, tier, active)"
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as CoachCardData[];
    },
  });

  const { data: countryConfig } = useQuery({
    queryKey: ["country_config_symbol"],
    queryFn: async (): Promise<CountryConfig> => {
      const { data, error } = await supabase
        .from("country_config")
        .select("currency_symbol")
        .eq("country", "AR")
        .single();
      if (error) throw error;
      return data as CountryConfig;
    },
  });

  const currencySymbol = countryConfig?.currency_symbol ?? "$";

  const filtered = useMemo(() => {
    if (!coaches) return [];
    const q = search.trim().toLowerCase();
    if (!q) return coaches;
    return coaches.filter((c) =>
      c.display_name.toLowerCase().includes(q)
    );
  }, [coaches, search]);

  function renderItem({ item }: ListRenderItemInfo<CoachCardData>) {
    return <CoachCard coach={item} currencySymbol={currencySymbol} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Coaches</Text>
        <Text style={styles.subtitle}>
          Encontrá al coach ideal para tus objetivos
        </Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          placeholderTextColor={colors.gray500}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
          returnKeyType="search"
        />
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          <CoachCardSkeleton />
          <CoachCardSkeleton />
          <CoachCardSkeleton />
        </View>
      ) : isError ? (
        <ErrorState
          title="No pudimos cargar los coaches"
          description="Revisá tu conexión e intentá de nuevo."
          onRetry={() => void refetch()}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No hay coaches disponibles"
              description={
                search
                  ? `No encontramos coaches con ese nombre.`
                  : "No hay coaches aprobados todavía. Volvé pronto."
              }
              icon="🔍"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  title: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize.screenTitle,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: typography.body,
    color: colors.gray400,
    fontSize: 14,
    marginTop: spacing[1],
  },
  searchWrapper: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  searchInput: {
    backgroundColor: colors.gray900,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gray800,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    color: colors.white,
    fontFamily: typography.body,
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  skeletonContainer: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    marginTop: spacing[2],
  },
  skeletonCard: {
    backgroundColor: colors.gray900,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.gray800,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  skeletonRow: {
    flexDirection: "row",
    gap: spacing[3],
  },
  skeletonInfo: {
    flex: 1,
    gap: spacing[2],
  },
});
