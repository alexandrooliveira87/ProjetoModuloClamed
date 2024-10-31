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

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login'); // Substitui a tela atual pela tela de Login
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header com imagem de perfil e botão de logout */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }} 
          style={styles.profileImage}
        />
        <Text style={styles.greeting}>Olá, {userName}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Card para Estoque */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome name="cube" size={32} color="#f4b41a" />
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
          <FontAwesome name="user" size={32} color="#f4b41a" />
          <Text style={styles.cardText}>Usuários</Text>
        </View>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('Usuarios')} 
        >
          <Text style={styles.manageButtonText}>Gerenciar</Text>
        </TouchableOpacity>
      </View>

      {/* Card para Listagem de Movimentações */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome name="list-alt" size={32} color="#f4b41a" />
          <Text style={styles.cardText}>Listagem de Movimentações</Text>
        </View>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('ListagemMovimentacoes')} 
        >
          <Text style={styles.manageButtonText}>Verificar</Text>
        </TouchableOpacity>
      </View>

      {/* Card para Cadastro de Movimentações */}
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <FontAwesome name="plus-square" size={32} color="#f4b41a" />
          <Text style={styles.cardText}>Cadastro de Movimentações</Text>
        </View>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('CadastroMovimentacao')} 
        >
          <Text style={styles.manageButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#143d59',  // Cor de fundo
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Alinha os itens ao longo da linha
    marginVertical: 20,
    backgroundColor: '#f4b41a',  // Cor de fundo do cabeçalho
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
    color: '#143d59',  // Cor do texto
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#143d59',  // Cor do botão de logout
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#f4b41a',  // Cor do texto do botão de logout
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
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
    flexWrap: 'wrap', // Permite que o texto quebre em várias linhas
  },
  cardText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#f4b41a',  // Cor do texto
    maxWidth: 180, // Define um limite de largura para o texto
  },
  manageButton: {
    backgroundColor: '#f4b41a',  // Cor do botão
    paddingVertical: 10,
    width: 120,  // Largura fixa para todos os botões
    borderRadius: 8,
    alignItems: 'center', // Centraliza o texto no botão
  },
  manageButtonText: {
    color: '#143d59',  // Cor do texto do botão
    fontWeight: 'bold',
  },
});

export default HomeScreen;
