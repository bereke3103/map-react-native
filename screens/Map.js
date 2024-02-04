import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import IconButton from '../components/UI/IconButton';

const Map = ({ navigation, route }) => {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };

  const [selecetedLocation, setSelecetedLocation] = useState(initialLocation);

  const region = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event) {
    if (initialLocation) return;

    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelecetedLocation({ lat: lat, lng: lng });
  }

  const savePickedLocationHandler = useCallback(() => {
    if (!selecetedLocation) {
      Alert.alert(
        'No location picked!',
        'You have to pick a location (by tapping on the map) first!'
      );
      return;
    }

    navigation.navigate('AddPlace', {
      pickedLat: selecetedLocation.lat,
      pickedLng: selecetedLocation.lng,
    });
  }, [navigation, selecetedLocation]);

  useLayoutEffect(() => {
    if (initialLocation) {
      return;
    }

    navigation.setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <IconButton
            onPress={savePickedLocationHandler}
            icon={'save'}
            size={24}
            color={tintColor}
          />
        );
      },
    });
  }, [navigation, savePickedLocationHandler, initialLocation]);

  return (
    <MapView
      onPress={selectLocationHandler}
      style={styles.map}
      initialRegion={region}
    >
      <Marker
        title="Picked location"
        coordinate={{
          latitude: selecetedLocation?.lat,
          longitude: selecetedLocation?.lng,
        }}
      />
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
