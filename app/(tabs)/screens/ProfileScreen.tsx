import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../../../contexts/AuthContext'
import { api } from '../../../services/api'

type UserProfile = {
  id: string
  name: string
  email: string
  createdAt: string
}

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { token, signOut } = useAuth()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    if (!token) return
    try {
      const data = await api.get<UserProfile>('/users/me', {
        Authorization: `Bearer ${token}`,
      })
      setProfile(data)
      setEditName(data.name)
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar o perfil')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    if (!editName.trim()) {
      Alert.alert('Atenção', 'Nome não pode ser vazio')
      return
    }
    setIsSaving(true)
    try {
      const updated = await api.patch<UserProfile>(
        '/users/me',
        { name: editName.trim() },
        { Authorization: `Bearer ${token}` },
      )
      setProfile(updated)
      setIsEditing(false)
    } catch (err: any) {
      Alert.alert('Erro', err.message ?? 'Não foi possível atualizar o perfil')
    } finally {
      setIsSaving(false)
    }
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#FF0033" size="large" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MEU PERFIL</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(profile?.name ?? 'U')}</Text>
        </View>
        {isEditing ? (
          <TextInput
            style={styles.nameInput}
            value={editName}
            onChangeText={setEditName}
            autoFocus
            maxLength={60}
          />
        ) : (
          <Text style={styles.userName}>{profile?.name}</Text>
        )}
        <Text style={styles.userMember}>
          {profile?.createdAt ? `Membro desde ${formatDate(profile.createdAt)}` : ''}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Feather name="user" size={18} color="#FF0033" />
          <View style={styles.cardRowContent}>
            <Text style={styles.cardLabel}>NOME</Text>
            <Text style={styles.cardValue}>{profile?.name}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardRow}>
          <Feather name="mail" size={18} color="#FF0033" />
          <View style={styles.cardRowContent}>
            <Text style={styles.cardLabel}>E-MAIL</Text>
            <Text style={styles.cardValue}>{profile?.email}</Text>
          </View>
        </View>
      </View>

      {isEditing ? (
        <View style={styles.editActions}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setIsEditing(false)
              setEditName(profile?.name ?? '')
            }}
          >
            <Text style={styles.cancelBtnText}>CANCELAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>SALVAR</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
          <Feather name="edit-2" size={16} color="#FF0033" />
          <Text style={styles.editBtnText}>EDITAR NOME</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await signOut()
          router.replace('/')
        }}
      >
        <Feather name="log-out" size={18} color="#FF0033" />
        <Text style={styles.logoutBtnText}>SAIR DA CONTA</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: { flex: 1, backgroundColor: '#fff' },
  content: { paddingBottom: 48 },
  header: {
    backgroundColor: '#FF0033',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerRight: { width: 30 },
  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FF0033',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#111', marginBottom: 4 },
  nameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    borderBottomWidth: 2,
    borderBottomColor: '#FF0033',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 4,
    minWidth: 200,
    textAlign: 'center',
  },
  userMember: { fontSize: 13, color: '#888' },
  card: {
    marginHorizontal: 20,
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  cardRowContent: { flex: 1 },
  cardLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  cardValue: { fontSize: 15, color: '#111', fontWeight: '600', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E5E5E5', marginVertical: 8 },
  editActions: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#CCC',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelBtnText: { color: '#666', fontWeight: 'bold', fontSize: 13 },
  saveBtn: {
    flex: 1,
    backgroundColor: '#FF0033',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#FF0033',
    borderRadius: 10,
    paddingVertical: 13,
    marginBottom: 16,
  },
  editBtnText: { color: '#FF0033', fontWeight: 'bold', fontSize: 13 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#FF0033',
    borderRadius: 10,
    paddingVertical: 13,
  },
  logoutBtnText: { color: '#FF0033', fontWeight: 'bold', fontSize: 13 },
})
