import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Para os ícones dos perfis

interface User {
  id: number;
  name: string;
  profile: string;
  status: boolean;
}

const UsuariosScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation();

  // Função para buscar usuários da API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://10.0.3.217:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  // Função para alternar o status do usuário
  const toggleUserStatus = async (id: number) => {
    try {
      const response = await axios.patch(`http://10.0.3.217:3000/users/${id}/toggle-status`);
      const updatedUser = response.data;
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, status: updatedUser.status } : user))
      );
    } catch (error) {
      Alert.alert('Erro', 'Erro ao alterar status do usuário.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Renderizando cada item (usuário) na FlatList
  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CadastroUsuario', { userId: item.id })} // Navegar para edição de usuário
      style={[
        styles.card,
        item.status ? styles.activeCard : styles.inactiveCard, // Aplica a borda verde ou fundo vermelho
      ]}
    >
      <View style={styles.userInfo}>
        <FontAwesome
          name={item.profile === 'motorista' ? 'motorcycle' : 'building'}
          size={24}
          color="#143d59" // Azul escuro para o ícone
        />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      <Switch
        value={item.status}
        onValueChange={() => toggleUserStatus(item.id)} // Alternar o status do usuário
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CadastroUsuario')} // Navegar para a tela de cadastro de usuário
      >
        <Text style={styles.addButtonText}>Novo usuário</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#143d59', // Fundo azul escuro
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeCard: {
    borderColor: 'green',
    borderWidth: 2,
  },
  inactiveCard: {
    backgroundColor: '#ffcccc',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#f4b41a', // Amarelo para o nome
  },
  addButton: {
    backgroundColor: '#f4b41a', // Botão de novo usuário em amarelo
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#143d59', // Texto do botão em azul escuro
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UsuariosScreen;
