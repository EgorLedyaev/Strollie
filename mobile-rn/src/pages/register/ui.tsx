import { useRegister } from '@/src/features/auth-by-email';
import { AppButton, CustomLink, Input } from '@/src/shared/ui';
import { Colors, Fonts } from '@/src/shared/tokens';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const { registerEmail, isLoading, error } = useRegister();

  const handleRegister = async () => {
    await registerEmail(email);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lightBackground} />
      <View style={styles.container}>
        <Text style={styles.title}>Регистрация</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <Input 
              placeholder="Введите свою эл.почту"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <AppButton 
            text="Далее" 
            onPress={handleRegister} 
            isLoading={isLoading}
          />
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Уже зарегистрированы?</Text>
          <CustomLink href="/sign-in" text="Войти" />
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
    paddingBottom: 20,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: Colors.inputText,
    marginTop: 154,
    alignSelf: 'center',
  },
  formContainer: {
    gap: 32,
    marginTop: 187
  },
  inputGroup: {
    gap: 12,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.f16,
    color: Colors.inputText,
    marginLeft: 16,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f14,
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f16,
    color: Colors.textGray,
  },
});
