import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

// Interface para definir o tipo User, representando os dados de cada usuário
interface User {
  id: number;
  name: string;
  profile: string;
  status: boolean;
}

const UsuariosScreen: React.FC = () => {
  // Estado para armazenar a lista de usuários
  const [users, setUsers] = useState<User[]>([]);
  // Hook para navegação
  const navigation = useNavigation();

  // Função para buscar a lista de usuários da API
  const fetchUsers = async () => {
    try {
      // Faz uma requisição GET para a API e armazena a resposta no estado
      const response = await axios.get('http://192.168.5.113:3000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error); // Loga o erro no console
    }
  };

  // Função para alternar o status de um usuário específico
  const toggleUserStatus = async (id: number) => {
    try {
      // Faz uma requisição PATCH para atualizar o status do usuário na API
      const response = await axios.patch(`http://192.168.5.113:3000/users/${id}/toggle-status`);
      const updatedStatus = response.data.status;

      // Atualiza o estado local de usuários com o novo status do usuário específico
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: updatedStatus } : user
        )
      );
    } catch (error) {
      // Exibe um alerta se houver erro ao alterar o status
      Alert.alert('Erro', 'Erro ao alterar status do usuário.');
    }
  };

  // Hook useEffect para buscar usuários quando o componente for montado
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para renderizar cada item na lista de usuários
  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CadastroUsuario', { userId: item.id })}
      style={[
        styles.cartao,
        item.status ? styles.cartaoAtivo : styles.cartaoInativo,
      ]}
    >
      {/* Exibe o ícone e o nome do usuário */}
      <View style={styles.infoUsuario}>
        <FontAwesome
          name={item.profile === 'motorista' ? 'motorcycle' : 'building'}
          size={24}
          color="#143d59" // Cor do ícone azul escuro
        />
        <Text style={styles.nomeUsuario}>{item.name}</Text>
      </View>
      {/* Switch para alternar o status do usuário */}
      <Switch
        value={item.status}
        onValueChange={() => toggleUserStatus(item.id)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* FlatList para exibir a lista de usuários */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
      />
      {/* Botão para adicionar um novo usuário */}
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate('CadastroUsuario')}
      >
        <Text style={styles.textoBotaoAdicionar}>Novo usuário</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos para os elementos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#143d59', // Cor de fundo azul escuro
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
    backgroundColor: '#FFF', // Fundo branco do cartão
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cartaoAtivo: {
    borderColor: 'green', // Borda verde para usuários ativos
    borderWidth: 2,
  },
  cartaoInativo: {
    backgroundColor: '#ffcccc', // Fundo vermelho claro para usuários inativos
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
    color: '#111', // Cor do texto do nome do usuário
  },
  botaoAdicionar: {
    backgroundColor: '#f4b41a', // Fundo amarelo para o botão de adicionar
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoAdicionar: {
    color: '#143d59', // Texto azul escuro no botão de adicionar
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UsuariosScreen;
