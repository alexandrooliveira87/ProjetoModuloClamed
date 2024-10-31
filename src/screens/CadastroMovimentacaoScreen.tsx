import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

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
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState<number | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const branchesResponse = await axios.get('http://10.0.3.217:3000/branches/options');
        const productsResponse = await axios.get('http://10.0.3.217:3000/products/options');

        console.log("Branches Response Data:", branchesResponse.data);
        console.log("Products Response Data:", productsResponse.data);

        if (Array.isArray(branchesResponse.data)) {
          setBranches(branchesResponse.data);
        }

        if (Array.isArray(productsResponse.data)) {
          setProducts(productsResponse.data);
        }
      } catch (error) {
        console.error("Erro ao carregar opções:", error);
        Alert.alert('Erro', 'Não foi possível carregar as opções');
      }
    };
    fetchOptions();
  }, []);

  // Filtra produtos com base na filial de origem selecionada
  useEffect(() => {
    const filtered = products.filter((p) => p.branch_id === Number(origem));
    setFilteredProducts(filtered);
  }, [origem, products]);

  // Atualiza a quantidade disponível do produto selecionado
  useEffect(() => {
    const selectedProduct = filteredProducts.find((p) => p.product_id === Number(produto));
    setSelectedProductQuantity(selectedProduct ? selectedProduct.quantity : null);
  }, [produto, filteredProducts]);

  const handleCadastro = async () => {
    if (origem === destino) {
      Alert.alert('Erro', 'A filial de origem e destino devem ser diferentes');
      return;
    }

    if (selectedProductQuantity !== null && Number(quantidade) > selectedProductQuantity) {
      Alert.alert('Erro', 'Estoque insuficiente para essa movimentação');
      return;
    }

    try {
      await axios.post('http://10.0.3.217:3000/movements', {
        originBranchId: Number(origem),
        destinationBranchId: Number(destino),
        productId: Number(produto),
        quantity: Number(quantidade),
        observations: observacoes,
      });
      Alert.alert('Sucesso', 'Movimentação cadastrada com sucesso');
    } catch (error) {
      console.error("Erro ao cadastrar movimentação:", error);
      Alert.alert('Erro', 'Não foi possível cadastrar a movimentação');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filial de Origem</Text>
      <Picker
        selectedValue={origem}
        onValueChange={(itemValue) => setOrigem(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione a Filial de Origem" value="" />
        {branches.map((branch) =>
          branch && branch.id !== undefined && branch.name ? (
            <Picker.Item key={branch.id} label={branch.name} value={branch.id.toString()} />
          ) : null
        )}
      </Picker>

      <Text style={styles.label}>Filial de Destino</Text>
      <Picker
        selectedValue={destino}
        onValueChange={(itemValue) => setDestino(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione a Filial de Destino" value="" />
        {branches.map((branch) =>
          branch && branch.id !== undefined && branch.name ? (
            <Picker.Item key={branch.id} label={branch.name} value={branch.id.toString()} />
          ) : null
        )}
      </Picker>

      <Text style={styles.label}>Produto</Text>
      <Picker
        selectedValue={produto}
        onValueChange={(itemValue) => setProduto(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Produto" value="" />
        {filteredProducts.map((product) =>
          product && product.product_id !== undefined && product.product_name ? (
            <Picker.Item key={product.product_id} label={`${product.product_name} (Disponível: ${product.quantity || 0})`} value={product.product_id.toString()} />
          ) : null
        )}
      </Picker>

      <Text style={styles.label}>Quantidade</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <Text style={styles.label}>Observações</Text>
      <TextInput
        style={styles.input}
        multiline
        value={observacoes}
        onChangeText={setObservacoes}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CadastroMovimentacaoScreen;
