import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreenLogin({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#E7003B" barStyle="light-content" />
      <ActivityIndicator size="large" color="#fff" />
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
});
