import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface SplashScreenProps {
  onFinish: () => void;
}

const words = ['LIVE', 'THE', 'NEW', 'LEGACY'];

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [index, setIndex] = useState(-1); // -1 para exibir o loader inicialmente
  const [showLoader, setShowLoader] = useState(true);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Simula carregamento inicial por 1.5s
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false);
      setIndex(0); // Inicia a exibição das palavras
    }, 1500);

    return () => clearTimeout(loaderTimeout);
  }, []);

  useEffect(() => {
    if (index >= 0 && index < words.length) {
      // Anima entrada da palavra
      opacity.value = 0;
      opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });

      if (words[index] === 'LEGACY') {
        scale.value = 1;
        scale.value = withTiming(1.2, { duration: 500, easing: Easing.out(Easing.exp) });
      } else {
        scale.value = 1;
      }

      // Aguarda tempo total antes de passar para a próxima palavra
      const timer = setTimeout(() => {
        if (index < words.length - 1) {
          setIndex(index + 1);
        } else {
          // Após a última palavra, fade-out e ir para a próxima tela
          opacity.value = withTiming(0, { duration: 500 }, () => {
            runOnJS(onFinish)();
          });
        }
      }, 1500); // Tempo total de cada palavra na tela

      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E7003B" barStyle="light-content" />

      {showLoader ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <Animated.Text
          style={[
            styles.text,
            words[index] === 'LEGACY' && styles.highlightedText,
            animatedStyle,
          ]}
        >
          {words[index]}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7003B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 45,
    fontWeight: 'bold',
  },
  highlightedText: {
    fontSize: 55,
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
});
