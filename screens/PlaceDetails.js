import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import OutlineButton from '../components/UI/OutlineButton';
import { Colors } from '../constants/colors';
import { fetchPlaceDetails } from '../util/database';

const PlaceDetails = ({ route, navigation }) => {
  const [fetchedPlace, setFetchedPlace] = useState();

  function showOnMapHandler() {
    navigation.navigate('Map', {
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    });
  }

  const selectedPlaceId = route.params.placeId;
  console.log('selectedPlaceIdselectedPlaceId:', selectedPlaceId);

  useEffect(() => {
    async function loadPlaceData() {
      const place = await fetchPlaceDetails(selectedPlaceId);
      setFetchedPlace(place);
      console.log(
        'placeplaceplaceplaceplaceplaceplaceplaceplaceplaceplaceplaceplaceplaceplaceL,:',
        place
      );
      navigation.setOptions({
        title: place.title,
      });
    }

    loadPlaceData();
  }, [route]);

  if (!fetchedPlace) {
    return (
      <View style={styles.fallback}>
        <Text>Loading place Data...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: fetchedPlace.imageUri }} />
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlineButton icon={'map'} onPress={showOnMapHandler}>
          View onMap
        </OutlineButton>
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    alignItems: 'center',
  },
  image: {
    height: '35%',
    minHeight: 300,
    width: '100%',
  },
  locationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    padding: 20,
  },
  address: {
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
