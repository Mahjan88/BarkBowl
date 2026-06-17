import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { useCart } from '../context/CartContext'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../lib/theme'

const MEAL_EMOJIS = {
  'Chicken & Rice Comfort Bowl':   '🍗',
  'Beef Power Bowl':               '🥩',
  'Turkey Sensitive Stomach Bowl': '🦃',
  'Salmon Skin & Coat Bowl':       '🐟',
  'Puppy Growth Bowl':             '🐾',
  'Senior Wellness Bowl':          '🌿',
  'Low-Calorie Lean Bowl':         '🥦',
}

export default function CartScreen() {
  const router = useRouter()
  const { items, total, count, updateQty, removeItem, clearCart } = useCart()

  const handleCheckout = () => {
    router.push('/checkout')
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={{ fontSize: 24, color: COLORS.textPrimary }}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Cart</Text>
        {count > 0 ? (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add meals or build a custom bowl</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.back()}>
            <Text style={styles.shopBtnText}>Browse Meals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.itemEmoji}>
                  {MEAL_EMOJIS[item.name] || (item.badge === 'Custom' ? '🥣' : '🍲')}
                </Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  {item.badge && (
                    <View style={styles.itemBadge}>
                      <Text style={styles.itemBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                  <Text style={styles.itemPrice}>
                    ${(item.base_price * item.quantity).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.quantity - 1)}
                  >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.quantity + 1)}
                  >
                    <Text style={{ fontSize: 16, color: COLORS.primary }}>＋</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.id)}
                >
                  <Text style={{ fontSize: 18, color: COLORS.error }}>🗑</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
              <Text style={{ fontSize: 20, color: COLORS.white }}>●</Text>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection:    'row',
    alignItems:       'center',
    justifyContent:   'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical:  SPACING.md,
    backgroundColor:  COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    width:  40,
    height: 40,
    alignItems:     'center',
    justifyContent: 'center',
  },
  title: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  clearText: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.error,
    fontWeight: FONTS.weights.semibold,
    width:      40,
    textAlign:  'right',
  },
  list: {
    padding:    SPACING.lg,
    gap:        SPACING.md,
    paddingBottom: SPACING.xl,
  },
  cartItem: {
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.md,
    flexDirection:   'row',
    alignItems:      'center',
    gap:             SPACING.sm,
    ...shadow(2),
  },
  itemEmoji: { fontSize: 32, width: 40, textAlign: 'center' },
  itemInfo: {
    flex:      1,
    marginRight: SPACING.sm,
  },
  itemName: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
    marginBottom: 4,
  },
  itemBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical:  2,
    alignSelf:       'flex-start',
    marginBottom:    4,
  },
  itemBadgeText: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primaryDark,
  },
  itemPrice: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primary,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius:  RADIUS.md,
    padding:       SPACING.xs,
  },
  qtyBtn: {
    width:           28,
    height:          28,
    borderRadius:    14,
    backgroundColor: COLORS.primaryLight,
    alignItems:      'center',
    justifyContent:  'center',
  },
  qtyText: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    minWidth:   20,
    textAlign:  'center',
  },
  removeBtn: {
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: '#fef2f2',
    alignItems:      'center',
    justifyContent:  'center',
  },
  summary: {
    backgroundColor: COLORS.card,
    padding:         SPACING.lg,
    borderTopWidth:  1,
    borderTopColor:  COLORS.border,
  },
  summaryRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginBottom:   SPACING.sm,
  },
  summaryLabel: {
    fontSize: FONTS.sizes.md,
    color:    COLORS.textSecondary,
  },
  summaryValue: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
  },
  totalRow: {
    borderTopWidth:  1,
    borderTopColor:  COLORS.border,
    paddingTop:      SPACING.md,
    marginTop:       SPACING.xs,
    marginBottom:    SPACING.lg,
  },
  totalLabel: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  totalValue: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color:      COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 14,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
    ...shadow(2),
  },
  checkoutText: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  // Empty state
  empty: {
    flex:        1,
    alignItems:  'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  emptyEmoji: { fontSize: 56, marginBottom: SPACING.md },
  emptyTitle: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySub: {
    fontSize:   FONTS.sizes.md,
    color:      COLORS.textSecondary,
    textAlign:  'center',
    marginBottom: SPACING.xl,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  shopBtnText: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
})
