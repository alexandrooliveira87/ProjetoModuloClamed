import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

// Definição das interfaces para Branch (filial) e Product (produto)
interface Branch {
  id: number;
  name: string;
}

interface Product {
  branch_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  branch_name: string;
}

const CadastroMovimentacaoScreen: React.FC = () => {
  // Declaração de estados para gerenciar os dados do formulário e listas
  const [origem, setOrigem] = useState(''); // Filial de origem
  const [destino, setDestino] = useState(''); // Filial de destino
  const [produto, setProduto] = useState(''); // Produto selecionado
  const [quantidade, setQuantidade] = useState(''); // Quantidade de movimentação
  const [observacoes, setObservacoes] = useState(''); // Observações adicionais
  const [branches, setBranches] = useState<Branch[]>([]); // Lista de filiais
  const [products, setProducts] = useState<Product[]>([]); // Lista de produtos
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Produtos filtrados por filial de origem
  const [selectedProductQuantity, setSelectedProductQuantity] = useState<number | null>(null); // Estoque disponível do produto

  // Função para buscar as opções de filiais e produtos da API ao montar o componente
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Requisições para obter dados das filiais e produtos
        const branchesResponse = await axios.get('http://192.168.5.113:3000/branches/options');
        const productsResponse = await axios.get('http://192.168.5.113:3000/products/options');

        // Atualiza o estado com as listas retornadas, se válidas
        if (Array.isArray(branchesResponse.data)) {
          setBranches(branchesResponse.data);
        }
        if (Array.isArray(productsResponse.data)) {
          setProducts(productsResponse.data);
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as opções');
      }
    };
    fetchOptions(); // Chama a função ao carregar o componente
  }, []);

  // Filtra os produtos com base na filial de origem selecionada
  useEffect(() => {
    const filtered = products.filter((p) => p.branch_id === Number(origem));
    setFilteredProducts(filtered);
  }, [origem, products]); // Atualiza ao mudar a origem ou lista de produtos

  // Atualiza a quantidade disponível do produto selecionado ao mudar o produto ou lista de produtos
  useEffect(() => {
    const selectedProduct = filteredProducts.find((p) => p.product_id === Number(produto));
    setSelectedProductQuantity(selectedProduct ? selectedProduct.quantity : null);
  }, [produto, filteredProducts]);

  // Função para tratar o cadastro da movimentação
  const handleCadastro = async () => {
    // Validação para evitar selecionar a mesma filial como origem e destino
    if (origem === destino) {
      Alert.alert('Erro', 'A filial de origem e destino devem ser diferentes');
      return;
    }

    // Verificação se há estoque suficiente do produto para a movimentação
    if (selectedProductQuantity !== null && Number(quantidade) > selectedProductQuantity) {
      Alert.alert('Erro', 'Estoque insuficiente para essa movimentação');
      return;
    }

    try {
      // Requisição de cadastro da movimentação
      await axios.post('http://192.168.5.113:3000/movements', {
        originBranchId: Number(origem),
        destinationBranchId: Number(destino),
        productId: Number(produto),
        quantity: Number(quantidade),
        observations: observacoes,
      });
      Alert.alert('Sucesso', 'Movimentação cadastrada com sucesso');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar a movimentação');
    }
  };

  return (
    <View style={estilos.container}>
      {/* Campo de seleção para a filial de origem */}
      <Text style={estilos.rotulo}>Filial de Origem</Text>
      <Picker
        selectedValue={origem}
        onValueChange={(itemValue) => setOrigem(itemValue)}
        style={estilos.seletor}
      >
        <Picker.Item label="Selecione a Filial de Origem" value="" />
        {branches.map((branch) =>
          branch && branch.id !== undefined && branch.name ? (
            <Picker.Item key={branch.id} label={branch.name} value={branch.id.toString()} />
          ) : null
        )}
      </Picker>

      {/* Campo de seleção para a filial de destino */}
      <Text style={estilos.rotulo}>Filial de Destino</Text>
      <Picker
        selectedValue={destino}
        onValueChange={(itemValue) => setDestino(itemValue)}
        style={estilos.seletor}
      >
        <Picker.Item label="Selecione a Filial de Destino" value="" />
        {branches.map((branch) =>
          branch && branch.id !== undefined && branch.name ? (
            <Picker.Item key={branch.id} label={branch.name} value={branch.id.toString()} />
          ) : null
        )}
      </Picker>

      {/* Campo de seleção para o produto */}
      <Text style={estilos.rotulo}>Produto</Text>
      <Picker
        selectedValue={produto}
        onValueChange={(itemValue) => setProduto(itemValue)}
        style={estilos.seletor}
      >
        <Picker.Item label="Selecione o Produto" value="" />
        {filteredProducts.map((product) =>
          product && product.product_id !== undefined && product.product_name ? (
            <Picker.Item key={product.product_id} label={`${product.product_name} (Disponível: ${product.quantity || 0})`} value={product.product_id.toString()} />
          ) : null
        )}
      </Picker>

      {/* Campo de entrada para a quantidade */}
      <Text style={estilos.rotulo}>Quantidade</Text>
      <TextInput
        style={estilos.entrada}
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      {/* Campo de entrada para observações */}
      <Text style={estilos.rotulo}>Observações</Text>
      <TextInput
        style={estilos.entrada}
        multiline
        value={observacoes}
        onChangeText={setObservacoes}
      />

      {/* Botão para enviar o formulário */}
      <TouchableOpacity style={estilos.botao} onPress={handleCadastro}>
        <Text style={estilos.textoBotao}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

// Estilos em português para manter consistência com o layout do projeto
const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#143d59', // Fundo azul escuro
  },
  rotulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#f4b41a', // Amarelo
  },
  seletor: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  entrada: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    color: '#000',
  },
  botao: {
    backgroundColor: '#f4b41a', // Botão em amarelo
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  textoBotao: {
    color: '#143d59', // Texto do botão em azul escuro
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CadastroMovimentacaoScreen;
