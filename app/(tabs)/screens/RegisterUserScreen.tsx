import { Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
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
import SplashScreenHome from '../../../components/SplashScreenHome';

export default function RegisterUserScreen() {
  const [showHomeSplash, setShowHomeSplash] = useState(false);
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Roboto_900Black });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleGoBack = () => {
    router.back();
  };

  if (showHomeSplash) {
    return (
      <SplashScreenHome
        onFinish={() => {
          setShowHomeSplash(false);
          router.replace('/screens/HomeScreen');
        }}
      />
    );
  }

  const getBorderColor = (field: string, value: string) =>
    focusedField === field || value ? '#E7003B' : '#ccc';

  const handleRegister = () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o campo de e-mail.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o campo de senha.');
      return;
    }

    const isWeak =
      password.length < 6 ||
      /^[a-zA-Z]+$/.test(password) ||
      /^[0-9]+$/.test(password);

    if (isWeak) {
      Alert.alert(
        'Senha fraca',
        'Crie uma senha mais forte com letras, números e ao menos 6 caracteres.'
      );
      return;
    }

    if (!confirmPassword.trim()) {
      Alert.alert('Atenção', 'Por favor, confirme sua senha.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas diferentes', 'As senhas digitadas não coincidem.');
      return;
    }

    // Após todas as validações, inicia a animação de splash
    setShowHomeSplash(true);
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          enableOnAndroid
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#E7003B" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.titleSmall}>Crie sua conta</Text>
              <Text style={styles.titleBig}>LEGACY</Text>
            </View>

            <View style={styles.content}>
              <View
                style={[
                  styles.inputContainer,
                  { borderColor: getBorderColor('email', email) },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={getBorderColor('email', email)}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>

              <View
                style={[
                  styles.inputContainer,
                  { borderColor: getBorderColor('password', password) },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={getBorderColor('password', password)}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Crie uma senha"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.inputContainer,
                  { borderColor: getBorderColor('confirm', confirmPassword) },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={getBorderColor('confirm', confirmPassword)}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirme sua senha"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedField('confirm')}
                  onBlur={() => setFocusedField(null)}
                />
                <TouchableOpacity
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <Ionicons
                    name={
                      showConfirmPassword
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={20}
                    color="#ccc"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.termsText}>
                Ao criar uma conta, você aceita todos os{' '}
                <Text style={styles.termsLink}>termos</Text> e{' '}
                <Text style={styles.termsLink}>condições</Text>
              </Text>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerText}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  header: {
    marginTop: 150,
    alignItems: 'center',
  },
  titleSmall: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  titleBig: {
    fontSize: 36,
    fontFamily: 'Roboto_900Black',
    color: '#E7003B',
    marginBottom: 20,
  },
  content: {
    width: '100%',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 10,
    marginBottom: 20,
  },
  termsLink: {
    color: '#E7003B',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#E7003B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
