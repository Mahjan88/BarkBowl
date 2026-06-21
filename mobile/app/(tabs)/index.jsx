import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { mockApi } from '../../lib/mockApi'
import { MOCK_PETS } from '../../lib/mockData'
import { useCart } from '../../context/CartContext'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

const MEAL_EMOJIS = {
  'Chicken & Rice Comfort Bowl': '🍗',
  'Beef Power Bowl': '🥩',
  'Turkey Sensitive Stomach Bowl': '🦃',
  'Salmon Skin & Coat Bowl': '🐟',
  'Puppy Growth Bowl': '🐾',
  'Senior Wellness Bowl': '🌿',
  'Low-Calorie Lean Bowl': '🥦',
}

export default function HomeScreen() {
  const router = useRouter()
  const { addItem } = useCart()
  const [meals, setMeals]   = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const pet = MOCK_PETS[0]

  useEffect(() => {
    Promise.all([mockApi.get('/meals'), mockApi.get('/orders')])
      .then(([m, o]) => { setMeals(m); setOrders(o) })
      .finally(() => setLoading(false))
  }, [])

  const lastOrder = orders[0]
  const popularMeals = meals.slice(0, 5)

  const handleReorder = () => {
    if (lastOrder) {
      lastOrder.order_items.forEach(item => {
        const meal = meals.find(m => m.id === item.meal_id)
        if (meal) addItem({ ...meal, quantity: item.quantity })
      })
      router.push('/cart')
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey there! 🐶</Text>
          <Text style={styles.petName}>
            {dog ? `Feeding ${dog.name} today?` : 'Welcome back!'}
          </Text>
        </View>
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/cart')}>
          <Text style={{ fontSize: 24, color: COLORS.white }}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardBuild]}
            onPress={() => router.push('/(tabs)/build')}
          >
            <Text style={styles.actionEmoji}>🥣</Text>
            <Text style={styles.actionTitle}>Build a Bowl</Text>
            <Text style={styles.actionSub}>Custom recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardMeals]}
            onPress={() => router.push('/(tabs)/meals')}
          >
            <Text style={styles.actionEmoji}>🍽️</Text>
            <Text style={styles.actionTitle}>Browse Meals</Text>
            <Text style={styles.actionSub}>Ready-made bowls</Text>
          </TouchableOpacity>
        </View>

        {/* Last Order */}
        {lastOrder && (
          <>
            <Text style={styles.sectionTitle}>Last Order</Text>
            <View style={styles.lastOrderCard}>
              <View style={styles.lastOrderTop}>
                <View style={styles.statusDot} />
                <Text style={styles.lastOrderStatus}>
                  {lastOrder.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </Text>
                <Text style={styles.lastOrderTotal}>${lastOrder.total_amount.toFixed(2)}</Text>
              </View>
              <Text style={styles.lastOrderItems}>
                {lastOrder.order_items.map(i => i.item_name).join(' · ')}
              </Text>
              <TouchableOpacity style={styles.reorderBtn} onPress={handleReorder}>
                <Text style={{ fontSize: 16, color: COLORS.primary }}>↺</Text>
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Popular Meals */}
        <Text style={styles.sectionTitle}>Popular Meals</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={popularMeals}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.popularCard}
                onPress={() => router.push('/(tabs)/meals')}
              >
                <Text style={styles.popularEmoji}>
                  {MEAL_EMOJIS[item.name] || '🍲'}
                </Text>
                {item.badge && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <Text style={styles.popularName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.popularCal}>{item.calories} kcal</Text>
                <Text style={styles.popularPrice}>${item.base_price.toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.popularAddBtn}
                  onPress={() => { addItem(item); router.push('/cart') }}
                >
                  <Text style={styles.popularAddText}>Add</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection:    'row',
    justifyContent:   'space-between',
    alignItems:       'center',
    paddingHorizontal: SPACING.lg,
    paddingTop:       SPACING.md,
    paddingBottom:    SPACING.xl,
  },
  greeting: {
    fontSize:   FONTS.sizes.sm,
    color:      COLORS.primaryLight,
    fontWeight: FONTS.weights.medium,
  },
  petName: {
    fontSize:   FONTS.sizes.xxl,
    color:      COLORS.white,
    fontWeight: FONTS.weights.bold,
    marginTop:  2,
  },
  cartBtn: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems:      'center',
    justifyContent:  'center',
  },
  scroll: {
    flex:             1,
    backgroundColor:  COLORS.background,
    borderTopLeftRadius:  RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop:       SPACING.xl,
  },
  sectionTitle: {
    fontSize:         FONTS.sizes.lg,
    fontWeight:       FONTS.weights.bold,
    color:            COLORS.textPrimary,
    marginHorizontal: SPACING.lg,
    marginBottom:     SPACING.md,
    marginTop:        SPACING.sm,
  },
  actionRow: {
    flexDirection:    'row',
    marginHorizontal: SPACING.lg,
    gap:              SPACING.md,
    marginBottom:     SPACING.lg,
  },
  actionCard: {
    flex:          1,
    borderRadius:  RADIUS.lg,
    padding:       SPACING.lg,
    alignItems:    'flex-start',
    ...shadow(2),
  },
  actionCardBuild: {
    backgroundColor: COLORS.primary,
  },
  actionCardMeals: {
    backgroundColor: COLORS.amber,
  },
  actionEmoji: {
    fontSize:     28,
    marginBottom: SPACING.sm,
  },
  actionTitle: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  actionSub: {
    fontSize:  FONTS.sizes.sm,
    color:     'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  lastOrderCard: {
    backgroundColor:  COLORS.card,
    marginHorizontal: SPACING.lg,
    borderRadius:     RADIUS.lg,
    padding:          SPACING.lg,
    marginBottom:     SPACING.lg,
    ...shadow(2),
  },
  lastOrderTop: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  SPACING.sm,
  },
  statusDot: {
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: COLORS.success,
    marginRight:     SPACING.xs,
  },
  lastOrderStatus: {
    flex:       1,
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
  },
  lastOrderTotal: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primary,
  },
  lastOrderItems: {
    fontSize:    FONTS.sizes.sm,
    color:       COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  reorderBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING.xs,
    alignSelf:      'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius:   RADIUS.full,
    borderWidth:    1,
    borderColor:    COLORS.primary,
  },
  reorderText: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.primary,
  },
  popularList: {
    paddingHorizontal: SPACING.lg,
    gap:               SPACING.md,
    paddingBottom:     SPACING.sm,
  },
  popularCard: {
    width:           160,
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.md,
    ...shadow(2),
  },
  popularEmoji: {
    fontSize:     32,
    marginBottom: SPACING.xs,
  },
  popularBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical:  3,
    alignSelf:       'flex-start',
    marginBottom:    SPACING.xs,
  },
  popularBadgeText: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primaryDark,
  },
  popularName: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.xs,
    minHeight:  36,
  },
  popularCal: {
    fontSize: FONTS.sizes.xs,
    color:    COLORS.textSecondary,
  },
  popularPrice: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.primary,
    marginTop:  2,
    marginBottom: SPACING.sm,
  },
  popularAddBtn: {
    backgroundColor: COLORS.primary,
    borderRadius:    RADIUS.md,
    paddingVertical: 6,
    alignItems:      'center',
  },
  popularAddText: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
})
