import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CadastroUsuarioScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Página de Cadastro de Usuário</Text>
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

export default CadastroUsuarioScreen;
