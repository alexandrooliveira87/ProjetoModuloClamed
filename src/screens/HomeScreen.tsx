import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { FontAwesome } from '@expo/vector-icons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userProfile, setUserProfile] = useState('');

  const fetchUserData = async () => {
    const name = await AsyncStorage.getItem('userName');
    const profile = await AsyncStorage.getItem('userProfile');
    if (name && profile) {
      setUserName(name);
      setUserProfile(profile);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header com imagem de perfil */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }} 
          style={styles.profileImage}
        />
        <Text style={styles.greeting}>Olá, {userName}</Text>
      </View>

      {/* Card para Estoque */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome name="cube" size={32} color="#333" />
          <Text style={styles.cardText}>Estoque</Text>
        </View>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('ListaProdutos')} 
        >
          <Text style={styles.manageButtonText}>Gerenciar</Text>
        </TouchableOpacity>
      </View>

      {/* Card para Usuários */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome name="user" size={32} color="#333" />
          <Text style={styles.cardText}>Usuários</Text>
        </View>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('Usuarios')} 
        >
          <Text style={styles.manageButtonText}>Gerenciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#E8E8E8',
    padding: 10,
    borderRadius: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  manageButton: {
    backgroundColor: '#9D49F2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
