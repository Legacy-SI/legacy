import { Feather, FontAwesome } from '@expo/vector-icons'; // Ícones
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const events = [
  { uri: require('../../../assets/images/ImgProxEventoOne.jpg') },
  { uri: require('../../../assets/images/ImgProxEventoTwo.jpg') },
];

const socialLinks = {
  globe: 'https://bio.site/legacyalphaville',
  instagram: 'https://www.instagram.com/legacyalphaville',
  whatsapp: 'https://chat.whatsapp.com/Bbur8Y6zQBpGOkqxdfVb4q',
};

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LEGACY</Text>
        <View style={styles.headerActions}>
          <Text style={styles.headerWelcome}>BEM-VINDO</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityLabel="Sair"
          >
            <Feather name="log-out" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* INGRESSO */}
      <View style={styles.ticketSection}>
        <View style={styles.ticketTextContainer}>
          <Text style={styles.ticketText}>GARANTA SEU INGRESSO</Text>
        </View>
        <Image
          source={require('../../../assets/images/ImgHome.jpg')}
          style={styles.ticketBanner}
          resizeMode="cover"
        />
      </View>


      {/* PRÓXIMOS EVENTOS */}
      <Text style={styles.sectionTitle}>PRÓXIMOS EVENTOS</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.eventScroll}>
        {events.map((item, index) => (
          <Image key={index} source={item.uri} style={styles.eventImage} resizeMode="cover" />
        ))}
      </ScrollView>

      {/* LOJA */}
      <Text style={styles.sectionTitle}>CONHEÇA NOSSA LOJA</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.storeScroll}>
        <Image source={require('../../../assets/images/ImgLojaOne.jpg')} style={styles.storeImage} />
        <Image source={require('../../../assets/images/ImgLojaTwo.jpg')} style={styles.storeImage} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => handleOpenLink(socialLinks.instagram)}
          accessibilityLabel="Abrir Instagram"
        >
          <FontAwesome name="instagram" size={32} color="#FF0033" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => handleOpenLink(socialLinks.whatsapp)}
          accessibilityLabel="Abrir WhatsApp"
        >
          <FontAwesome name="whatsapp" size={32} color="#FF0033" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerIcon}
          onPress={() => handleOpenLink(socialLinks.globe)}
          accessibilityLabel="Abrir site"
        >
          <Feather name="globe" size={32} color="#FF0033" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    backgroundColor: '#FF0033',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerWelcome: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    marginLeft: 10,
    padding: 4,
  },
  ticketSection: {
  width: '90%',
  borderRadius: 10,
  marginTop: 20,
  alignItems: 'center',
  padding: 0,
},
ticketTextContainer: {
  backgroundColor: '#DFFF00',
  width: '100%',
  alignItems: 'center',
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
  paddingVertical: 8,
},
ticketText: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#000',
},
ticketBanner: {
  width: '100%',
  height: 180,
  borderBottomLeftRadius: 10,
  borderBottomRightRadius: 10,
},

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF0033',
    marginTop: 30,
    marginBottom: 10,
  },
  eventScroll: {
    paddingHorizontal: 10,
  },
  eventImage: {
    width: 170,
    height: 220,
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  storeScroll: {
    paddingHorizontal: 10,
  },
  storeImage: {
    width: 170,
    height: 180,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF0033',
  },
  footer: {
    marginTop: 30,
    paddingVertical: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerIcon: {
    marginHorizontal: 15,
    borderRadius: 50,
  },
});
