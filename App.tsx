import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ListaProdutosScreen from './src/screens/ListaProdutosScreen';
import UsuariosScreen from './src/screens/UsuariosScreen';
import CadastroUsuarioScreen from './src/screens/CadastroUsuarioScreen'; 

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
