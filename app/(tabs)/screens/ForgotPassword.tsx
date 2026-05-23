import { Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { api } from '../../../services/api';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fontsLoaded] = useFonts({ Roboto_900Black });

  // Estado para controlar tela: 'email' ou 'code'
  const [step, setStep] = useState<'email' | 'code'>('email');

  // Estado do email
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Estados para os 4 dígitos do código
  const [code, setCode] = useState(['', '', '', '']);

  // refs para controlar o foco dos inputs do código
  const inputsRef = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleGoBack = () => {
    if (step === 'code') {
      // Se estiver na tela de código, volta para a tela de email
      setStep('email');
      setCode(['', '', '', '']);
    } else {
      router.back();
    }
  };

  const getBorderColor = (field: string, value: string) =>
    focusedField === field || value ? '#E7003B' : '#ccc';

  const [isLoading, setIsLoading] = useState(false);

  // Validação e envio do email
  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o campo de e-mail.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/password/forgot', { email });
      Alert.alert('Código enviado', 'Verifique seu e-mail e insira o código de 4 dígitos.', [
        { text: 'OK', onPress: () => setStep('code') },
      ]);
    } catch (error: any) {
      Alert.alert('Erro', error.message ?? 'Não foi possível enviar o código.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para lidar com mudança nos inputs do código
  const handleCodeChange = (text: string, index: number) => {
    if (/^\d*$/.test(text)) { // aceita só dígitos ou vazio
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      if (text.length === 1 && index < inputsRef.length - 1) {
        inputsRef[index + 1].current?.focus();
      }
    }
  };

  // Verificar código — navega para redefinir senha passando email e código como params
  const handleVerifyCode = () => {
    const enteredCode = code.join('');
    if (enteredCode.length < 4) {
      Alert.alert('Código incompleto', 'Por favor, preencha os 4 dígitos do código.');
      return;
    }

    router.push({
      pathname: '/screens/NewPassword',
      params: { email, code: enteredCode },
    });
  };


  if (!fontsLoaded) return null;

  // Step de e-mail: mantém scroll pois o teclado pode cobrir o input
  if (step === 'email') {
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
              <TouchableOpacity onPress={handleGoBack} style={[styles.backButton, { top: insets.top + 12 }]}>
                <Ionicons name="arrow-back" size={28} color="#E7003B" />
              </TouchableOpacity>

              <View style={[styles.header, { marginTop: insets.top + 80 }]}>
                <Text style={styles.titleBig}>LEGACY</Text>
              </View>

              <View style={styles.content}>
                <Text style={styles.titleSmal}>Esqueceu sua senha?</Text>

                <View style={[styles.inputContainer, { borderColor: getBorderColor('email', email) }]}>
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
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <Text style={styles.MessageText}>
                  Enviaremos um código de {'\n'} recuperação para seu e-mail
                </Text>

                <TouchableOpacity style={styles.SendButton} onPress={handleSendEmail} disabled={isLoading}>
                  {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.SendText}>Enviar</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // Step do código: layout fixo igual ao RegisterUserScreen — teclado não empurra nada
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoBack} style={[styles.backButton, { top: insets.top + 12 }]}>
          <Ionicons name="arrow-back" size={28} color="#E7003B" />
        </TouchableOpacity>

        <View style={[styles.header, { marginTop: insets.top + 80 }]}>
          <Text style={styles.titleBig}>LEGACY</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.titleSmal, { marginBottom: 40, marginTop: 20 }]}>
            Insira o código que enviamos para seu e-mail
          </Text>

          <View style={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputsRef[index]}
                style={styles.codeInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                returnKeyType="next"
                onSubmitEditing={() => {
                  if (index < inputsRef.length - 1) {
                    inputsRef[index + 1].current?.focus();
                  }
                }}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.SendButton} onPress={handleVerifyCode} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.SendText}>Verificar</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={async () => {
            try {
              await api.post('/password/forgot', { email });
              Alert.alert('Código reenviado', 'Um novo código foi enviado para seu e-mail.');
            } catch {
              Alert.alert('Erro', 'Não foi possível reenviar o código.');
            }
          }}>
            <Text style={{ textAlign: 'center' }}>
              <Text style={{ color: '#B0B0B0' }}>Não recebeu o código? </Text>
              <Text style={{ color: '#E7003B', textDecorationLine: 'underline' }}>Reenviar código</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    left: 20,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
  },
  titleBig: {
    fontSize: 42,
    fontFamily: 'Roboto_900Black',
    color: '#E7003B',
    marginBottom: 20,
  },
  titleSmal: {
    textAlign: 'center',
    fontSize: 20,
    color: '#B0B0B0',
    marginBottom: 30,
  },
  content: {
    width: '100%',
    marginTop: 120,
    alignItems: 'center',
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
  MessageText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#B0B0B0',
    marginTop: 10,
    marginBottom: 20,
  },
  SendButton: {
    backgroundColor: '#E7003B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  SendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 30,
  },
  codeInput: {
    borderBottomWidth: 2,
    borderColor: '#E7003B',
    width: 50,
    fontSize: 24,
    textAlign: 'center',
    color: '#000',
  },
  resendText: {
    color: '#E7003B',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
