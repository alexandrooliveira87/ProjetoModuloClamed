import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { RootStackParamList } from '../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://10.0.3.217:3000/login', { email, password });
      if (response.status === 200) {
        Alert.alert('Sucesso', `Bem-vindo, ${response.data.name}`);

        // Armazenando o nome e perfil no AsyncStorage
        await AsyncStorage.setItem('userName', response.data.name);
        await AsyncStorage.setItem('userProfile', response.data.profile);

        // Navegar para a tela Home
        navigation.navigate('Home');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Erro', 'Credenciais inválidas');
      } else {
        Alert.alert('Erro', 'Erro no servidor');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="******"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#143d59', // Cor de fundo
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#f4b41a', // Cor do texto das labels
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: '#f4b41a', // Borda amarela
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#f4b41a', // Cor do botão
    paddingVertical: 15,
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#143d59', // Cor do texto do botão
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
