import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { mockApi } from '../../lib/mockApi'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

const ACTIVITY_LEVELS = [
  { value: 'low',      label: 'Low',      emoji: '😴' },
  { value: 'moderate', label: 'Moderate', emoji: '🚶' },
  { value: 'high',     label: 'High',     emoji: '🏃' },
  { value: 'very_high',label: 'Very High',emoji: '⚡' },
]

export default function DogSetupScreen() {
  const { completeOnboarding } = useAuth()
  const router = useRouter()

  const [name,          setName]          = useState('')
  const [breed,         setBreed]         = useState('')
  const [age,           setAge]           = useState('')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')

  const handleGetStarted = async () => {
    if (!name.trim()) return setError('Please enter your dog\'s name')
    setError('')
    setSaving(true)

    try {
      await mockApi.post('/dogs', {
        name:           name.trim(),
        breed:          breed.trim() || null,
        age_years:      age ? parseFloat(age) : null,
        activity_level: activityLevel,
        allergies:      [],
        health_goals:   [],
      })
      completeOnboarding('dog')
      router.replace('/(tabs)')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🐶</Text>
            <Text style={styles.title}>Tell us about{'\n'}your dog!</Text>
            <Text style={styles.subtitle}>We'll use this to recommend the perfect meals.</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Dog's Name <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bella, Max, Luna…"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* Breed */}
            <View style={styles.field}>
              <Text style={styles.label}>Breed <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Golden Retriever, Poodle…"
                placeholderTextColor={COLORS.textSecondary}
                value={breed}
                onChangeText={setBreed}
                autoCapitalize="words"
              />
            </View>

            {/* Age */}
            <View style={styles.field}>
              <Text style={styles.label}>Age <Text style={styles.optional}>(optional)</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 3"
                placeholderTextColor={COLORS.textSecondary}
                value={age}
                onChangeText={setAge}
                keyboardType="decimal-pad"
              />
              <Text style={styles.inputNote}>in years</Text>
            </View>

            {/* Activity level */}
            <View style={styles.field}>
              <Text style={styles.label}>Activity Level</Text>
              <View style={styles.activityGrid}>
                {ACTIVITY_LEVELS.map(lvl => (
                  <TouchableOpacity
                    key={lvl.value}
                    style={[
                      styles.activityBtn,
                      activityLevel === lvl.value && styles.activityBtnSelected,
                    ]}
                    onPress={() => setActivityLevel(lvl.value)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.activityEmoji}>{lvl.emoji}</Text>
                    <Text style={[
                      styles.activityLabel,
                      activityLevel === lvl.value && styles.activityLabelSelected,
                    ]}>
                      {lvl.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          {/* Spacer for fixed button */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, (!name.trim() || saving) && styles.btnDisabled]}
          onPress={handleGetStarted}
          disabled={!name.trim() || saving}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>
            {saving ? 'Setting up…' : `Let's go, ${name.trim() || 'pup'}! 🐾`}
          </Text>
        </TouchableOpacity>
        <Text style={styles.skipNote}>
          You can update this anytime in Profile
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backBtn: {
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  backText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  emoji: {
    fontSize: 52,
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
  form: {
    gap: SPACING.lg,
  },
  field: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textPrimary,
  },
  required: {
    color: COLORS.error || '#ef4444',
  },
  optional: {
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.normal,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  inputNote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityGrid: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  activityBtn: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    gap: 4,
  },
  activityBtnSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#f0fdfa',
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityLabel: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.medium,
    color: COLORS.textSecondary,
  },
  activityLabelSelected: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
  },
  error: {
    color: '#ef4444',
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: SPACING.xl,
    left: SPACING.lg,
    right: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  btn: {
    width: '100%',
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
  skipNote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
})
