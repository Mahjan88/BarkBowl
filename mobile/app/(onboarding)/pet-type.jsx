import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Easing, useAnimatedValue,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

export default function PetTypeScreen() {
  const [selected, setSelected] = useState(null)  // 'dog' | 'cat'
  const router = useRouter()
  const { user } = useAuth()

  // Bounce animation per card
  const dogScale = useAnimatedValue(1)
  const catScale = useAnimatedValue(1)

  const bounce = (anim) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.93, duration: 100, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.spring(anim,  { toValue: 1,    friction: 4,   useNativeDriver: true }),
    ]).start()
  }

  const handleSelect = (type) => {
    setSelected(type)
    bounce(type === 'dog' ? dogScale : catScale)
  }

  const handleContinue = () => {
    if (!selected) return
    if (selected === 'dog') {
      router.push('/(onboarding)/dog-setup')
    } else {
      router.push('/(onboarding)/cat-waitlist')
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>🐾</Text>
        <Text style={styles.title}>What type of pet{'\n'}do you have?</Text>
        <Text style={styles.subtitle}>We'll personalize your experience just for them.</Text>
      </View>

      {/* Pet cards */}
      <View style={styles.cards}>
        {/* Dog card */}
        <Animated.View style={{ transform: [{ scale: dogScale }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.card, selected === 'dog' && styles.cardSelected]}
            onPress={() => handleSelect('dog')}
            activeOpacity={0.85}
          >
            <Text style={styles.petEmoji}>🐶</Text>
            <Text style={[styles.petLabel, selected === 'dog' && styles.petLabelSelected]}>
              Dog
            </Text>
            <Text style={styles.petNote}>Fresh custom{'\n'}meal bowls</Text>
            {selected === 'dog' && (
              <View style={styles.checkBadge}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Cat card */}
        <Animated.View style={{ transform: [{ scale: catScale }], flex: 1 }}>
          <TouchableOpacity
            style={[styles.card, selected === 'cat' && styles.cardSelectedCat]}
            onPress={() => handleSelect('cat')}
            activeOpacity={0.85}
          >
            <Text style={styles.petEmoji}>🐱</Text>
            <Text style={[styles.petLabel, selected === 'cat' && styles.petLabelSelectedCat]}>
              Cat
            </Text>
            <Text style={styles.petNote}>Coming{'\n'}soon</Text>
            {selected === 'cat' && (
              <View style={[styles.checkBadge, { backgroundColor: COLORS.amber }]}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Multiple pets note */}
      <Text style={styles.multiNote}>Have both? You can add more pets later.</Text>

      {/* Continue button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, !selected && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>
            {selected === 'cat' ? "Join Waitlist →" : selected === 'dog' ? "Continue →" : "Select a pet to continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: SPACING.xl * 1.5,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  cards: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 2.5,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    alignItems: 'center',
    ...shadow(2),
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0fdfa',
  },
  cardSelectedCat: {
    borderColor: COLORS.amber,
    backgroundColor: '#fffbeb',
  },
  petEmoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  petLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  petLabelSelected: {
    color: COLORS.primary,
  },
  petLabelSelectedCat: {
    color: COLORS.amber,
  },
  petNote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: FONTS.weights.bold,
  },
  multiNote: {
    textAlign: 'center',
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  btn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    alignItems: 'center',
    ...shadow(3),
  },
  btnDisabled: {
    backgroundColor: COLORS.border,
  },
  btnText: {
    color: '#fff',
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
  },
})
