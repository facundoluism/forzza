import { useState, useMemo, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  type ListRenderItemInfo,
} from "react-native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
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
        <Skeleton width={52} height={52} borderRadius={9999} />
        <View style={styles.skeletonInfo}>
          <Skeleton width="55%" height={22} />
          <Skeleton width="35%" height={12} />
          <Skeleton width="45%" height={14} />
        </View>
      </View>
    </View>
  );
}

export default function MarketplaceScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({ title: t('marketplace.index.screenTitle') });
  }, [t, navigation]);

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
      {/* Header DS: logoBox + título BebasNeue + label muted */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>F</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{t('marketplace.index.screenTitle').toUpperCase()}</Text>
            <Text style={styles.subtitle}>{t('marketplace.index.subtitle')}</Text>
          </View>
        </View>
      </View>

      {/* Search bar con ícono */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={t('marketplace.index.searchPlaceholder')}
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Section label */}
      <View style={styles.sectionLabelWrapper}>
        <Text style={styles.sectionLabel}>{t('marketplace.index.sectionLabel')}</Text>
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
          title={t('marketplace.index.errorTitle')}
          description={t('marketplace.index.errorDesc')}
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
              title={t('marketplace.index.emptyTitle')}
              description={
                search
                  ? t('marketplace.index.emptyNoResults')
                  : t('marketplace.index.emptyNoneApproved')
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
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize["2xl"],
    letterSpacing: 0,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: typography.heading,
    color: colors.white,
    fontSize: fontSize.screenTitle,
    letterSpacing: 1,
    textTransform: "uppercase",
    lineHeight: fontSize.screenTitle + 4,
  },
  subtitle: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    gap: spacing[2],
  },
  searchIcon: {
    fontSize: fontSize.base,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontFamily: typography.body,
    fontSize: fontSize.md,
    padding: 0,
  },
  sectionLabelWrapper: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
    marginTop: spacing[1],
  },
  sectionLabel: {
    fontFamily: typography.body,
    color: colors.muted,
    fontSize: fontSize.xs,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
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
    backgroundColor: colors.surface2,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[4],
    marginBottom: spacing[3],
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  skeletonInfo: {
    flex: 1,
    gap: spacing[2],
  },
});
