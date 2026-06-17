import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { mockApi } from '../../lib/mockApi'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const STATUS_CONFIG = {
  confirmed:        { label: 'Confirmed',        color: COLORS.primary,   emoji: '✅', step: 1 },
  preparing:        { label: 'Preparing',         color: COLORS.amber,     emoji: '🍲', step: 2 },
  out_for_delivery: { label: 'Out for Delivery',  color: COLORS.amber,     emoji: '🚚', step: 3 },
  delivered:        { label: 'Delivered',         color: COLORS.success,   emoji: '🏠', step: 4 },
  cancelled:        { label: 'Cancelled',         color: COLORS.error,     emoji: '✕',  step: 0 },
}

const TRACKING_STEPS = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered']

function TrackingBar({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed
  const currentStep = config.step

  if (status === 'cancelled') return (
    <View style={styles.cancelledRow}>
      <Text style={{ fontSize: 16, color: COLORS.error }}>✕</Text>
      <Text style={styles.cancelledText}>Order Cancelled</Text>
    </View>
  )

  return (
    <View style={styles.trackingContainer}>
      <View style={styles.trackingBar}>
        {TRACKING_STEPS.map((label, idx) => {
          const stepNum = idx + 1
          const done    = stepNum <= currentStep
          const active  = stepNum === currentStep
          return (
            <React.Fragment key={label}>
              <View style={styles.trackingStep}>
                <View style={[
                  styles.trackingDot,
                  done   && styles.trackingDotDone,
                  active && styles.trackingDotActive,
                ]}>
                  {done && <Text style={{ fontSize: 10, color: COLORS.white }}>✓</Text>}
                </View>
                <Text style={[
                  styles.trackingStepLabel,
                  done && styles.trackingStepLabelDone,
                ]} numberOfLines={2}>
                  {label}
                </Text>
              </View>
              {idx < TRACKING_STEPS.length - 1 && (
                <View style={[styles.trackingLine, stepNum < currentStep && styles.trackingLineDone]} />
              )}
            </React.Fragment>
          )
        })}
      </View>
    </View>
  )
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpanded(e => !e)
  }

  const date = new Date(order.created_at)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <View style={styles.orderCard}>
      <TouchableOpacity style={styles.orderHeader} onPress={toggle}>
        <View style={styles.orderHeaderLeft}>
          <View style={[styles.statusIcon, { backgroundColor: config.color + '20' }]}>
            <Text style={{ fontSize: 20, color: config.color }}>{config.emoji}</Text>
          </View>
          <View>
            <Text style={styles.orderId} numberOfLines={1}>
              #{order.id.slice(-8).toUpperCase()}
            </Text>
            <Text style={styles.orderDate}>{dateStr}</Text>
          </View>
        </View>
        <View style={styles.orderHeaderRight}>
          <Text style={styles.orderTotal}>${order.total_amount.toFixed(2)}</Text>
          <Text style={{ fontSize: 20, color: COLORS.textSecondary }}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.orderStatusRow}>
        <View style={[styles.statusBadge, { backgroundColor: config.color + '18' }]}>
          <Text style={[styles.statusBadgeText, { color: config.color }]}>{config.label}</Text>
        </View>
        {order.subscription_type && (
          <View style={styles.subBadge}>
            <Text style={{ fontSize: 12, color: COLORS.primary }}>●</Text>
            <Text style={styles.subBadgeText}>
              {order.subscription_type.charAt(0).toUpperCase() + order.subscription_type.slice(1)}
            </Text>
          </View>
        )}
      </View>

      {expanded && (
        <View style={styles.orderExpanded}>
          {/* Tracking */}
          <TrackingBar status={order.status} />

          {/* Items */}
          <Text style={styles.itemsTitle}>Items</Text>
          {order.order_items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.item_name}</Text>
              <Text style={styles.itemQty}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>${(item.unit_price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}

          {/* Delivery */}
          <View style={styles.deliveryRow}>
            <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>●</Text>
            <Text style={styles.deliveryText}>{order.delivery_address}</Text>
          </View>

          {order.notes ? (
            <View style={styles.notesRow}>
              <Text style={{ fontSize: 14, color: COLORS.textSecondary }}>●</Text>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  )
}

export default function OrdersScreen() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockApi.get('/orders')
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>{orders.length} order{orders.length !== 1 ? 's' : ''}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySub}>Your order history will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={o => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard order={item} />}
        />
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
    paddingHorizontal: SPACING.lg,
    paddingTop:        SPACING.lg,
    paddingBottom:     SPACING.md,
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
  list: {
    paddingHorizontal: SPACING.lg,
    paddingBottom:     SPACING.xxxl,
    gap:               SPACING.md,
  },
  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    overflow:        'hidden',
    ...shadow(2),
  },
  orderHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    padding:        SPACING.lg,
    paddingBottom:  SPACING.sm,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.md,
  },
  statusIcon: {
    width:         40,
    height:        40,
    borderRadius:  20,
    alignItems:    'center',
    justifyContent:'center',
  },
  orderId: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  orderDate: {
    fontSize: FONTS.sizes.sm,
    color:    COLORS.textSecondary,
    marginTop: 2,
  },
  orderHeaderRight: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
  },
  orderTotal: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primary,
  },
  orderStatusRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      RADIUS.full,
  },
  statusBadgeText: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
  subBadge: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius:   RADIUS.full,
    backgroundColor: COLORS.primaryLight,
  },
  subBadgeText: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.primaryDark,
  },
  orderExpanded: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding:        SPACING.lg,
  },
  trackingContainer: {
    marginBottom: SPACING.lg,
  },
  trackingBar: {
    flexDirection: 'row',
    alignItems:    'flex-start',
  },
  trackingStep: {
    alignItems: 'center',
    width:      56,
  },
  trackingDot: {
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: COLORS.border,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     COLORS.border,
  },
  trackingDotDone: {
    backgroundColor: COLORS.primary,
    borderColor:     COLORS.primary,
  },
  trackingDotActive: {
    borderColor:     COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  trackingLine: {
    flex:            1,
    height:          2,
    backgroundColor: COLORS.border,
    marginTop:       10,
  },
  trackingLineDone: {
    backgroundColor: COLORS.primary,
  },
  trackingStepLabel: {
    fontSize:   FONTS.sizes.xs,
    color:      COLORS.textSecondary,
    textAlign:  'center',
    marginTop:  4,
    lineHeight: 14,
  },
  trackingStepLabelDone: {
    color:      COLORS.primary,
    fontWeight: FONTS.weights.semibold,
  },
  cancelledRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.xs,
    marginBottom:  SPACING.md,
  },
  cancelledText: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.error,
    fontWeight: FONTS.weights.semibold,
  },
  itemsTitle: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  itemRow: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemName: {
    flex:     1,
    fontSize: FONTS.sizes.sm,
    color:    COLORS.textPrimary,
  },
  itemQty: {
    fontSize: FONTS.sizes.sm,
    color:    COLORS.textSecondary,
    marginHorizontal: SPACING.md,
  },
  itemPrice: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           SPACING.xs,
    marginTop:     SPACING.md,
  },
  deliveryText: {
    flex:     1,
    fontSize: FONTS.sizes.sm,
    color:    COLORS.textSecondary,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           SPACING.xs,
    marginTop:     SPACING.sm,
  },
  notesText: {
    flex:      1,
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.textSecondary,
    fontStyle: 'italic',
  },
  empty: {
    alignItems:  'center',
    marginTop:   80,
    paddingHorizontal: SPACING.xxxl,
  },
  emptyEmoji: { fontSize: 52, marginBottom: SPACING.md },
  emptyTitle: {
    fontSize:   FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySub: {
    fontSize:  FONTS.sizes.md,
    color:     COLORS.textSecondary,
    textAlign: 'center',
  },
})
