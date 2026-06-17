import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { mockApi } from '../lib/mockApi'
import { useCart } from '../context/CartContext'
import { MOCK_DOGS } from '../lib/mockData'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../lib/theme'

const SUBSCRIPTION_OPTIONS = [
  { id: null,     label: 'One-time',    sub: 'No commitment',        discount: 0 },
  { id: 'weekly', label: 'Weekly',      sub: 'Save 10% every order', discount: 0.1 },
  { id: 'bi-weekly', label: 'Bi-Weekly', sub: 'Save 8% every order', discount: 0.08 },
  { id: 'monthly',label: 'Monthly',     sub: 'Save 5% every order',  discount: 0.05 },
]

export default function CheckoutScreen() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()

  const [address,       setAddress]       = useState('123 Paw Lane, San Francisco, CA 94105')
  const [notes,         setNotes]         = useState('')
  const [subscription,  setSubscription]  = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [success,       setSuccess]       = useState(false)
  const [orderId,       setOrderId]       = useState(null)

  const dog = MOCK_DOGS[0]

  const subOption  = SUBSCRIPTION_OPTIONS.find(s => s.id === subscription)
  const discount   = subOption?.discount || 0
  const finalTotal = total * (1 - discount)

  const handlePlaceOrder = async () => {
    if (!address.trim()) return
    setLoading(true)
    try {
      const order = await mockApi.post('/orders', {
        dog_id:            dog?.id,
        total_amount:      parseFloat(finalTotal.toFixed(2)),
        delivery_address:  address.trim(),
        subscription_type: subscription,
        notes:             notes.trim(),
        items:             items.map(i => ({
          meal_id:    i.id,
          quantity:   i.quantity,
          unit_price: i.base_price,
          item_name:  i.name,
        })),
      })
      setOrderId(order.id)
      clearCart()
      setSuccess(true)
    } catch (e) {
      console.warn(e)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Order Placed!</Text>
          <Text style={styles.successSub}>
            Your fresh bowl is being prepared for {dog?.name || 'your pup'}.
          </Text>
          {orderId && (
            <View style={styles.orderIdBox}>
              <Text style={styles.orderIdLabel}>Order ID</Text>
              <Text style={styles.orderIdText}>#{orderId.slice(-10).toUpperCase()}</Text>
            </View>
          )}
          <TouchableOpacity style={styles.trackBtn} onPress={() => { router.replace('/(tabs)/orders') }}>
            <Text style={styles.trackBtnText}>Track Order</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={() => { router.replace('/(tabs)') }}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ fontSize: 22, color: COLORS.textPrimary }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Delivery */}
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter delivery address"
            placeholderTextColor={COLORS.textSecondary}
            multiline
          />

          {/* Notes */}
          <Text style={styles.sectionTitle}>Delivery Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. Leave at the door"
            placeholderTextColor={COLORS.textSecondary}
            multiline
          />

          {/* Subscription */}
          <Text style={styles.sectionTitle}>Delivery Frequency</Text>
          {SUBSCRIPTION_OPTIONS.map(opt => (
            <TouchableOpacity
              key={String(opt.id)}
              style={[styles.subOption, subscription === opt.id && styles.subOptionActive]}
              onPress={() => setSubscription(opt.id)}
            >
              <View style={[styles.subRadio, subscription === opt.id && styles.subRadioActive]}>
                {subscription === opt.id && <View style={styles.subRadioInner} />}
              </View>
              <View style={styles.subOptionInfo}>
                <Text style={[styles.subLabel, subscription === opt.id && styles.subLabelActive]}>
                  {opt.label}
                </Text>
                <Text style={styles.subSub}>{opt.sub}</Text>
              </View>
              {opt.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{Math.round(opt.discount * 100)}%</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Order Summary */}
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            {items.map(item => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.summaryItemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.summaryItemQty}>x{item.quantity}</Text>
                <Text style={styles.summaryItemPrice}>
                  ${(item.base_price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.summaryDivider} />
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: COLORS.success }]}>
                  -{Math.round(discount * 100)}%
                </Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, { color: COLORS.success }]}>Free</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Place Order */}
        <View style={styles.placeOrderContainer}>
          <TouchableOpacity
            style={[styles.placeOrderBtn, loading && { opacity: 0.6 }]}
            onPress={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={{ fontSize: 22, color: COLORS.white }}>✅</Text>
                <Text style={styles.placeOrderText}>
                  Place Order — ${finalTotal.toFixed(2)}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  flex: { flex: 1 },
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
  backBtn: {
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
  scroll: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop:  SPACING.lg,
  },
  input: {
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    borderRadius:    RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize:        FONTS.sizes.md,
    color:           COLORS.textPrimary,
    backgroundColor: COLORS.card,
    marginBottom:    SPACING.sm,
  },
  addressInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  notesInput: {
    minHeight: 50,
    textAlignVertical: 'top',
  },
  // Subscription
  subOption: {
    flexDirection:   'row',
    alignItems:      'center',
    padding:         SPACING.md,
    borderRadius:    RADIUS.md,
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    backgroundColor: COLORS.card,
    marginBottom:    SPACING.sm,
  },
  subOptionActive: {
    borderColor:     COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  subRadio: {
    width:           20,
    height:          20,
    borderRadius:    10,
    borderWidth:     2,
    borderColor:     COLORS.border,
    alignItems:      'center',
    justifyContent:  'center',
    marginRight:     SPACING.md,
  },
  subRadioActive: { borderColor: COLORS.primary },
  subRadioInner: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: COLORS.primary,
  },
  subOptionInfo: { flex: 1 },
  subLabel: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
  },
  subLabelActive: { color: COLORS.primaryDark },
  subSub: {
    fontSize:  FONTS.sizes.xs,
    color:     COLORS.textSecondary,
    marginTop: 2,
  },
  discountBadge: {
    backgroundColor: COLORS.success,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical:  3,
  },
  discountText: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  // Summary
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.lg,
    ...shadow(1),
  },
  summaryItem: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: SPACING.xs,
  },
  summaryItemName: {
    flex:     1,
    fontSize: FONTS.sizes.sm,
    color:    COLORS.textPrimary,
  },
  summaryItemQty: {
    fontSize:        FONTS.sizes.sm,
    color:           COLORS.textSecondary,
    marginHorizontal: SPACING.md,
  },
  summaryItemPrice: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
  },
  summaryDivider: {
    height:          1,
    backgroundColor: COLORS.border,
    marginVertical:  SPACING.md,
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
    marginBottom:    0,
    marginTop:       SPACING.xs,
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
  // Place Order
  placeOrderContainer: {
    position:         'absolute',
    bottom:           0,
    left:             0,
    right:            0,
    backgroundColor:  COLORS.card,
    padding:          SPACING.lg,
    borderTopWidth:   1,
    borderTopColor:   COLORS.border,
    ...shadow(4),
  },
  placeOrderBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 16,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             SPACING.sm,
  },
  placeOrderText: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  // Success
  successContainer: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    padding:        SPACING.xxxl,
  },
  successEmoji: {
    fontSize:     72,
    marginBottom: SPACING.lg,
  },
  successTitle: {
    fontSize:   FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  successSub: {
    fontSize:   FONTS.sizes.md,
    color:      COLORS.textSecondary,
    textAlign:  'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  orderIdBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.lg,
    alignItems:      'center',
    marginBottom:    SPACING.xl,
    width:           '100%',
  },
  orderIdLabel: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.primaryDark,
    marginBottom: SPACING.xs,
  },
  orderIdText: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color:      COLORS.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  trackBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width:           '100%',
    alignItems:      'center',
    marginBottom:    SPACING.md,
    ...shadow(2),
  },
  trackBtnText: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  homeBtn: {
    paddingVertical:  12,
    paddingHorizontal: 40,
    width:            '100%',
    alignItems:       'center',
    borderRadius:     RADIUS.md,
    borderWidth:      1.5,
    borderColor:      COLORS.border,
  },
  homeBtnText: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textSecondary,
  },
})
