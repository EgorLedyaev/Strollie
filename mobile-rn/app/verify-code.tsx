import { useAuth } from '@/src/entities/auth/model/auth-context';
import { AppButton } from '@/src/shared/Button/AppButton';
import { Colors, Fonts } from '@/src/shared/tokens';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Pressable,
  StatusBar,
} from 'react-native';
import BackIcon from '@/assets/icons/back';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { verifyCode, resendCode, isLoading, error, userInfo } = useAuth();
  
  // Email адрес из контекста аутентификации
  const email = userInfo?.email || 'эл. почту';

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

  const handleSubmit = async () => {
    if (code.length < 4) return;
    
    try {
      const success = await verifyCode(code);
      if (success) {
        // Проверяем, является ли текущая сессия регистрацией по контексту userInfo
        // Если это регистрация, отправляем на заполнение данных
        // Иначе переходим в приложение
        const isRegistration = !userInfo?.firstName;
        
        if (isRegistration) {
          router.push('/user-data');
        } else {
          router.replace('/(app)');
        }
      }
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
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <BackIcon style={styles.backButtonArrow} stroke={Colors.linkGreen} />
        <Text style={styles.backButtonText}>Вернуться</Text>
      </TouchableOpacity>
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Код подтверждения</Text>
          <Text style={styles.subtitle}>
            Введите код, отправленный на {email}
          </Text>
        </View>

        <View style={styles.codeContainer}>
          {[0, 1, 2, 3].map((index) => (
            <View 
              key={index} 
              style={[
                styles.codeBox, 
                index < code.length ? styles.codeBoxFilled : null,
                error ? styles.codeBoxError : null
              ]}
            >
              {index < code.length && (
                <Text style={styles.codeText}>{code[index]}</Text>
              )}
            </View>
          ))}
          
          <TextInput
            style={styles.hiddenInput}
            value={code}
            onChangeText={(text: string) => setCode(text.slice(0, 4))}
            maxLength={4}
            keyboardType="number-pad"
            autoFocus
          />
        </View>

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
            onPress={handleSubmit}
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
    top: 69,
    left: 26,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 101,
    height: 20,
  },
  backButtonArrow: {
    marginRight: 5,
    width: 19,
  },
  backButtonText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.linkGreen,
    fontWeight: '400',
  },
  title: {
    fontFamily: Fonts.semibold,
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 60,
    position: 'relative',
  },
  codeBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  codeBoxFilled: {
    borderColor: Colors.successGreen,
  },
  codeBoxError: {
    borderColor: Colors.error,
  },
  codeText: {
    fontFamily: Fonts.medium,
    fontSize: 24,
    color: Colors.inputText,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
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
