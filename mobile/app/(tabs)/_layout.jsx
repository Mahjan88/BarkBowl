import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useCart } from '../../context/CartContext'
import { COLORS, FONTS } from '../../lib/theme'

// Emoji icons — no font loader dependency
const TAB_ICONS = {
  home:    { active: '🏠', inactive: '🏠' },
  build:   { active: '🍲', inactive: '🍲' },
  meals:   { active: '🍽️', inactive: '🍽️' },
  orders:  { active: '📦', inactive: '📦' },
  profile: { active: '🐶', inactive: '🐶' },
}

function TabIcon({ tab, focused }) {
  const emoji = TAB_ICONS[tab]?.active ?? '●'
  return (
    <View style={styles.tabIconWrapper}>
      <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>{emoji}</Text>
    </View>
  )
}

function BuildTabIcon({ focused }) {
  const { count } = useCart()
  return (
    <View style={styles.tabIconWrapper}>
      <Text style={[styles.emoji, { opacity: focused ? 1 : 0.5 }]}>🍲</Text>
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
      )}
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:   COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor:  COLORS.card,
          borderTopColor:   COLORS.border,
          borderTopWidth:   1,
          paddingBottom:    6,
          paddingTop:       6,
          height:           60,
        },
        tabBarLabelStyle: {
          fontSize:   FONTS.sizes.xs,
          fontWeight: FONTS.weights.medium,
          marginTop:  2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon tab="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="build"
        options={{
          title: 'Build',
          tabBarIcon: ({ focused }) => <BuildTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ focused }) => <TabIcon tab="meals" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused }) => <TabIcon tab="orders" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon tab="profile" focused={focused} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabIconWrapper: {
    position:        'relative',
    width:           30,
    height:          30,
    alignItems:      'center',
    justifyContent:  'center',
  },
  emoji: {
    fontSize: 20,
  },
  badge: {
    position:          'absolute',
    top:               -4,
    right:             -8,
    backgroundColor:   COLORS.amber,
    borderRadius:      999,
    minWidth:          18,
    height:            18,
    alignItems:        'center',
    justifyContent:    'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color:      '#fff',
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
  },
})
