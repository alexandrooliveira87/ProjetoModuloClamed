import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

const CadastroUsuarioScreen: React.FC = () => {
  const [dadosUsuario, setDadosUsuario] = useState({
    profile: 'motorista',
    name: '',
    document: '',
    full_address: '',
    email: '',
    password: '',
    confirmarSenha: '',
  });

  const salvarUsuario = async () => {
    const { name, document, full_address, email, password, confirmarSenha, profile } = dadosUsuario;

    if (!name || !document || !full_address || !email || !password || !confirmarSenha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }
    if (password !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não conferem');
      return;
    }

    console.log('Dados enviados:', { profile, name, document, full_address, email, password });

    try {
      const resposta = await axios.post(
        'http://192.168.5.113:3000/register',
        { profile, name, document, full_address, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (resposta.status === 201) {
        Alert.alert('Sucesso', 'Usuário cadastrado com sucesso');
        setDadosUsuario({
          profile: 'motorista',
          name: '',
          document: '',
          full_address: '',
          email: '',
          password: '',
          confirmarSenha: '',
        });
      }
    } catch (erro: any) {
      if (erro.response) {
        console.error('Erro do servidor:', erro.response.data);
        Alert.alert('Erro', erro.response.data.error || 'Erro ao cadastrar usuário');
      } else if (erro.request) {
        Alert.alert('Erro', 'Não foi possível se conectar ao servidor');
      } else {
        Alert.alert('Erro', 'Erro ao processar o cadastro');
      }
      console.error('Detalhes do erro:', erro);
    }
  };

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={estilos.textoCabecalho}>Criar Usuário</Text>
        <View style={estilos.containerPerfil}>
          <TouchableOpacity
            style={[estilos.opcaoPerfil, dadosUsuario.profile === 'motorista' && estilos.selecionado]}
            onPress={() => setDadosUsuario({ ...dadosUsuario, profile: 'motorista' })}
          >
            <FontAwesome name="motorcycle" size={24} color={dadosUsuario.profile === 'motorista' ? '#143d59' : '#aaa'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[estilos.opcaoPerfil, dadosUsuario.profile === 'filial' && estilos.selecionado]}
            onPress={() => setDadosUsuario({ ...dadosUsuario, profile: 'filial' })}
          >
            <FontAwesome name="building" size={24} color={dadosUsuario.profile === 'filial' ? '#143d59' : '#aaa'} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={estilos.entrada}
          placeholder="Nome completo"
          placeholderTextColor="#FFFFFF"
          value={dadosUsuario.name}
          onChangeText={(texto) => setDadosUsuario({ ...dadosUsuario, name: texto })}
        />

        <TextInput
          style={estilos.entrada}
          placeholder={dadosUsuario.profile === 'motorista' ? 'CPF' : 'CNPJ'}
          placeholderTextColor="#FFFFFF"
          value={dadosUsuario.document}
          onChangeText={(texto) => setDadosUsuario({ ...dadosUsuario, document: texto })}
        />
        
        <TextInput
          style={estilos.entrada}
          placeholder="Endereço Completo"
          placeholderTextColor="#FFFFFF"
          value={dadosUsuario.full_address}
          onChangeText={(texto) => setDadosUsuario({ ...dadosUsuario, full_address: texto })}
        />

        <Text style={estilos.cabecalhoSecao}>Dados de login</Text>
        <TextInput
          style={estilos.entrada}
          placeholder="Email"
          placeholderTextColor="#FFFFFF"
          value={dadosUsuario.email}
          onChangeText={(texto) => setDadosUsuario({ ...dadosUsuario, email: texto })}
          keyboardType="email-address"
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Senha"
          placeholderTextColor="#FFFFFF"
          value={dadosUsuario.password}
          onChangeText={(texto) => setDadosUsuario({ ...dadosUsuario, password: texto })}
          secureTextEntry
        />
        <TextInput
          style={estilos.entrada}
          placeholder="Confirme a senha"
          placeholderTextColor="#FFFFFF"
          value={dadosUsuario.confirmarSenha}
          onChangeText={(texto) => setDadosUsuario({ ...dadosUsuario, confirmarSenha: texto })}
          secureTextEntry
        />

        <TouchableOpacity style={estilos.botao} onPress={salvarUsuario}>
          <Text style={estilos.textoBotao}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#143d59',
  },
  textoCabecalho: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  containerPerfil: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  opcaoPerfil: {
    padding: 15,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#f4b41a',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  selecionado: {
    backgroundColor: '#f4b41a',
  },
  entrada: {
    borderColor: '#f4b41a',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    color: '#fff',
  },
  cabecalhoSecao: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  botao: {
    backgroundColor: '#f4b41a',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CadastroUsuarioScreen;
