import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

export default function CatWaitlistScreen() {
  const { completeOnboarding } = useAuth()
  const router  = useRouter()
  const [email,   setEmail]   = useState('')
  const [joined,  setJoined]  = useState(false)
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!email.includes('@')) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))  // mock delay
    setJoined(true)
    setLoading(false)
  }

  const handleContinue = () => {
    completeOnboarding('cat')
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Illustration */}
          <View style={styles.illustrationBox}>
            <Text style={styles.mainEmoji}>🐱</Text>
            <View style={styles.cookingBadge}>
              <Text style={styles.cookingEmoji}>👨‍🍳</Text>
            </View>
          </View>

          {/* Copy */}
          <Text style={styles.title}>Cat meals are{'\n'}on their way!</Text>
          <Text style={styles.subtitle}>
            Our chefs are crafting fresh, personalized recipes for your feline friend.
            Be the first to know when we launch.
          </Text>

          {/* Features coming soon */}
          <View style={styles.featuresCard}>
            {[
              { emoji: '🐟', text: 'Fresh fish & poultry bowls' },
              { emoji: '💊', text: 'Taurine & omega-3 boosters' },
              { emoji: '🩺', text: 'Vet-approved nutrition' },
              { emoji: '🚚', text: 'Same-day delivery' },
            ].map(f => (
              <View key={f.text} style={styles.featureRow}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>

          {/* Email signup */}
          {!joined ? (
            <View style={styles.emailSection}>
              <Text style={styles.emailLabel}>Get notified when cat meals launch</Text>
              <View style={styles.emailRow}>
                <TextInput
                  style={styles.emailInput}
                  placeholder="your@email.com"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={[styles.joinBtn, (!email.includes('@') || loading) && styles.joinBtnDisabled]}
                  onPress={handleJoin}
                  disabled={!email.includes('@') || loading}
                  activeOpacity={0.85}
                >
                  <Text style={styles.joinBtnText}>{loading ? '…' : 'Notify me'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.successBanner}>
              <Text style={styles.successEmoji}>✅</Text>
              <Text style={styles.successText}>You're on the list! We'll email you at {email}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue to app →</Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            You can still browse our dog meal menu in the meantime
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  illustrationBox: {
    position: 'relative',
    width: 120,
    height: 120,
    marginBottom: SPACING.lg,
  },
  mainEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  cookingBadge: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow(2),
  },
  cookingEmoji: {
    fontSize: 22,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.sm,
  },
  featuresCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    ...shadow(1),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  featureText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },
  emailSection: {
    width: '100%',
    gap: SPACING.sm,
  },
  emailLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  emailRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  emailInput: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textPrimary,
  },
  joinBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  joinBtnText: {
    color: '#fff',
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.sm,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#f0fdf4',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
  },
  successEmoji: {
    fontSize: 20,
  },
  successText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: '#166534',
    fontWeight: FONTS.weights.medium,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
    alignItems: 'center',
  },
  continueBtn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    ...shadow(3),
  },
  continueBtnText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
  footerNote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})
