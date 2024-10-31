import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

// Interface para definir os produtos
interface Product {
  id?: number;
  product_name: string;
  branch_name: string;
  quantity: number;
  image_url: string;
  description: string;
}

const ListaProdutosScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Função para buscar produtos
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://192.168.5.113:3000/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produtos');
    }
  };

  // Carregar produtos ao montar o componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Função de busca
  const handleSearch = () => {
    const filtered = products.filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Renderizar cada item do produto
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={estilos.cartaoProduto}>
      <Image source={{ uri: item.image_url }} style={estilos.imagemProduto} />
      <View style={estilos.infoProduto}>
        <Text style={estilos.nomeProduto}>{item.product_name}</Text>
        <View style={estilos.detalhesProduto}>
          <Text style={estilos.nomeLoja}>Loja {item.branch_name}</Text>
          <Text style={estilos.quantidade}>{item.quantity} Unidades</Text>
        </View>
        <Text style={estilos.descricaoProduto}>
          {item.description.length > 100 ? `${item.description.substring(0, 100)}...` : item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={estilos.container}>
      <View style={estilos.cabecalho}>
        <Text style={estilos.titulo}>Estoque</Text>
      </View>

      <View style={estilos.containerBusca}>
        <TextInput
          style={estilos.inputBusca}
          placeholder="Digite o nome do produto ou loja"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={estilos.botaoBusca} onPress={handleSearch}>
          <Text style={estilos.textoBotaoBusca}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <Text style={estilos.contagemResultados}>
        {filteredProducts.length} produto(s) encontrado(s)
      </Text>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
        renderItem={renderProductItem}
        contentContainerStyle={estilos.lista}
        ListEmptyComponent={<Text style={estilos.textoVazio}>Nenhum produto encontrado</Text>}
      />
    </View>
  );
};

// Estilos da tela
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143d59', // Cor de fundo azul escuro
    padding: 16,
  },
  cabecalho: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f4b41a', // Cor da borda inferior do cabeçalho
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4b41a', // Cor amarela para o título
    textAlign: 'center',
  },
  containerBusca: {
    flexDirection: 'row', // Alinhamento horizontal
    marginBottom: 20,
    alignItems: 'center',
  },
  inputBusca: {
    flex: 1,
    height: 40,
    borderColor: '#f4b41a', // Cor amarela para a borda do campo de busca
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff', // Cor do texto digitado em branco
  },
  botaoBusca: {
    marginLeft: 10,
    backgroundColor: '#f4b41a', // Fundo amarelo para o botão de busca
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textoBotaoBusca: {
    color: '#143d59', // Texto azul escuro para o botão de busca
    fontWeight: 'bold',
  },
  contagemResultados: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  lista: {
    paddingBottom: 16,
  },
  cartaoProduto: {
    flexDirection: 'row', // Alinhamento horizontal para imagem e informações
    backgroundColor: '#fff', // Fundo branco para o cartão de produto
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imagemProduto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  infoProduto: {
    flex: 1,
    justifyContent: 'center',
  },
  nomeProduto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143d59', // Azul escuro para o nome do produto
  },
  detalhesProduto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  nomeLoja: {
    fontSize: 14,
    color: '#143d59', // Azul escuro para o nome da loja
  },
  quantidade: {
    fontSize: 14,
    color: '#143d59', // Azul escuro para a quantidade
  },
  descricaoProduto: {
    fontSize: 14,
    color: '#143d59',
    marginTop: 5,
  },
  textoVazio: {
    color: '#f4b41a',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListaProdutosScreen;
