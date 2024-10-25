import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

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

  // Função para buscar a lista de produtos
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://10.0.3.217:3000/products');
      setProducts(response.data);
      setFilteredProducts(response.data); // Inicia com todos os produtos visíveis
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar produtos');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Função para filtrar produtos pelo termo de busca
  const handleSearch = () => {
    const filtered = products.filter(
      (product) =>
        product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.branch_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Função para renderizar cada item (produto) na FlatList
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product_name}</Text>
        <View style={styles.productDetails}>
          <Text style={styles.branchName}>Loja {item.branch_name}</Text>
          <Text style={styles.quantity}>{item.quantity} Unidades</Text>
        </View>
        <Text style={styles.productDescription}>
          {item.description.length > 100 ? item.description.substring(0, 100) + '...' : item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header da página */}
      <View style={styles.header}>
        <Text style={styles.title}>Estoque</Text>
      </View>

      {/* Campo de pesquisa */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Digite o nome do produto ou loja"
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Exibir quantidade de produtos encontrados */}
      <Text style={styles.resultCount}>
        {filteredProducts.length} produto(s) encontrado(s)
      </Text>

      {/* FlatList para exibir a lista de produtos */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())} // Fallback para IDs indefinidos
        renderItem={renderProductItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#143d59',
    padding: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f4b41a',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f4b41a',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#f4b41a',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#f4b41a',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  searchButtonText: {
    color: '#143d59',
    fontWeight: 'bold',
  },
  resultCount: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  list: {
    paddingBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143d59',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  branchName: {
    fontSize: 14,
    color: '#143d59',
  },
  quantity: {
    fontSize: 14,
    color: '#143d59',
  },
  productDescription: {
    fontSize: 14,
    color: '#143d59',
    marginTop: 5,
  },
  emptyText: {
    color: '#f4b41a',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListaProdutosScreen;
