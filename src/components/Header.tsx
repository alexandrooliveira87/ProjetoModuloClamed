import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  name: string;
  profile: string;
}

const Header: React.FC<HeaderProps> = ({ name, profile }) => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Perfil: {profile}</Text>
      <Text style={styles.headerText}>Nome: {name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#9D49F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Header;
