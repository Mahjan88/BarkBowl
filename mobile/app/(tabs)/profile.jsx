import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { mockApi } from '../../lib/mockApi'
import { useAuth } from '../../context/AuthContext'
import { COLORS, FONTS, RADIUS, SPACING, shadow } from '../../lib/theme'

const ACTIVITY_LEVELS = ['low', 'moderate', 'high']

function DogForm({ dog, onSave, onCancel }) {
  const [name,     setName]     = useState(dog?.name     || '')
  const [breed,    setBreed]    = useState(dog?.breed    || '')
  const [age,      setAge]      = useState(dog?.age_years ? String(dog.age_years) : '')
  const [weight,   setWeight]   = useState(dog?.weight_lbs ? String(dog.weight_lbs) : '')
  const [activity, setActivity] = useState(dog?.activity_level || 'moderate')
  const [saving,   setSaving]   = useState(false)

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Name required'); return }
    setSaving(true)
    await onSave({
      name:           name.trim(),
      breed:          breed.trim(),
      age_years:      parseInt(age) || 0,
      weight_lbs:     parseInt(weight) || 0,
      activity_level: activity,
    })
    setSaving(false)
  }

  return (
    <View style={styles.dogForm}>
      <Text style={styles.formTitle}>{dog ? 'Edit Dog' : 'Add a Dog'}</Text>

      <Text style={styles.label}>Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Bella" placeholderTextColor={COLORS.textSecondary} />

      <Text style={styles.label}>Breed</Text>
      <TextInput style={styles.input} value={breed} onChangeText={setBreed} placeholder="e.g. Golden Retriever" placeholderTextColor={COLORS.textSecondary} />

      <View style={styles.inlineRow}>
        <View style={styles.inlineField}>
          <Text style={styles.label}>Age (yrs)</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="number-pad" placeholder="3" placeholderTextColor={COLORS.textSecondary} />
        </View>
        <View style={styles.inlineField}>
          <Text style={styles.label}>Weight (lbs)</Text>
          <TextInput style={styles.input} value={weight} onChangeText={setWeight} keyboardType="number-pad" placeholder="55" placeholderTextColor={COLORS.textSecondary} />
        </View>
      </View>

      <Text style={styles.label}>Activity Level</Text>
      <View style={styles.activityRow}>
        {ACTIVITY_LEVELS.map(level => (
          <TouchableOpacity
            key={level}
            style={[styles.activityBtn, activity === level && styles.activityBtnActive]}
            onPress={() => setActivity(level)}
          >
            <Text style={[styles.activityText, activity === level && styles.activityTextActive]}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.saveText}>Save</Text>}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const [dogs, setDogs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingDog, setEditingDog] = useState(null)

  const loadDogs = () =>
    mockApi.get('/dogs').then(setDogs).finally(() => setLoading(false))

  useEffect(() => { loadDogs() }, [])

  const handleAddDog = async (data) => {
    await mockApi.post('/dogs', data)
    await loadDogs()
    setShowForm(false)
  }

  const handleEditDog = async (data) => {
    await mockApi.put(`/dogs/${editingDog.id}`, data)
    await loadDogs()
    setEditingDog(null)
  }

  const handleDeleteDog = (dog) => {
    Alert.alert(
      'Remove Dog',
      `Remove ${dog.name} from your account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            await mockApi.delete(`/dogs/${dog.id}`)
            loadDogs()
          },
        },
      ]
    )
  }

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    )
  }

  const activityEmoji = (level) => ({ low: '😴', moderate: '🚶', high: '🏃' }[level] || '🐕')

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.userBadge}>
            <Text style={{ fontSize: 18, color: COLORS.white }}>👤</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>

        {/* Dogs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Dogs</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => { setShowForm(true); setEditingDog(null) }}
            >
              <Text style={{ fontSize: 18, color: COLORS.white }}>＋</Text>
              <Text style={styles.addBtnText}>Add Dog</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={COLORS.primary} style={{ marginTop: 20 }} />
          ) : (
            <>
              {dogs.map(dog => (
                <View key={dog.id} style={styles.dogCard}>
                  <View style={styles.dogCardLeft}>
                    <Text style={styles.dogEmoji}>{activityEmoji(dog.activity_level)}</Text>
                    <View>
                      <Text style={styles.dogName}>{dog.name}</Text>
                      <Text style={styles.dogBreed}>{dog.breed || 'Mixed breed'}</Text>
                      <View style={styles.dogMeta}>
                        {dog.age_years > 0 && (
                          <Text style={styles.dogMetaText}>{dog.age_years}y</Text>
                        )}
                        {dog.weight_lbs > 0 && (
                          <Text style={styles.dogMetaText}>{dog.weight_lbs} lbs</Text>
                        )}
                        <View style={styles.activityPill}>
                          <Text style={styles.activityPillText}>
                            {dog.activity_level || 'moderate'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.dogActions}>
                    <TouchableOpacity
                      style={styles.dogActionBtn}
                      onPress={() => { setEditingDog(dog); setShowForm(false) }}
                    >
                      <Text style={{ fontSize: 18, color: COLORS.primary }}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.dogActionBtn, styles.dogDeleteBtn]}
                      onPress={() => handleDeleteDog(dog)}
                    >
                      <Text style={{ fontSize: 18, color: COLORS.error }}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {dogs.length === 0 && (
                <Text style={styles.emptyDogs}>No dogs added yet. Add your pup!</Text>
              )}
            </>
          )}

          {/* Inline Add Form */}
          {showForm && (
            <DogForm
              dog={null}
              onSave={handleAddDog}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Inline Edit Form */}
          {editingDog && (
            <DogForm
              dog={editingDog}
              onSave={handleEditDog}
              onCancel={() => setEditingDog(null)}
            />
          )}
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.accountCard}>
            <TouchableOpacity style={styles.accountRow}>
              <Text style={{ fontSize: 20, color: COLORS.textPrimary }}>●</Text>
              <Text style={styles.accountRowText}>Notifications</Text>
              <Text style={{ fontSize: 18, color: COLORS.textSecondary }}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.accountRow}>
              <Text style={{ fontSize: 20, color: COLORS.textPrimary }}>●</Text>
              <Text style={styles.accountRowText}>Saved Addresses</Text>
              <Text style={{ fontSize: 18, color: COLORS.textSecondary }}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.accountRow}>
              <Text style={{ fontSize: 20, color: COLORS.textPrimary }}>●</Text>
              <Text style={styles.accountRowText}>Payment Methods</Text>
              <Text style={{ fontSize: 18, color: COLORS.textSecondary }}>→</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.accountRow}>
              <Text style={{ fontSize: 20, color: COLORS.textPrimary }}>ℹ️</Text>
              <Text style={styles.accountRowText}>Help & Support</Text>
              <Text style={{ fontSize: 18, color: COLORS.textSecondary }}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={{ fontSize: 20, color: COLORS.error }}>●</Text>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor:  COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingTop:       SPACING.lg,
    paddingBottom:    SPACING.xxl,
  },
  title: {
    fontSize:   FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
    marginBottom: SPACING.sm,
  },
  userBadge: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            SPACING.xs,
  },
  userEmail: {
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.primaryLight,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop:         SPACING.xl,
  },
  sectionHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   SPACING.md,
  },
  sectionTitle: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  addBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical:  7,
    borderRadius:    RADIUS.full,
  },
  addBtnText: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.white,
  },
  dogCard: {
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.lg,
    flexDirection:   'row',
    alignItems:      'center',
    marginBottom:    SPACING.md,
    ...shadow(2),
  },
  dogCardLeft: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.md,
  },
  dogEmoji: { fontSize: 36 },
  dogName: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
  },
  dogBreed: {
    fontSize:  FONTS.sizes.sm,
    color:     COLORS.textSecondary,
    marginTop: 2,
  },
  dogMeta: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           SPACING.sm,
    marginTop:     SPACING.xs,
  },
  dogMetaText: {
    fontSize:  FONTS.sizes.xs,
    color:     COLORS.textSecondary,
  },
  activityPill: {
    backgroundColor: COLORS.primaryLight,
    borderRadius:    RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical:  2,
  },
  activityPillText: {
    fontSize:   FONTS.sizes.xs,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.primaryDark,
  },
  dogActions: {
    flexDirection: 'row',
    gap:           SPACING.sm,
  },
  dogActionBtn: {
    width:           36,
    height:          36,
    borderRadius:    18,
    backgroundColor: COLORS.primaryLight,
    alignItems:      'center',
    justifyContent:  'center',
  },
  dogDeleteBtn: {
    backgroundColor: '#fef2f2',
  },
  emptyDogs: {
    fontSize:  FONTS.sizes.md,
    color:     COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: SPACING.xl,
  },
  // Dog Form
  dogForm: {
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    padding:         SPACING.lg,
    marginTop:       SPACING.sm,
    borderWidth:     2,
    borderColor:     COLORS.primary,
    ...shadow(2),
  },
  formTitle: {
    fontSize:   FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth:     1.5,
    borderColor:     COLORS.border,
    borderRadius:    RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    fontSize:        FONTS.sizes.md,
    color:           COLORS.textPrimary,
    backgroundColor: COLORS.background,
    marginBottom:    SPACING.md,
  },
  inlineRow: {
    flexDirection: 'row',
    gap:           SPACING.md,
  },
  inlineField: { flex: 1 },
  activityRow: {
    flexDirection: 'row',
    gap:           SPACING.sm,
    marginBottom:  SPACING.lg,
  },
  activityBtn: {
    flex:           1,
    paddingVertical: 8,
    borderRadius:   RADIUS.md,
    borderWidth:    1.5,
    borderColor:    COLORS.border,
    alignItems:     'center',
  },
  activityBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor:     COLORS.primary,
  },
  activityText: {
    fontSize:   FONTS.sizes.sm,
    fontWeight: FONTS.weights.medium,
    color:      COLORS.textSecondary,
  },
  activityTextActive: {
    color: COLORS.white,
    fontWeight: FONTS.weights.bold,
  },
  formActions: {
    flexDirection: 'row',
    gap:           SPACING.md,
  },
  cancelBtn: {
    flex:           1,
    paddingVertical: 12,
    borderRadius:   RADIUS.md,
    borderWidth:    1.5,
    borderColor:    COLORS.border,
    alignItems:     'center',
  },
  cancelText: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.textSecondary,
  },
  saveBtn: {
    flex:           1,
    paddingVertical: 12,
    borderRadius:   RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems:     'center',
  },
  saveText: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.bold,
    color:      COLORS.white,
  },
  // Account
  accountCard: {
    backgroundColor: COLORS.card,
    borderRadius:    RADIUS.lg,
    overflow:        'hidden',
    ...shadow(1),
  },
  accountRow: {
    flexDirection:  'row',
    alignItems:     'center',
    padding:        SPACING.lg,
    gap:            SPACING.md,
  },
  accountRowText: {
    flex:       1,
    fontSize:   FONTS.sizes.md,
    color:      COLORS.textPrimary,
    fontWeight: FONTS.weights.medium,
  },
  divider: {
    height:          1,
    backgroundColor: COLORS.border,
    marginLeft:      SPACING.lg,
  },
  signOutBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop:      SPACING.xl,
    paddingVertical: 14,
    borderRadius:   RADIUS.md,
    borderWidth:    1.5,
    borderColor:    COLORS.error + '50',
    backgroundColor: '#fef2f2',
  },
  signOutText: {
    fontSize:   FONTS.sizes.md,
    fontWeight: FONTS.weights.semibold,
    color:      COLORS.error,
  },
})
