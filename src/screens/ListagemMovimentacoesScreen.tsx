import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

interface Movimentacao {
  id: number;
  origem: {
    nome: string;
    latitude: number;
    longitude: number;
  };
  destino: {
    nome: string;
    latitude: number;
    longitude: number;
  };
  produto: {
    nome: string;
    imagem: string;
  };
  quantidade: number;
  status: string;
}

const ListagemMovimentacoesScreen: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const navigation = useNavigation();

  // Função para buscar a lista de movimentações
  const buscarMovimentacoes = async () => {
    try {
      const resposta = await axios.get('http://10.0.3.217:3000/movements');
      console.log("Dados da API:", resposta.data);
      setMovimentacoes(resposta.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar movimentações');
    }
  };

  useEffect(() => {
    buscarMovimentacoes();
  }, []);

  const renderizarItemMovimentacao = ({ item }: { item: Movimentacao }) => (
    <View style={estilos.cartaoMovimentacao}>
      <Text style={estilos.texto}>Origem: {item.origem.nome}</Text>
      <Text style={estilos.texto}>Destino: {item.destino.nome}</Text>
      <Text style={estilos.texto}>Produto: {item.produto.nome}</Text>
      <Image source={{ uri: item.produto.imagem }} style={estilos.imagemProduto} />
      <Text style={estilos.texto}>Quantidade: {item.quantidade}</Text>
      <Text style={estilos.texto}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={estilos.container}>
      <FlatList
        data={movimentacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderizarItemMovimentacao}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhuma movimentação encontrada</Text>}
      />

      <TouchableOpacity
        style={estilos.botaoAdicionar}
        onPress={() => navigation.navigate('CadastroMovimentacao')}
      >
        <Text style={estilos.textoBotaoAdicionar}>Adicionar Nova Movimentação</Text>
      </TouchableOpacity>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  lista: {
    paddingBottom: 16,
  },
  cartaoMovimentacao: {
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  texto: {
    fontSize: 16,
    color: '#143d59',
    marginBottom: 4,
  },
  textoVazio: {
    color: '#143d59',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  imagemProduto: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginVertical: 8,
  },
  botaoAdicionar: {
    backgroundColor: '#143d59',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotaoAdicionar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ListagemMovimentacoesScreen;
