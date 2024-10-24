import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';  // Para os ícones

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
    <View
      style={[
        styles.card,
        item.status ? styles.activeCard : styles.inactiveCard, // Aplica a borda verde ou fundo vermelho
      ]}
    >
      <View style={styles.userInfo}>
        <FontAwesome5 name={item.status ? 'user-check' : 'user-times'} size={24} color={item.status ? '#f4b41a' : '#D9534F'} />
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      <View style={styles.userSwitch}>
        <Switch
          value={item.status}
          onValueChange={() => toggleUserStatus(item.id)} // Alternar o status do usuário
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Botão de adicionar novo usuário */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CadastroUsuario')} // Navegar para a tela de cadastro de usuário
      >
        <Text style={styles.addButtonText}>Novo usuário</Text>
      </TouchableOpacity>

      {/* Lista de usuários */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2} // Exibe em duas colunas
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#143d59',  // Fundo da tela atualizado
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 8,
    borderRadius: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: '45%', // Para ajustar o espaçamento
  },
  activeCard: {
    borderColor: '#f4b41a',
    borderWidth: 2,
    backgroundColor: '#eae4d4',  // Cor de fundo dos cartões ativos
  },
  inactiveCard: {
    backgroundColor: '#FFE0E0', // Cor de fundo dos cartões inativos
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#f4b41a',  // Cor do texto
  },
  userSwitch: {
    marginLeft: 10,
  },
  addButton: {
    backgroundColor: '#f4b41a', // Cor do botão "Novo usuário"
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#143d59',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UsuariosScreen;
