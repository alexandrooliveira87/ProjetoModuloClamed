import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ListaProdutosScreen from './src/screens/ListaProdutosScreen';
import UsuariosScreen from './src/screens/UsuariosScreen';
import CadastroUsuarioScreen from './src/screens/CadastroUsuarioScreen';
import ListagemMovimentacoesScreen from './src/screens/ListagemMovimentacoesScreen';
import CadastroMovimentacaoScreen from './src/screens/CadastroMovimentacaoScreen';
import MapaScreen from './src/screens/MapaScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ListaProdutos" component={ListaProdutosScreen} />
        <Stack.Screen name="Usuarios" component={UsuariosScreen} />
        <Stack.Screen name="CadastroUsuario" component={CadastroUsuarioScreen} />
        <Stack.Screen name="ListagemMovimentacoes" component={ListagemMovimentacoesScreen} />
        <Stack.Screen name="CadastroMovimentacao" component={CadastroMovimentacaoScreen} />
        <Stack.Screen name="MapaScreen" component={MapaScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
