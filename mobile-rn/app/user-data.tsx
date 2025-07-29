import { useAuth } from '@/src/entities/auth/model/auth-context';
import { AppButton } from '@/src/shared/Button/AppButton';
import { Input } from '@/src/shared/Input/Input';
import { Colors, Fonts } from '@/src/shared/tokens';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import BackIcon from '@/assets/icons/back';

export default function UserData() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [nickname, setNickname] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string | null>(null);
  
  const { register, isLoading, error } = useAuth();

  const handleRegister = async () => {
    try {
      // Сбрасываем предыдущие ошибки
      setValidationErrors({});
      setFormError(null);
      
      // Проверка заполненности обязательных полей
      const errors: Record<string, boolean> = {};
      if (!firstName.trim()) errors.firstName = true;
      if (!lastName.trim()) errors.lastName = true;
      if (!city.trim()) errors.city = true;
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setFormError('Пожалуйста, заполните обязательные поля');
        return;
      }
      
      // Отправка данных для регистрации
      await register({
        firstName,
        lastName,
        city,
        birthdate,
        nickname
      });
      
      // Переход на главный экран после успешной регистрации
      router.replace('/(app)');
    } catch (err) {
      console.error('Ошибка регистрации', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.lightBackground} />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <BackIcon style={styles.backButtonIcon} stroke={Colors.linkGreen} />
        <Text style={styles.backLinkText}>Вернуться</Text>
      </TouchableOpacity>
      
      <View style={styles.container}>
        <Text style={styles.title}>Данные пользователя</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Имя</Text>
            <Input 
              placeholder="Введите свое имя"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                if (validationErrors.firstName) {
                  setValidationErrors({...validationErrors, firstName: false});
                }
              }}
              autoCapitalize="words"
              isInvalid={validationErrors.firstName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Фамилия</Text>
            <Input 
              placeholder="Введите свою фамилию"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                if (validationErrors.lastName) {
                  setValidationErrors({...validationErrors, lastName: false});
                }
              }}
              autoCapitalize="words"
              isInvalid={validationErrors.lastName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Город</Text>
            <Input 
              placeholder="Введите город"
              value={city}
              onChangeText={(text) => {
                setCity(text);
                if (validationErrors.city) {
                  setValidationErrors({...validationErrors, city: false});
                }
              }}
              autoCapitalize="words"
              isInvalid={validationErrors.city}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Дата рождения</Text>
            <Input 
              placeholder="Введите дату рождения"
              value={birthdate}
              onChangeText={setBirthdate}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Введите никнейм</Text>
            <Input 
              placeholder="abcdef2001"
              value={nickname}
              onChangeText={setNickname}
            />
          </View>
        </View>
        
        {(error || formError) && (
          <Text style={styles.errorText}>{formError || error}</Text>
        )}
        
        <View style={styles.buttonContainer}>
          <AppButton 
            text="Зарегистрироваться" 
            onPress={handleRegister} 
            isLoading={isLoading}
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
    paddingBottom: 20,
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
  backButtonIcon: {
    marginRight: 5,
    width: 19,
  },
  backLinkText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.linkGreen,
    fontWeight: '400',
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: 32,
    color: Colors.inputText,
    marginTop: 80,
    marginBottom: 24,
    textAlign: 'center',
  },
  formContainer: {
    gap: 24,
    marginTop: 20,
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
  buttonContainer: {
    marginTop: 32,
  },
});
