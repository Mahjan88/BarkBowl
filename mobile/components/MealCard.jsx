import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../lib/theme'

export default function MealCard({ meal, emoji, inCart, onPress, onAdd }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Text style={styles.emoji}>{emoji || '🍲'}</Text>

      {meal.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{meal.badge}</Text>
        </View>
      )}

      <Text style={styles.name} numberOfLines={2}>{meal.name}</Text>

      <View style={styles.calRow}>
        <Ionicons name="flame-outline" size={12} color={COLORS.amber} />
        <Text style={styles.cal}>{meal.calories} kcal</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.price}>${meal.base_price.toFixed(2)}</Text>
        <TouchableOpacity
          style={[styles.addBtn, inCart && styles.addBtnInCart]}
          onPress={e => { e.stopPropagation(); onAdd() }}
        >
          <Ionicons
            name={inCart ? 'checkmark' : 'add'}
            size={18}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex:            1,
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.md,
    ...shadow(2),
  },
  emoji: {
    fontSize:     36,
    marginBottom: SPACING.xs,
  },
  badge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical:  3,
    alignSelf:       'flex-start',
    marginBottom:    SPACING.xs,
  },
  badgeText: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primaryDark,
  },
  name: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
    minHeight:  38,
    marginBottom: SPACING.xs,
  },
  calRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           3,
    marginBottom:  SPACING.sm,
  },
  cal: {
    fontSize: FONTS.sizes.xs,
    color:    COLORS.textSecondary,
  },
  footer: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginTop:      'auto',
  },
  price: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.extrabold,
    color:      COLORS.primary,
  },
  addBtn: {
    width:           30,
    height:          30,
    borderRadius:    15,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  addBtnInCart: {
    backgroundColor: COLORS.success,
  },
})
