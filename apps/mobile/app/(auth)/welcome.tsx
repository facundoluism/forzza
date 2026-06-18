import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { QUOTES, quoteByIndex, quoteText } from "@forzza/core";
import { useLanguageStore } from "@/stores/languageStore";
import { colors, spacing, radius, typography, fontSize } from "@forzza/ui/tokens";

export default function WelcomeScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const [qIdx, setQIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setQIdx((i) => (i + 1) % QUOTES.length);
    }, 5000);
    return () => { clearInterval(timer); };
  }, []);

  const q = quoteByIndex(qIdx);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing[6], paddingBottom: insets.bottom + spacing[6] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Logo + nombre */}
      <View style={styles.logoRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoIcon}>⚡</Text>
        </View>
        <Text style={styles.logoText}>FORZZA</Text>
      </View>

      {/* Subtítulo */}
      <Text style={styles.subtitle}>{t('auth.welcome.subtitle')}</Text>

      {/* Frase rotativa */}
      <View key={qIdx} style={styles.quoteContainer}>
        <Text style={styles.quoteText}>"{quoteText(q, language)}"</Text>
        <Text style={styles.quoteAuthor}>— {q.author}</Text>
        <Text style={styles.quoteSport}>{q.sport}</Text>
      </View>

      {/* Headline grande */}
      <View style={styles.headlineBlock}>
        <Text style={styles.headlineLine}>{t('auth.welcome.headlineTop')}</Text>
        <Text style={[styles.headlineLine, styles.headlineAccent]}>{t('auth.welcome.headlineAccent')}</Text>
        <Text style={styles.headlineLine}>{t('auth.welcome.headlineBottom')}</Text>
      </View>

      {/* CTAs */}
      <View style={styles.ctaBlock}>
        <TouchableOpacity
          testID="welcome-start-button"
          style={styles.primaryButton}
          onPress={() => { router.push("/(auth)/signup"); }}
          accessibilityLabel={t('auth.welcome.primaryBtn')}
        >
          <Text style={styles.primaryButtonText}>{t('auth.welcome.primaryBtn')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="welcome-login-button"
          style={styles.secondaryButton}
          onPress={() => { router.push("/(auth)/login"); }}
          accessibilityLabel={t('auth.welcome.secondaryBtn')}
        >
          <Text style={styles.secondaryButtonText}>{t('auth.welcome.secondaryBtn')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[6],
    justifyContent: "space-between",
    gap: spacing[6],
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
  },
  logoBox: {
    width: 48,
    height: 48,
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    fontSize: fontSize.xl,
  },
  logoText: {
    fontFamily: typography.heading,
    fontSize: 44,
    color: colors.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  quoteContainer: {
    gap: spacing[1],
  },
  quoteText: {
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.text,
    fontStyle: "italic",
    lineHeight: 22,
  },
  quoteAuthor: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.lime,
    fontWeight: "700",
  },
  quoteSport: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.muted,
  },
  headlineBlock: {
    gap: spacing[0],
  },
  headlineLine: {
    fontFamily: typography.heading,
    fontSize: 52,
    color: colors.text,
    lineHeight: 54,
    letterSpacing: -1,
  },
  headlineAccent: {
    color: colors.lime,
  },
  ctaBlock: {
    gap: spacing[3],
  },
  primaryButton: {
    backgroundColor: colors.lime,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: typography.heading,
    color: colors.black,
    fontSize: fontSize.lg,
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing[4],
    alignItems: "center",
  },
  secondaryButtonText: {
    fontFamily: typography.body,
    color: colors.text,
    fontSize: fontSize.base,
  },
});
