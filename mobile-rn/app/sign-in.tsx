import { useLogin } from '@/src/features/auth-by-email/model/use-login';
import { AppButton } from '@/src/shared/ui';
import { CustomLink } from '@/src/shared/ui';
import { Input } from '@/src/shared/ui';
import { Colors, Fonts } from '@/src/shared/tokens';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const { loginWithEmail, isLoading, error } = useLogin();

  const handleSignIn = async () => {
    await loginWithEmail(email);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lightBackground} />
      <View style={styles.container}>
        <Text style={styles.title}>Вход</Text>
        
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
            text="Войти" 
            onPress={handleSignIn} 
            isLoading={isLoading}
          />
        </View>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Нет аккаунта?</Text>
          <CustomLink href="/register" text="Зарегистрироваться" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: 32,
    color: "#484848",
    marginTop: 95,
    alignSelf: 'center'
  },
  formContainer: {
    gap: 32,
    marginBottom: 20,
    marginTop: 147
  },
  inputGroup: {
    gap: 12
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: Fonts.f16,
    color: "#484848",
    marginLeft: 16
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: Fonts.f14,
    color: Colors.error,
    marginTop: 16,
    textAlign: 'center'
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  separatorLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.gray,
  },
  separatorText: {
    marginHorizontal: 10,
    color: Colors.darkGray,
    fontFamily: Fonts.regular,
  },
  socialContainer: {
    marginBottom: 30,
  },
  socialText: {
    textAlign: 'center',
    color: Colors.lightGray,
    paddingBottom: 16,
    fontFamily: Fonts.regular,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    backgroundColor: Colors.gray,
    width: 110,
    height: 54,
    borderRadius: 15,
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
    color: Colors.textGray
  }
});
