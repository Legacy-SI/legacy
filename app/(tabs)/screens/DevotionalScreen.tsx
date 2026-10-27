import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Devotional = {
  dayLabel: string
  verse: string
  reference: string
  theme: string
  reflection: string
  prayer: string
  gradientColors: readonly [string, string]
}

const devotionals: Devotional[] = [
  {
    dayLabel: 'DOMINGO',
    verse: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."',
    reference: 'João 3:16',
    theme: 'O amor de Deus',
    reflection:
      'Hoje, ao iniciar a semana, lembre-se de que você não é amado por aquilo que faz, mas por quem você é — filho de Deus. O amor que o Pai demonstrou na cruz não tem condição nem medida. Caminhe hoje consciente desse amor.',
    prayer:
      'Senhor, obrigado pelo seu amor incondicional. Que eu reflita esse amor em cada pessoa que eu encontrar hoje. Amém.',
    gradientColors: ['#CC0022', '#200005'],
  },
  {
    dayLabel: 'SEGUNDA',
    verse: '"Tudo posso naquele que me fortalece."',
    reference: 'Filipenses 4:13',
    theme: 'Força em Cristo',
    reflection:
      'A semana começa e os desafios aparecem. Mas a sua força não vem de você — vem daquele que habita em você. Enfrente cada obstáculo sabendo que você não está sozinho nessa jornada.',
    prayer:
      'Pai, que a minha confiança não esteja nos meus próprios recursos, mas em Tua força que opera em mim. Amém.',
    gradientColors: ['#1040DD', '#000820'],
  },
  {
    dayLabel: 'TERÇA',
    verse: '"Espera no Senhor, tem bom ânimo e Ele fortalecerá o teu coração."',
    reference: 'Salmos 27:14',
    theme: 'Esperança',
    reflection:
      'Esperar não significa parar. Significa confiar enquanto continua. O Deus que criou o universo tem os Seus olhos sobre você. Sua promessa nunca falhou e não falhará com você.',
    prayer:
      'Senhor, ensina-me a esperar em Ti com fé ativa, confiando em Tua fidelidade em cada área da minha vida. Amém.',
    gradientColors: ['#0DB350', '#001810'],
  },
  {
    dayLabel: 'QUARTA',
    verse: '"Buscai primeiro o reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas."',
    reference: 'Mateus 6:33',
    theme: 'Prioridades',
    reflection:
      'No meio da semana é fácil se perder nas demandas do dia. Mas Jesus nos chama a uma escolha de prioridade. Quando Deus é o primeiro em tudo, o restante se alinha.',
    prayer:
      'Jesus, que eu te coloque em primeiro lugar nas minhas escolhas de hoje. Que minha vida reflita que você é minha prioridade. Amém.',
    gradientColors: ['#6A0DAD', '#0D0015'],
  },
  {
    dayLabel: 'QUINTA',
    verse: '"Não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente."',
    reference: 'Romanos 12:2',
    theme: 'Transformação',
    reflection:
      'A transformação começa na mente. Aquilo que você alimenta nos seus pensamentos molda quem você se torna. Alimente sua mente com a Palavra e veja sua vida ser transformada de dentro para fora.',
    prayer:
      'Espírito Santo, renova a minha mente hoje. Que meus pensamentos estejam alinhados com a Tua vontade. Amém.',
    gradientColors: ['#C47200', '#1A0A00'],
  },
  {
    dayLabel: 'SEXTA',
    verse: '"A paz de Deus, que excede todo o entendimento, guardará os vossos corações e as vossas mentes em Cristo Jesus."',
    reference: 'Filipenses 4:7',
    theme: 'Paz em Cristo',
    reflection:
      'No fim da semana, as pressões podem ser intensas. Mas há uma paz que não depende das circunstâncias — ela vem de Jesus. Entregue suas ansiedades a Ele e receba a paz que ultrapassa qualquer compreensão humana.',
    prayer:
      'Senhor Jesus, eu te entrego as minhas preocupações. Que a Tua paz guarde meu coração agora e sempre. Amém.',
    gradientColors: ['#005F73', '#000C10'],
  },
  {
    dayLabel: 'SÁBADO',
    verse: '"Alegrai-vos no Senhor sempre; outra vez digo: alegrai-vos."',
    reference: 'Filipenses 4:4',
    theme: 'Alegria',
    reflection:
      'A alegria cristã não depende das circunstâncias — ela é uma escolha e um fruto do Espírito. Hoje, permita-se descansar, estar com sua família e comunidade, e celebrar a vida que Deus te deu.',
    prayer:
      'Pai, que a alegria de Te conhecer transborde em tudo que eu fizer hoje. Que ela seja contagiante aos que me rodeiam. Amém.',
    gradientColors: ['#8B0000', '#1A0000'],
  },
]

export default function DevotionalScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  const today = devotionals[new Date().getDay()]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>DEVOCIONAL</Text>
        <View style={styles.headerRight} />
      </View>

      <LinearGradient colors={today.gradientColors} style={styles.verseCard}>
        <View style={styles.dayBadge}>
          <Text style={styles.dayBadgeText}>{today.dayLabel}</Text>
        </View>
        <Text style={styles.verseText}>{today.verse}</Text>
        <View style={styles.referenceRow}>
          <View style={styles.referenceLine} />
          <Text style={styles.referenceText}>{today.reference}</Text>
        </View>
      </LinearGradient>

      <View style={styles.themeRow}>
        <Feather name="bookmark" size={16} color="#FF0033" />
        <Text style={styles.themeText}>
          Tema de hoje:{' '}
          <Text style={styles.themeHighlight}>{today.theme}</Text>
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>REFLEXÃO</Text>
        <Text style={styles.sectionBody}>{today.reflection}</Text>
      </View>

      <View style={styles.prayerCard}>
        <View style={styles.prayerAccent} />
        <View style={styles.prayerContent}>
          <Text style={styles.prayerLabel}>ORAÇÃO DO DIA</Text>
          <Text style={styles.prayerText}>{today.prayer}</Text>
        </View>
      </View>

      <View style={styles.weekSection}>
        <Text style={styles.weekLabel}>ESTA SEMANA</Text>
        <View style={styles.weekRow}>
          {devotionals.map((d, i) => (
            <View
              key={i}
              style={[styles.weekDot, i === new Date().getDay() && styles.weekDotActive]}
            >
              <Text
                style={[styles.weekDotText, i === new Date().getDay() && styles.weekDotTextActive]}
              >
                {d.dayLabel.charAt(0)}
              </Text>
            </View>
          ))}
        </View>
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
  verseCard: {
    margin: 16,
    borderRadius: 20,
    padding: 28,
    paddingBottom: 24,
  },
  dayBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  dayBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1.2 },
  verseText: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 18,
  },
  referenceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  referenceLine: { width: 24, height: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  referenceText: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 'bold' },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  themeText: { color: '#555', fontSize: 14 },
  themeHighlight: { color: '#FF0033', fontWeight: 'bold' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionLabel: {
    fontSize: 11,
    color: '#FF0033',
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  sectionBody: { fontSize: 15, color: '#333', lineHeight: 24 },
  prayerCard: {
    marginHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 14,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 28,
  },
  prayerAccent: { width: 5, backgroundColor: '#FF0033' },
  prayerContent: { flex: 1, padding: 18 },
  prayerLabel: {
    color: '#FF0033',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  prayerText: { color: '#EEE', fontSize: 14, lineHeight: 22, fontStyle: 'italic' },
  weekSection: { paddingHorizontal: 20 },
  weekLabel: {
    color: '#888',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },
  weekRow: { flexDirection: 'row', gap: 8 },
  weekDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDotActive: { backgroundColor: '#FF0033' },
  weekDotText: { color: '#888', fontSize: 12, fontWeight: 'bold' },
  weekDotTextActive: { color: '#fff' },
})
