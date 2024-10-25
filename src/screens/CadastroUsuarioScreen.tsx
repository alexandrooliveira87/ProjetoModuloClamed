import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import axios from 'axios';
import { RootStackParamList } from '../types';

type CadastroUsuarioScreenRouteProp = RouteProp<RootStackParamList, 'CadastroUsuario'>;

const CadastroUsuarioScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<CadastroUsuarioScreenRouteProp>();
  const { userId } = route.params || {}; // Obtém o userId, se houver

  const [userData, setUserData] = useState({
    profile: 'motorista', // Padrão inicial
    name: '',
    document: '',
    full_address: '',
    email: '',
    password: '',
  });

  // Verifica se é edição e carrega dados do usuário existente
  useEffect(() => {
    if (userId) {
      axios
        .get(`http://10.0.3.217:3000/users/${userId}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          Alert.alert('Erro', 'Erro ao carregar dados do usuário');
        });
    }
  }, [userId]);

  const handleSave = async () => {
    const { name, document, full_address, email, password } = userData;
    if (!name || !document || !full_address || !email || !password) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    if (userId) {
      // Atualização de usuário existente
      axios
        .patch(`http://10.0.3.217:3000/users/${userId}`, userData)
        .then(() => {
          Alert.alert('Sucesso', 'Usuário atualizado com sucesso');
          navigation.goBack(); // Voltar para a tela anterior
        })
        .catch((error) => {
          Alert.alert('Erro', 'Erro ao atualizar usuário');
          console.error(error);
        });
    } else {
      // Cadastro de novo usuário
      axios
        .post('http://10.0.3.217:3000/register', userData)
        .then((response) => {
          Alert.alert('Sucesso', 'Usuário cadastrado com sucesso');
          navigation.goBack();
        })
        .catch((error) => {
          Alert.alert('Erro', 'Erro ao cadastrar usuário');
          console.error(error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Perfil</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity
          style={[styles.profileOption, userData.profile === 'motorista' && styles.selected]}
          onPress={() => setUserData({ ...userData, profile: 'motorista' })}
        >
          <Text style={styles.profileText}>Motorista</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.profileOption, userData.profile === 'filial' && styles.selected]}
          onPress={() => setUserData({ ...userData, profile: 'filial' })}
        >
          <Text style={styles.profileText}>Filial</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={userData.name}
        onChangeText={(text) => setUserData({ ...userData, name: text })}
      />

      <Text style={styles.label}>{userData.profile === 'motorista' ? 'CPF' : 'CNPJ'}</Text>
      <TextInput
        style={styles.input}
        value={userData.document}
        onChangeText={(text) => setUserData({ ...userData, document: text })}
      />

      <Text style={styles.label}>Endereço Completo</Text>
      <TextInput
        style={styles.input}
        value={userData.full_address}
        onChangeText={(text) => setUserData({ ...userData, full_address: text })}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={userData.email}
        onChangeText={(text) => setUserData({ ...userData, email: text })}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        value={userData.password}
        onChangeText={(text) => setUserData({ ...userData, password: text })}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{userId ? 'Atualizar' : 'Cadastrar'}</Text>
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
  label: {
    color: '#f4b41a',
    fontSize: 16,
    marginBottom: 8,
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  profileOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#f4b41a',
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#f4b41a',
  },
  profileText: {
    color: '#143d59',
    fontSize: 16,
  },
  input: {
    borderColor: '#f4b41a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#f4b41a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#143d59',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CadastroUsuarioScreen;
