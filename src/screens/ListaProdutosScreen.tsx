import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ListaProdutosScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Listagem de Produtos</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ListaProdutosScreen;
