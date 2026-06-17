import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { mockApi } from '../../lib/mockApi'
import { useCart } from '../../context/CartContext'
import MealCard from '../../components/MealCard'
import NutritionBadge from '../../components/NutritionBadge'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

const MEAL_EMOJIS = {
  'Chicken & Rice Comfort Bowl':    '🍗',
  'Beef Power Bowl':                '🥩',
  'Turkey Sensitive Stomach Bowl':  '🦃',
  'Salmon Skin & Coat Bowl':        '🐟',
  'Puppy Growth Bowl':              '🐾',
  'Senior Wellness Bowl':           '🌿',
  'Low-Calorie Lean Bowl':          '🥦',
}

const FILTERS = ['All', 'Popular', 'High Protein', 'Vet Approved', 'Premium', 'Senior', 'Puppy', 'Weight Control']

export default function MealsScreen() {
  const { addItem, items: cartItems } = useCart()
  const [meals, setMeals]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    mockApi.get('/meals')
      .then(setMeals)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All'
    ? meals
    : meals.filter(m => m.badge === filter)

  const isInCart = (id) => cartItems.some(i => i.id === id)

  const handleAdd = useCallback((meal) => {
    addItem(meal)
    setSelected(null)
  }, [addItem])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pre-Made Meals</Text>
        <Text style={styles.subtitle}>{filtered.length} bowls available</Text>
      </View>

      {/* Filter Chips */}
      <FlatList
        data={FILTERS}
        keyExtractor={f => f}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        renderItem={({ item: f }) => (
          <TouchableOpacity
            style={[styles.chip, filter === f && styles.chipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Meal Grid */}
      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <MealCard
              meal={item}
              emoji={MEAL_EMOJIS[item.name] || '🍲'}
              inCart={isInCart(item.id)}
              onPress={() => setSelected(item)}
              onAdd={() => addItem(item)}
            />
          )}
        />
      )}

      {/* Bottom Sheet Modal */}
      <Modal
        visible={!!selected}
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSelected(null)} />
        <View style={styles.sheet}>
          {selected && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.sheetHandle} />

              <Text style={styles.sheetEmoji}>{MEAL_EMOJIS[selected.name] || '🍲'}</Text>

              {selected.badge && (
                <View style={styles.sheetBadge}>
                  <Text style={styles.sheetBadgeText}>{selected.badge}</Text>
                </View>
              )}

              <Text style={styles.sheetName}>{selected.name}</Text>
              <Text style={styles.sheetTagline}>{selected.tagline}</Text>
              <Text style={styles.sheetDesc}>{selected.description}</Text>

              <Text style={styles.sheetSectionTitle}>Best for</Text>
              <Text style={styles.sheetBestFor}>{selected.best_for}</Text>

              <Text style={styles.sheetSectionTitle}>Nutrition</Text>
              <View style={styles.nutritionRow}>
                <NutritionBadge label="Protein" value={selected.protein_pct} color={COLORS.primary} />
                <NutritionBadge label="Fat" value={selected.fat_pct} color={COLORS.amber} />
                <NutritionBadge label="Fiber" value={selected.fiber_pct} color={COLORS.success} />
              </View>
              <Text style={styles.calText}>{selected.calories} kcal per serving</Text>

              <Text style={styles.sheetSectionTitle}>Ingredients</Text>
              <View style={styles.ingRow}>
                {(selected.ingredients || []).map((ing, i) => (
                  <View key={i} style={styles.ingChip}>
                    <Text style={styles.ingText}>{ing}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.addToCartBtn}
                onPress={() => handleAdd(selected)}
              >
                <Text style={{ fontSize: 20, color: COLORS.white }}>🛒</Text>
                <Text style={styles.addToCartText}>
                  Add to Cart — ${selected.base_price.toFixed(2)}
                </Text>
              </TouchableOpacity>
              <View style={{ height: 24 }} />
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop:        SPACING.lg,
    paddingBottom:     SPACING.sm,
  },
  title: {
    fontSize:   FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  subtitle: {
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.textSecondary,
    marginTop: 2,
  },
  filterList: {
    paddingHorizontal: SPACING.lg,
    paddingVertical:   SPACING.sm,
    gap:               SPACING.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical:   7,
    borderRadius:      RADIUS.full,
    borderWidth:       1.5,
    borderColor:       COLORS.border,
    backgroundColor:   COLORS.card,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor:     COLORS.primary,
  },
  chipText: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color:      COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: FONTS.weights.semibold,
  },
  grid: {
    paddingHorizontal: SPACING.lg,
    paddingTop:        SPACING.sm,
    paddingBottom:     SPACING.xxxl,
  },
  columnWrapper: {
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  // Modal / Bottom Sheet
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor:     COLORS.card,
    borderTopLeftRadius:  RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight:            '85%',
    padding:              SPACING.xl,
  },
  sheetHandle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: COLORS.border,
    alignSelf:       'center',
    marginBottom:    SPACING.lg,
  },
  sheetEmoji: {
    fontSize:     52,
    textAlign:    'center',
    marginBottom: SPACING.md,
  },
  sheetBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical:  4,
    alignSelf:       'center',
    marginBottom:    SPACING.md,
  },
  sheetBadgeText: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primaryDark,
  },
  sheetName: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    textAlign:  'center',
    marginBottom: SPACING.xs,
  },
  sheetTagline: {
    fontSize:   FONTS.sizes.md,
    color:      COLORS.textSecondary,
    textAlign:  'center',
    fontStyle:  'italic',
    marginBottom: SPACING.md,
  },
  sheetDesc: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  sheetSectionTitle: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  sheetBestFor: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  nutritionRow: {
    flexDirection: 'row',
    gap:           SPACING.md,
    marginBottom:  SPACING.sm,
  },
  calText: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  ingRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           SPACING.sm,
    marginBottom:  SPACING.xl,
  },
  ingChip: {
    backgroundColor: COLORS.barkLight,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical:  4,
  },
  ingText: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.textPrimary,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 14,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    ...shadow(2),
  },
  addToCartText: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
})
