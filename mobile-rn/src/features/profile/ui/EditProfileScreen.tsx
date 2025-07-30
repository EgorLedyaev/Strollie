import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeftIcon from '@/assets/icons/arrow-left';
import { Colors, Fonts, Radius } from '@/src/shared/tokens';
import { AppButton } from '@/src/shared/Button/AppButton';
import { useNavigation } from 'expo-router';
import { User } from '@/src/entities/user/model/user.model';
import { ProfileField } from './ProfileField';

interface EditProfileProps {
  user: User;
  onSave: (userData: UserProfileData) => void;
}

export interface UserProfileData {
  firstName: string;
  lastName: string;
  middleName: string;
  nickname: string;
  city: string;
  birthDate: string;
  aboutMe?: string;
}

export const EditProfileScreen: React.FC<EditProfileProps> = ({ user, onSave }) => {
  const navigation = useNavigation();
  
  // Начальные данные из пользовательского профиля или заглушка
  const [userData, setUserData] = useState<UserProfileData>({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    middleName: user.middleName || '',
    nickname: user.nickname || user.email || '',
    city: user.city || '',
    birthDate: user.birthDate || '',
    aboutMe: user.aboutMe || '',
  });

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(userData);
    // Не используем navigation.goBack() так как onSave сам переключает состояние на экране профиля
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text style={styles.title}>Редактирование</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}></View>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formContent}>
          <ProfileField
            label="Имя"
            value={userData.firstName}
            onChangeText={(value) => handleChange('firstName', value)}
          />
          
          <ProfileField
            label="Фамилия"
            value={userData.lastName}
            onChangeText={(value) => handleChange('lastName', value)}
          />
          
          <ProfileField
            label="Отчество"
            value={userData.middleName}
            onChangeText={(value) => handleChange('middleName', value)}
          />
          
          <ProfileField
            label="Никнейм"
            value={userData.nickname}
            onChangeText={(value) => handleChange('nickname', value)}
          />
          
          <ProfileField
            label="Город"
            value={userData.city}
            onChangeText={(value) => handleChange('city', value)}
          />
          
          <ProfileField
            label="Дата рождения"
            value={userData.birthDate}
            onChangeText={(value) => handleChange('birthDate', value)}
          />
          
          <ProfileField
            label="О себе"
            value={userData.aboutMe || ''}
            onChangeText={(value) => handleChange('aboutMe', value)}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <AppButton text="Сохранить изменения" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  placeholder: {
    width: 24,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.black,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.gray,
  },
  formContainer: {
    flex: 1,
  },
  formContent: {
    backgroundColor: Colors.white,
    margin: 10,
    borderRadius: Radius.r15,
    padding: 10,
  },
  buttonContainer: {
    padding: 16,
  }
});
