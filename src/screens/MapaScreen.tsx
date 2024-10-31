import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp, useRoute } from '@react-navigation/native';

interface OrigemDestino {
  origem: { nome: string; latitude: number; longitude: number };
  destino: { nome: string; latitude: number; longitude: number };
}

const MapaScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: OrigemDestino }, 'params'>>();
  const { origem, destino } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: origem.latitude,
          longitude: origem.longitude,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {/* Marcador de Origem */}
        <Marker
          coordinate={{ latitude: origem.latitude, longitude: origem.longitude }}
          title="Origem"
          description={origem.nome}
          pinColor="green"
        />
        {/* Marcador de Destino */}
        <Marker
          coordinate={{ latitude: destino.latitude, longitude: destino.longitude }}
          title="Destino"
          description={destino.nome}
          pinColor="red"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapaScreen;
