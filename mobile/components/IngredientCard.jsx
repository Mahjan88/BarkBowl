import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../lib/theme'

const CATEGORY_EMOJIS = {
  'Chicken':          '🐔',
  'Turkey':           '🦃',
  'Beef':             '🥩',
  'Salmon':           '🐟',
  'Lamb':             '🐑',
  'Brown Rice':       '🌾',
  'Sweet Potato':     '🍠',
  'Oats':             '🌿',
  'Quinoa':           '🟡',
  'Carrots':          '🥕',
  'Peas':             '🫛',
  'Pumpkin':          '🎃',
  'Spinach':          '🥬',
  'Green Beans':      '🫘',
  'Fish Oil':         '💊',
  'Probiotics':       '🦠',
  'Joint Support':    '🦴',
  'Skin & Coat Blend':'✨',
  'Immune Boost':     '🛡️',
}

export default function IngredientCard({ ingredient, selected, onSelect }) {
  const emoji = CATEGORY_EMOJIS[ingredient.name] || '🥗'

  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.8}
    >
      {selected && (
        <View style={styles.checkmark}>
          <Ionicons name="checkmark" size={14} color={COLORS.white} />
        </View>
      )}

      {ingredient.is_premium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>★</Text>
        </View>
      )}

      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.name}>{ingredient.name}</Text>
      <Text style={styles.desc} numberOfLines={2}>{ingredient.description}</Text>

      <View style={styles.footer}>
        <Text style={styles.cal}>{ingredient.calories_per_oz} kcal/oz</Text>
        {ingredient.price_modifier > 0 && (
          <Text style={styles.price}>+${ingredient.price_modifier.toFixed(2)}</Text>
        )}
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
    borderWidth:     2,
    borderColor:     COLORS.border,
    position:        'relative',
    ...shadow(1),
  },
  cardSelected: {
    borderColor:     COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  checkmark: {
    position:        'absolute',
    top:             10,
    right:           10,
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: COLORS.primary,
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          1,
  },
  premiumBadge: {
    position:        'absolute',
    top:             10,
    left:            10,
    backgroundColor: COLORS.amber,
    borderRadius:    RADIUS.full,
    width:           20,
    height:          20,
    alignItems:      'center',
    justifyContent:  'center',
  },
  premiumText: {
    fontSize: 10,
    color:    COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  emoji: {
    fontSize:     30,
    marginBottom: SPACING.xs,
    marginTop:    2,
  },
  name: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  desc: {
    fontSize:   FONTS.sizes.xs,
    color:      COLORS.textSecondary,
    lineHeight: 16,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginTop:      'auto',
  },
  cal: {
    fontSize:  FONTS.sizes.xs,
    color:     COLORS.textSecondary,
  },
  price: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.amber,
  },
})
