import { useVerifyCode } from '@/src/features/verify-code/model/use-verify-code';
import { useResendCode } from '@/src/features/resend-code/model/use-resend-code';
import { AppButton } from '@/src/shared/ui/Button/AppButton';
import { Colors, Fonts } from '@/src/shared/tokens';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { BackButton } from '@/src/shared/ui/BackButton';
import { CodeInput } from '@/src/shared/ui/CodeInput';
import { router } from 'expo-router';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { verifyCode, isLoading, error } = useVerifyCode();
  const { resendCode, isLoading: isResending } = useResendCode();
  
  // Email адрес (в реальном приложении можно хранить в параметрах навигации или в хранилище)
  const email = 'эл. почту';

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  const handleResendCode = async () => {
    if (!canResend) return;
    
    try {
      await resendCode();
      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      console.error('Ошибка при повторной отправке кода', err);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 4) return;
    
    try {
      await verifyCode(code);
      // Маршрутизация происходит внутри хука useVerifyCode
    } catch (err) {
      console.error('Ошибка при проверке кода', err);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lightBackground} />
      
      <BackButton style={styles.backButton} />
      
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Код подтверждения</Text>
          <Text style={styles.subtitle}>
            Введите код, отправленный на {email}
          </Text>
        </View>

        <CodeInput 
          value={code}
          onChangeText={setCode}
          length={4}
          autoFocus
          isError={!!error}
          style={styles.codeInput}
        />

        <View style={styles.resendContainer}>
          <TouchableOpacity 
            disabled={!canResend} 
            onPress={handleResendCode}
            activeOpacity={0.7}
          >
            <Text style={[styles.resendText, canResend && styles.activeResendText]}>
              Отправить снова
            </Text>
          </TouchableOpacity>
          
          {!canResend && (
            <Text style={styles.resendText}>
              через {formatTime(timeLeft)}
            </Text>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <AppButton
            text="Далее"
            onPress={handleVerifyCode}
            isLoading={isLoading}
            disabled={code.length < 4}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 85,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16, // Ближе к верхнему краю
    left: 16, // Ближе к левому краю
    zIndex: 10,
  },
  title: {
    fontFamily: Fonts.bold, // Теперь смело используем bold после добавления шрифта
    fontSize: 32,
    color: Colors.inputText,
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f16,
    color: Colors.textGray,
    textAlign: 'center',
  },
  codeInput: {
    marginTop: 60,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 24,
  },
  resendText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f16,
    color: Colors.placeholderGray,
  },
  activeResendText: {
    color: Colors.linkGreen,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 32,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f14,
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
});
