import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

interface Movimentacao {
  id: number;
  origem: { nome: string };
  destino: { nome: string };
  produto: { nome: string; imagem: string };
  quantidade: number;
  status: string;
  historico: Array<{ descricao: string; data: string }>;
}

const ListagemMovimentacoesScreen: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [motorista, setMotorista] = useState('Nome do Motorista'); // Nome fixo do motorista para demonstração
  const navigation = useNavigation();

  const buscarMovimentacoes = async () => {
    try {
      const resposta = await axios.get('http://192.168.5.113:3000/movements');
      setMovimentacoes(resposta.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar movimentações');
    }
  };

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permita o acesso à câmera para continuar.');
        return;
      }

      const imageResult = await ImagePicker.launchCameraAsync();
      if (!imageResult.cancelled) {
        const formData = new FormData();
        formData.append('file', {
          uri: imageResult.uri,
          name: 'entrega.jpg',
          type: 'image/jpeg',
        });
        formData.append('motorista', motorista);

        const endpoint = novoStatus === 'Em Trânsito' ? `${id}/start` : `${id}/end`;
        const response = await axios.put(`http://192.168.5.113:3000/movements/${endpoint}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          setMovimentacoes((prevMovimentacoes) =>
            prevMovimentacoes.map((mov) =>
              mov.id === id ? { ...mov, status: novoStatus } : mov
            )
          );
          Alert.alert('Sucesso', `Status alterado para ${novoStatus}`);
        }
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao alterar status para ${novoStatus}`);
    }
  };

  useEffect(() => {
    buscarMovimentacoes();
  }, []);

  const renderizarItemMovimentacao = ({ item }: { item: Movimentacao }) => (
    <View style={estilos.cartaoMovimentacao}>
      <Image source={{ uri: item.produto.imagem }} style={estilos.imagemProduto} />
      <View style={estilos.infoContainer}>
        <Text style={estilos.textoTitulo}>{item.produto.nome}</Text>
        <Text style={estilos.quantidade}>{item.quantidade} Unidades</Text>
        <Text style={estilos.texto}>Origem: {item.origem.nome}</Text>
        <Text style={estilos.texto}>Destino: {item.destino.nome}</Text>
        <Text style={estilos.status}>Status: {item.status}</Text>
        
        <Text style={estilos.texto}>Histórico:</Text>
        {item.historico.map((hist, index) => (
          <Text key={index} style={estilos.historicoItem}>
            - {hist.descricao} - {new Date(hist.data).toLocaleString()}
          </Text>
        ))}

        <View style={estilos.botoesContainer}>
          {item.status === 'created' && (
            <TouchableOpacity
              style={estilos.botaoAcao}
              onPress={() => handleStatusChange(item.id, 'em transito')}
            >
              <Text style={estilos.textoBotao}>Iniciar Entrega</Text>
            </TouchableOpacity>
          )}

          {item.status === 'em transito' && (
            <TouchableOpacity
              style={estilos.botaoAcao}
              onPress={() => handleStatusChange(item.id, 'Coleta finalizada')}
            >
              <Text style={estilos.textoBotao}>Finalizar Entrega</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={estilos.botaoMapa}
            onPress={() => navigation.navigate('MapaScreen', { origem: item.origem, destino: item.destino })}
          >
            <Text style={estilos.textoBotao}>Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143d59',
    padding: 16,
  },
  lista: {
    paddingBottom: 16,
  },
  cartaoMovimentacao: {
    backgroundColor: '#d3dfea',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagemProduto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  textoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#143d59',
  },
  quantidade: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4e4e4e',
  },
  texto: {
    fontSize: 14,
    color: '#4e4e4e',
  },
  historicoItem: {
    fontSize: 12,
    color: '#333',
    marginLeft: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f4b41a',
    marginBottom: 10,
  },
  botoesContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  botaoAcao: {
    backgroundColor: '#f4b41a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  botaoMapa: {
    backgroundColor: '#f4b41a',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textoBotao: {
    color: '#143d59',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textoVazio: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
});

export default ListagemMovimentacoesScreen;
