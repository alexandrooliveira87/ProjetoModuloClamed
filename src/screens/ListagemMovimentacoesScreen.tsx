import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

interface Movimentacao {
  id: number;
  origem: { nome: string; latitude: number; longitude: number };
  destino: { nome: string; latitude: number; longitude: number };
  produto: { nome: string; imagem: string };
  quantidade: number;
  status: string;
  historico: Array<{ descricao: string; data: string }>;
}

const ListagemMovimentacoesScreen: React.FC = () => {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [motorista, setMotorista] = useState('Nome do Motorista');
  const navigation = useNavigation();

  const buscarMovimentacoes = async () => {
    try {
      const resposta = await axios.get('http://192.168.5.113:3000/movements');
      setMovimentacoes(resposta.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar movimentações');
    }
  };

  // Função para calcular a distância entre dois pontos de latitude/longitude
  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em km
    return distancia.toFixed(2) + ' km';
  };

  const handleStatusChange = async (id: number, novoStatus: string) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
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
          Alert.alert('Sucesso', `Status alterado para ${novoStatus}`);
          buscarMovimentacoes(); // Recarrega a lista após atualização
        }
      }
    } catch (error) {
      Alert.alert('Erro', `Erro ao alterar status para ${novoStatus}`);
    }
  };

  useEffect(() => {
    buscarMovimentacoes();
  }, []);

  const renderizarItemMovimentacao = ({ item }: { item: Movimentacao }) => {
    const distancia = calcularDistancia(
      item.origem.latitude,
      item.origem.longitude,
      item.destino.latitude,
      item.destino.longitude
    );

    return (
      <View
        style={[
          estilos.cartaoMovimentacao,
          item.status === 'created'
            ? estilos.fundoCinza
            : item.status === 'em transito'
            ? estilos.fundoSalmao
            : estilos.fundoVerde,
        ]}
      >
        <Image source={{ uri: item.produto.imagem }} style={estilos.imagemProduto} />
        <View style={estilos.infoContainer}>
          <Text style={estilos.textoTitulo}>ID: {item.id} - {item.produto.nome}</Text>
          <Text style={estilos.quantidade}>Quantidade: {item.quantidade} Unidades</Text>
          <Text style={estilos.texto}>Origem: {item.origem.nome}</Text>
          <Text style={estilos.texto}>Destino: {item.destino.nome}</Text>
          <Text style={estilos.texto}>Distância: {distancia}</Text>
          <Text style={estilos.status}>Status: {item.status}</Text>
          
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

            {(item.status === 'created' || item.status === 'em transito') && (
              <TouchableOpacity
                style={estilos.botaoMapa}
                onPress={() => navigation.navigate('MapaScreen', { origem: item.origem, destino: item.destino })}
              >
                <Text style={estilos.textoBotao}>Mapa</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

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
  fundoCinza: {
    backgroundColor: '#d3d3d3',
  },
  fundoSalmao: {
    backgroundColor: '#ffa07a',
  },
  fundoVerde: {
    backgroundColor: '#98fb98',
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
