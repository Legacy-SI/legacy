import { Roboto_900Black, useFonts } from '@expo-google-fonts/roboto';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
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

  // Validação e envio do email
  const handleSendEmail = () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha o campo de e-mail.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('E-mail inválido', 'Digite um e-mail válido.');
      return;
    }

    // Simular envio do código e mostrar alerta
    Alert.alert('Sucesso', 'Código de recuperação enviado para seu e-mail.', [
      {
        text: 'OK',
        onPress: () => setStep('code'),  // Trocar a tela só depois que usuário clicar OK
      },
    ]);
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

    // Verificar código
    const handleVerifyCode = () => {
    const enteredCode = code.join('');
    if (enteredCode.length < 4) {
        Alert.alert('Código incompleto', 'Por favor, preencha os 4 dígitos do código.');
        return;
    }

    // Aqui você faria a validação do código via API, etc.
    Alert.alert('Sucesso', 'Código verificado com sucesso!', [
        {
        text: 'OK',
            onPress: () => router.push('./NewPassword'),
        },
    ]);
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
            {/* Botão voltar */}
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={28} color="#E7003B" />
            </TouchableOpacity>

            {/* Título */}
            <View style={styles.header}>
              <Text style={styles.titleBig}>LEGACY</Text>
            </View>

            {step === 'email' ? (
              // Tela - Envio de E-mail de Recuperação de Senha
              <View style={styles.content}>
                <View>
                  <Text style={styles.titleSmal}>Esqueceu sua senha ?</Text>
                </View>

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
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <Text style={styles.MessageText}>
                  Enviaremos um código de {'\n'} recuperação para seu e-mail
                </Text>

                <TouchableOpacity style={styles.SendButton} onPress={handleSendEmail}>
                  <Text style={styles.SendText}>Enviar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Tela - Verificação de Código
              <View style={styles.content}>
                <Text style={[styles.titleSmal, { marginBottom: 40, marginTop: 20, color: '#B0B0B0', textAlign: 'center' }]}>
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

                <TouchableOpacity style={styles.SendButton} onPress={handleVerifyCode}>
                  <Text style={styles.SendText}>Verificar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                // Adicionar Back-end - Reenviar Código
                    Alert.alert('Código reenviado', 'Um novo código foi enviado para seu e-mail.');
                }}>
                    <Text style={{ textAlign: 'center' }}>
                        <Text style={{ color: '#B0B0B0' }}>Não recebeu o código? </Text>
                        <Text style={{ color: '#E7003B', textDecorationLine: 'underline' }}>Reenviar código</Text>
                    </Text>
                </TouchableOpacity>
              </View>
            )}
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
