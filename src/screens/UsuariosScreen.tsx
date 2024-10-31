import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

interface User {
  id: number;
  name: string;
  profile: string;
  status: boolean;
}

const UsuariosScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchName, setSearchName] = useState('');
  const [loadingStatus, setLoadingStatus] = useState<number | null>(null);
  const navigation = useNavigation();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.5.113:3000/users');
      setUsers(response.data);
      setFilteredUsers(response.data); // Inicializa a lista filtrada com todos os usuários
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  // Filtra os usuários com base no nome
  const handleFilter = () => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const toggleUserStatus = async (id: number) => {
    setLoadingStatus(id);

    try {
      const response = await axios.patch(`http://192.168.5.113:3000/users/${id}/toggle-status`);
      const updatedStatus = response.data.status;

      setUsers(prevUsers =>
        prevUsers.map(user => (user.id === id ? { ...user, status: updatedStatus } : user))
      );
      handleFilter();
      Alert.alert('Sucesso', 'Status do usuário atualizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao alterar status do usuário.');
    } finally {
      setLoadingStatus(null);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [searchName, users]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CadastroUsuario', { userId: item.id })}
      style={[styles.cartao, item.status ? styles.cartaoAtivo : styles.cartaoInativo]}
    >
      <View style={styles.infoUsuario}>
        <FontAwesome
          name={item.profile === 'motorista' ? 'motorcycle' : 'building'}
          size={24}
          color="#143d59"
        />
        <Text style={styles.nomeUsuario}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => toggleUserStatus(item.id)}
      >
        {loadingStatus === item.id ? (
          <ActivityIndicator size="small" color="#143d59" />
        ) : item.status ? (
          <MaterialIcons name="check-circle" size={24} color="green" />
        ) : (
          <MaterialIcons name="cancel" size={24} color="red" />
        )}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por nome"
        placeholderTextColor="#FFF"
        value={searchName}
        onChangeText={setSearchName}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
      />

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate('CadastroUsuario')}
      >
        <Text style={styles.textoBotaoAdicionar}>Novo usuário</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#143d59',
  },
  input: {
    backgroundColor: '#f4b41a',
    color: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  lista: {
    paddingBottom: 16,
  },
  cartao: {
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
  cartaoAtivo: {
    borderColor: 'green',
    borderWidth: 2,
  },
  cartaoInativo: {
    backgroundColor: '#ffcccc',
  },
  infoUsuario: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nomeUsuario: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#111',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAdicionar: {
    backgroundColor: '#f4b41a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoAdicionar: {
    color: '#143d59',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UsuariosScreen;
