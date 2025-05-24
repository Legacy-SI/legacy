import { Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated, { FadeIn } from 'react-native-reanimated';
import SplashScreenHome from '../../components/SplashScreenHome';
import SplashScreenLogin from '../../components/SplashScreenLogin';

export default function Index() {
  const [showSplash, setShowSplash] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [showHomeSplash, setShowHomeSplash] = useState(false);

  const router = useRouter();

  if (showSplash) {
    return <SplashScreenLogin onFinish={() => setShowSplash(false)} />;
  }

  if (showHomeSplash) {
    return (
      <SplashScreenHome
        onFinish={() => {
          setShowHomeSplash(false);
          setContentVisible(true);
          router.push('/screens/HomeScreen');
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!contentVisible && (
        <Animated.View entering={FadeIn.duration(1000)} style={{ flex: 1 }}>
          <LoginScreen setShowHomeSplash={setShowHomeSplash} />
        </Animated.View>
      )}
    </View>
  );
}

function LoginScreen({ setShowHomeSplash }) {
  const [fontsLoaded] = useFonts({ Roboto_900Black });
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E7003B" />
      </View>
    );
  }

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() && !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail e a senha.');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o e-mail.');
      return false;
    }
    if (!emailRegex.test(email)) {
      Alert.alert('Atenção', 'Por favor, insira um e-mail válido.');
      return false;
    }
    if (!password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha a senha.');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateFields()) return;
    setShowHomeSplash(true);
  };

  const handleRegister = () => {
    router.push('/screens/RegisterUserScreen');
  };

  const handleForgotPassword = () => {
    router.push('./screens/ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text style={styles.titleSmall}>Acesse ou crie sua conta</Text>
            <Text style={styles.titleBig}>LEGACY</Text>

            <View
              style={[
                styles.ViewGroup,
                {
                  borderColor:
                    emailFocused || email !== '' ? '#E7003B' : '#B0B0B0',
                },
              ]}
            >
              <MaterialIcons
                name="email"
                size={24}
                color={emailFocused || email !== '' ? '#E7003B' : '#B0B0B0'}
                style={styles.icon}
              />
              <TextInput
                placeholder="E-mail"
                placeholderTextColor="#B0B0B0"
                style={styles.input}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <View
              style={[
                styles.ViewGroup,
                {
                  borderColor:
                    passwordFocused || password !== ''
                      ? '#E7003B'
                      : '#B0B0B0',
                },
              ]}
            >
              <MaterialIcons
                name="lock"
                size={24}
                color={
                  passwordFocused || password !== '' ? '#E7003B' : '#B0B0B0'
                }
                style={styles.icon}
              />
              <TextInput
                placeholder="Senha"
                placeholderTextColor="#B0B0B0"
                style={styles.input}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                returnKeyType="done"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={24}
                  color={
                    passwordFocused || password !== '' ? '#E7003B' : '#B0B0B0'
                  }
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.or}>ou</Text>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
            >
              <Text style={styles.registerText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  titleSmall: {
    fontSize: 16,
    textAlign: 'center',
    color: '#B0B0B0',
    marginBottom: 5,
  },
  titleBig: {
    fontSize: 40,
    textAlign: 'center',
    color: '#E7003B',
    fontFamily: 'Roboto_900Black',
    marginBottom: 30,
    textShadowRadius: 2,
  },
  ViewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgotPassword: {
    color: '#E7003B',
    textAlign: 'right',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#E7003B',
    paddingVertical: 15,
    borderRadius: 10,
  },
  loginText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  or: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#B0B0B0',
  },
  registerButton: {
    borderColor: '#E7003B',
    borderWidth: 1.5,
    paddingVertical: 15,
    borderRadius: 10,
  },
  registerText: {
    color: '#E7003B',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
