import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Event = {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'culto' | 'retiro' | 'encontro' | 'conferencia'
  gradientColors: readonly [string, string]
}

const events: Event[] = [
  {
    id: '1',
    title: 'CULTO LEGACY',
    description: 'Momento de louvor, adoração e Palavra para todos os jovens da Lagoinha Alphaville.',
    date: '2 nov',
    time: '19h',
    location: 'Igreja Lagoinha Alphaville',
    type: 'culto',
    gradientColors: ['#CC0022', '#200005'],
  },
  {
    id: '2',
    title: 'RETIRO LEGACY 2026',
    description: 'Um fim de semana de imersão com pregação, louvor e atividades para os jovens.',
    date: '15-17 nov',
    time: '08h (sáb)',
    location: 'A confirmar',
    type: 'retiro',
    gradientColors: ['#1040DD', '#000820'],
  },
  {
    id: '3',
    title: 'NIGHT OF WORSHIP',
    description: 'Uma noite especial de adoração e louvor com toda a família Legacy reunida.',
    date: '23 nov',
    time: '19h30',
    location: 'Igreja Lagoinha Alphaville',
    type: 'encontro',
    gradientColors: ['#6A0DAD', '#0D0015'],
  },
  {
    id: '4',
    title: 'CONFERÊNCIA YOUTH',
    description: 'Conferência anual de jovens com palestrantes convidados e momentos de ministração.',
    date: '7 dez',
    time: '09h',
    location: 'Igreja Lagoinha Alphaville',
    type: 'conferencia',
    gradientColors: ['#0DB350', '#001810'],
  },
]

const typeLabels: Record<Event['type'], string> = {
  culto: 'CULTO',
  retiro: 'RETIRO',
  encontro: 'ENCONTRO',
  conferencia: 'CONFERÊNCIA',
}

export default function EventsScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AGENDA</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.intro}>
        <View style={styles.introBadge}>
          <View style={styles.introBadgeDot} />
          <Text style={styles.introBadgeText}>PRÓXIMOS EVENTOS</Text>
        </View>
        <Text style={styles.introTitle}>{'Fique por dentro\nda agenda Legacy'}</Text>
        <Text style={styles.introDesc}>
          Marque na agenda e não perca nenhum momento especial com a família.
        </Text>
      </View>

      <View style={styles.list}>
        {events.map((event) => (
          <LinearGradient key={event.id} colors={event.gradientColors} style={styles.card}>
            <View style={styles.cardDateBox}>
              <Text style={styles.cardDate}>{event.date}</Text>
              <Text style={styles.cardTime}>{event.time}</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTypeBadge}>
                <Text style={styles.cardTypeText}>{typeLabels[event.type]}</Text>
              </View>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardDesc}>{event.description}</Text>
              <View style={styles.cardLocation}>
                <Feather name="map-pin" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={styles.cardLocationText}>{event.location}</Text>
              </View>
            </View>
          </LinearGradient>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Para mais informações, acompanhe nosso Instagram ou entre em contato.
        </Text>
        <TouchableOpacity
          style={styles.igBtn}
          onPress={() => Linking.openURL('https://www.instagram.com/legacyalphaville')}
        >
          <Feather name="instagram" size={16} color="#fff" />
          <Text style={styles.igBtnText}>@LEGACYALPHAVILLE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', letterSpacing: 1 },
  headerRight: { width: 30 },
  intro: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 8,
  },
  introBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  introBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0033',
    marginRight: 8,
  },
  introBadgeText: {
    color: '#FF0033',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111',
    lineHeight: 34,
    marginBottom: 10,
  },
  introDesc: { fontSize: 14, color: '#666', lineHeight: 21 },
  list: { padding: 16, gap: 16 },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 16,
    gap: 14,
  },
  cardDateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 52,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 8,
  },
  cardDate: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 15,
    textAlign: 'center',
  },
  cardTime: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 2 },
  cardBody: { flex: 1 },
  cardTypeBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  cardTypeText: { color: '#fff', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  cardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  cardLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardLocationText: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  footer: {
    marginHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    gap: 14,
  },
  footerText: { color: '#AAA', fontSize: 13, textAlign: 'center', lineHeight: 19 },
  igBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF0033',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 30,
  },
  igBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 },
})
