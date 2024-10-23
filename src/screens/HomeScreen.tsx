import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import Header from '../components/Header';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const userName = 'Alexandro Oliveira'; 
  const userProfile = 'Administrador'; 

  return (
    <View style={styles.container}>
      <Header name={userName} profile={userProfile} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo à Home</Text>

        {/* Sempre verifique se strings estão dentro de <Text> */}
        <Button
          title="Listagem de Produtos"
          onPress={() => navigation.navigate('ProductList')} 
        />

        <Button
          title="Gerenciamento de Usuários"
          onPress={() => navigation.navigate('UserManagement')} 
        />

        <Button title="Sair" onPress={() => navigation.navigate('Login')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
