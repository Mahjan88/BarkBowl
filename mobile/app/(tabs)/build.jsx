import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { mockApi } from '../../lib/mockApi'
import { useCart } from '../../context/CartContext'
import IngredientCard from '../../components/IngredientCard'
import NutritionBadge from '../../components/NutritionBadge'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

const STEP_INFO = [
  { key: 'protein',   label: 'Choose Protein',   emoji: '🥩', hint: 'The main protein source' },
  { key: 'base',      label: 'Choose Base',       emoji: '🌾', hint: 'Carbs & sustained energy' },
  { key: 'vegetable', label: 'Add Vegetables',    emoji: '🥦', hint: 'Vitamins & fiber' },
  { key: 'booster',   label: 'Add a Booster',     emoji: '✨', hint: 'Health supplement' },
  { key: 'portion',   label: 'Set Portion',       emoji: '⚖️',  hint: 'Daily serving size' },
  { key: 'review',    label: 'Review Your Bowl',  emoji: '🥣', hint: 'Almost done!' },
]

const PORTIONS = [
  { id: 'small',  label: 'Small',  sub: 'Up to 25 lbs',   multiplier: 0.75 },
  { id: 'medium', label: 'Medium', sub: '25–60 lbs',       multiplier: 1.0 },
  { id: 'large',  label: 'Large',  sub: '60–90 lbs',       multiplier: 1.25 },
  { id: 'xl',     label: 'XL',     sub: '90+ lbs',         multiplier: 1.5 },
]

function calcNutrition(selections) {
  const all = Object.values(selections).filter(Boolean)
  if (all.length === 0) return { protein: 0, fat: 0, fiber: 0, score: 0 }
  const protein = all.reduce((s, i) => s + (i.protein_g || 0), 0)
  const fat     = all.reduce((s, i) => s + (i.fat_g    || 0), 0)
  const fiber   = all.reduce((s, i) => s + (i.fiber_g  || 0), 0)
  // Rough nutrition score out of 100
  const score = Math.min(100, Math.round(
    (protein * 3 + fiber * 5 - fat * 0.5) * 2
  ))
  return { protein: protein.toFixed(1), fat: fat.toFixed(1), fiber: fiber.toFixed(1), score: Math.max(0, score) }
}

function calcPrice(selections) {
  const base = 14.99
  const modifiers = Object.values(selections)
    .filter(Boolean)
    .reduce((s, i) => s + (i.price_modifier || 0), 0)
  return (base + modifiers).toFixed(2)
}

export default function BuildScreen() {
  const router = useRouter()
  const { addItem } = useCart()

  const [step, setStep]             = useState(0)
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [selections, setSelections] = useState({
    protein: null, base: null, vegetable: null, booster: null,
  })
  const [portion, setPortion] = useState('medium')

  useEffect(() => {
    mockApi.get('/ingredients')
      .then(setCategories)
      .finally(() => setLoading(false))
  }, [])

  const currentStep = STEP_INFO[step]
  const progress    = step / (STEP_INFO.length - 1)

  const getCategoryIngredients = (key) => {
    const cat = categories.find(c => c.name === key)
    return cat ? cat.ingredients : []
  }

  const handleSelect = (key, ingredient) => {
    setSelections(prev => ({ ...prev, [key]: ingredient }))
  }

  const handleNext = () => {
    if (step < STEP_INFO.length - 1) setStep(s => s + 1)
  }
  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const canNext = () => {
    if (step === 0) return !!selections.protein
    if (step === 1) return !!selections.base
    if (step === 2) return !!selections.vegetable
    if (step === 3) return true // booster optional
    if (step === 4) return !!portion
    return true
  }

  const handleAddToCart = () => {
    const nutrition = calcNutrition(selections)
    const price     = parseFloat(calcPrice(selections))
    const bowl = {
      id:         `custom-bowl-${Date.now()}`,
      name:       `Custom Bowl (${selections.protein?.name || 'Mixed'})`,
      base_price: price,
      calories:   Math.round(nutrition.protein * 10 + nutrition.fat * 12),
      protein_pct: Math.round(nutrition.protein * 5),
      fat_pct:    Math.round(nutrition.fat * 3),
      fiber_pct:  Math.round(nutrition.fiber * 4),
      badge:      'Custom',
      ingredients: Object.values(selections).filter(Boolean).map(i => i.name),
    }
    addItem(bowl)
    router.push('/cart')
  }

  const nutrition = calcNutrition(selections)
  const price     = calcPrice(selections)

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 80 }} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {step > 0 ? (
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Text style={{ fontSize: 22, color: COLORS.white }}>←</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
          <Text style={styles.headerTitle}>Build a Bowl</Text>
          <TouchableOpacity onPress={() => router.push('/cart')} style={styles.cartBtn}>
            <Text style={{ fontSize: 22, color: COLORS.white }}>🛒</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {step + 1} of {STEP_INFO.length}
        </Text>
      </View>

      {/* Step Content */}
      <View style={styles.content}>
        {/* Step Header */}
        <View style={styles.stepHeader}>
          <Text style={styles.stepEmoji}>{currentStep.emoji}</Text>
          <Text style={styles.stepLabel}>{currentStep.label}</Text>
          <Text style={styles.stepHint}>{currentStep.hint}</Text>
        </View>

        {/* Step 0-3: Ingredient grids */}
        {step <= 3 && (() => {
          const key = currentStep.key
          const ings = getCategoryIngredients(key)
          const selectedIng = selections[key]
          return (
            <FlatList
              data={ings}
              keyExtractor={i => i.id}
              numColumns={2}
              contentContainerStyle={styles.ingGrid}
              columnWrapperStyle={styles.ingRow}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                <TouchableOpacity
                  style={[styles.nextBtn, !canNext() && styles.nextBtnDisabled]}
                  onPress={handleNext}
                  disabled={!canNext()}
                >
                  <Text style={styles.nextBtnText}>
                    {step === 3 ? (selectedIng ? 'Next' : 'Skip & Continue') : 'Next'}
                  </Text>
                  <Text style={{ fontSize: 18, color: COLORS.white }}>→</Text>
                </TouchableOpacity>
              }
              renderItem={({ item }) => (
                <IngredientCard
                  ingredient={item}
                  selected={selectedIng?.id === item.id}
                  onSelect={() => handleSelect(key, item)}
                />
              )}
            />
          )
        })()}

        {/* Step 4: Portion */}
        {step === 4 && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.portionGrid}>
              {PORTIONS.map(p => (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.portionCard, portion === p.id && styles.portionCardSelected]}
                  onPress={() => setPortion(p.id)}
                >
                  {portion === p.id && (
                    <View style={styles.portionCheck}>
                      <Text style={{ fontSize: 14, color: COLORS.white }}>✓</Text>
                    </View>
                  )}
                  <Text style={styles.portionLabel}>{p.label}</Text>
                  <Text style={styles.portionSub}>{p.sub}</Text>
                  <Text style={styles.portionMulti}>{p.multiplier}x serving</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
              <Text style={{ fontSize: 18, color: COLORS.white }}>→</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Summary */}
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Your Custom Bowl</Text>
              {['protein', 'base', 'vegetable', 'booster'].map(key => {
                const item = selections[key]
                if (!item) return (
                  <View key={key} style={styles.reviewRow}>
                    <Text style={styles.reviewKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <Text style={styles.reviewValMuted}>Not selected</Text>
                  </View>
                )
                return (
                  <View key={key} style={styles.reviewRow}>
                    <Text style={styles.reviewKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                    <Text style={styles.reviewVal}>{item.name}</Text>
                    {item.price_modifier > 0 && (
                      <Text style={styles.reviewMod}>+${item.price_modifier.toFixed(2)}</Text>
                    )}
                  </View>
                )
              })}
              <View style={styles.reviewRow}>
                <Text style={styles.reviewKey}>Portion</Text>
                <Text style={styles.reviewVal}>{PORTIONS.find(p => p.id === portion)?.label}</Text>
              </View>
              <View style={[styles.reviewRow, styles.reviewTotal]}>
                <Text style={styles.reviewTotalLabel}>Total</Text>
                <Text style={styles.reviewTotalPrice}>${price}</Text>
              </View>
            </View>

            {/* Nutrition Score */}
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionTitle}>Nutrition</Text>
              <View style={styles.scoreMeter}>
                <View style={styles.scoreTrack}>
                  <View style={[styles.scoreFill, { width: `${nutrition.score}%` }]} />
                </View>
                <Text style={styles.scoreLabel}>{nutrition.score}/100</Text>
              </View>
              <View style={styles.macroRow}>
                <NutritionBadge label="Protein" value={`${nutrition.protein}g`} color={COLORS.primary} />
                <NutritionBadge label="Fat"     value={`${nutrition.fat}g`}     color={COLORS.amber} />
                <NutritionBadge label="Fiber"   value={`${nutrition.fiber}g`}   color={COLORS.success} />
              </View>
            </View>

            <TouchableOpacity style={styles.addCartBtn} onPress={handleAddToCart}>
              <Text style={{ fontSize: 20, color: COLORS.white }}>🛒</Text>
              <Text style={styles.addCartText}>Add to Cart — ${price}</Text>
            </TouchableOpacity>
            <View style={{ height: 32 }} />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop:        SPACING.md,
    paddingBottom:     SPACING.lg,
  },
  headerTop: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   SPACING.md,
  },
  backBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  headerTitle: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  cartBtn: {
    width:           40,
    height:          40,
    borderRadius:    20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  progressTrack: {
    height:          6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius:    3,
    marginBottom:    SPACING.xs,
  },
  progressFill: {
    height:          6,
    backgroundColor: COLORS.white,
    borderRadius:    3,
  },
  progressText: {
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.primaryLight,
    textAlign: 'right',
  },
  content: {
    flex:                1,
    backgroundColor:     COLORS.background,
    borderTopLeftRadius:  RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  stepHeader: {
    alignItems:       'center',
    paddingTop:       SPACING.xl,
    paddingBottom:    SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  stepEmoji: {
    fontSize:     40,
    marginBottom: SPACING.xs,
  },
  stepLabel: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  stepHint: {
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.textSecondary,
    marginTop: 4,
  },
  ingGrid: {
    paddingHorizontal: SPACING.lg,
    paddingBottom:     SPACING.xxxl,
  },
  ingRow: {
    gap:          SPACING.md,
    marginBottom: SPACING.md,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 14,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    marginTop:       SPACING.md,
    ...shadow(2),
  },
  nextBtnDisabled: {
    opacity: 0.5,
  },
  nextBtnText: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  portionGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    paddingHorizontal: SPACING.lg,
    gap:           SPACING.md,
    paddingTop:    SPACING.sm,
  },
  portionCard: {
    width:           '47%',
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.lg,
    borderWidth:     2,
    borderColor:     COLORS.border,
    position:        'relative',
    ...shadow(1),
  },
  portionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  portionCheck: {
    position:        'absolute',
    top:             10,
    right:           10,
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  portionLabel: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  portionSub: {
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.textSecondary,
  },
  portionMulti: {
    fontSize:   FONTS.sizes.xs,
    color:      COLORS.primary,
    fontWeight: FONTS.weights.semibold,
    marginTop:  SPACING.xs,
  },
  reviewCard: {
    backgroundColor:  COLORS.card,
    marginHorizontal: SPACING.lg,
    marginTop:        SPACING.sm,
    borderRadius:     RADIUS.lg,
    padding:          SPACING.lg,
    ...shadow(2),
  },
  reviewTitle: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  reviewRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  reviewKey: {
    width:      90,
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },
  reviewVal: {
    flex:       1,
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.textPrimary,
    fontWeight: FONTS.weights.semibold,
  },
  reviewValMuted: {
    flex:      1,
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.textSecondary,
    fontStyle: 'italic',
  },
  reviewMod: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.amber,
    fontWeight: FONTS.weights.semibold,
  },
  reviewTotal: {
    borderBottomWidth: 0,
    paddingTop:        SPACING.md,
  },
  reviewTotalLabel: {
    flex:       1,
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  reviewTotalPrice: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color:      COLORS.primary,
  },
  nutritionCard: {
    backgroundColor:  COLORS.card,
    marginHorizontal: SPACING.lg,
    marginTop:        SPACING.md,
    borderRadius:     RADIUS.lg,
    padding:          SPACING.lg,
    ...shadow(1),
  },
  nutritionTitle: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  scoreMeter: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.md,
    marginBottom:  SPACING.md,
  },
  scoreTrack: {
    flex:            1,
    height:          10,
    backgroundColor: COLORS.border,
    borderRadius:    5,
    overflow:        'hidden',
  },
  scoreFill: {
    height:          10,
    backgroundColor: COLORS.primary,
    borderRadius:    5,
  },
  scoreLabel: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primary,
    minWidth:   50,
  },
  macroRow: {
    flexDirection: 'row',
    gap:           SPACING.md,
  },
  addCartBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 14,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop:       SPACING.lg,
    ...shadow(2),
  },
  addCartText: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
})
