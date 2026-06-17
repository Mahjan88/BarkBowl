import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, FONTS, RADIUS, SPACING } from '../lib/theme'

export default function NutritionBadge({ label, value, color }) {
  const displayColor = color || COLORS.primary

  // If value is a number (0-100), show a bar
  const isPercent = typeof value === 'number'

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: displayColor }]}>{label}</Text>
      {isPercent ? (
        <View style={styles.barTrack}>
          <View
            style={[
              styles.barFill,
              {
                width:           `${Math.min(100, value)}%`,
                backgroundColor: displayColor,
              },
            ]}
          />
        </View>
      ) : null}
      <Text style={[styles.value, { color: displayColor }]}>{value}{isPercent ? '%' : ''}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
  },
  label: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    marginBottom: 4,
    textAlign:  'center',
  },
  barTrack: {
    width:           '100%',
    height:          6,
    backgroundColor: COLORS.border,
    borderRadius:    3,
    overflow:        'hidden',
    marginBottom:    4,
  },
  barFill: {
    height:       6,
    borderRadius: 3,
  },
  value: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    textAlign:  'center',
  },
})
