import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';
import OutlineButton from '../UI/OutlineButton';
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from 'expo-location';
import { getAdress, getMapPreview } from '../../util/location';
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';

const LocationPicker = ({ onPickLocation }) => {
  const navigate = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const [pickedLocation, setPickedLocation] = useState();
  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };

      setPickedLocation(mapPickedLocation);
      setLodingMap(false);
    }
  }, [route, isFocused]);

  useEffect(() => {
    async function handleLocation() {
      if (pickedLocation) {
        const address = await getAdress(pickedLocation.lat, pickedLocation.lng);
        onPickLocation({ ...pickedLocation, address: address });
      }
    }

    handleLocation();
  }, [pickedLocation, onPickLocation]);

  const [lodingMap, setLodingMap] = useState(false);

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  async function verifyPermessions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      const permession = await requestPermission();

      return permession.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insufficient Permessions!',
        'You need to grant camera permessions to use this app'
      );

      return false;
    }

    return true;
  }

  async function getLocationHandler() {
    setPickedLocation(null);
    setLodingMap(true);
    const hasPermession = await verifyPermessions();

    if (!hasPermession) {
      return;
    }

    const location = await getCurrentPositionAsync();

    setLodingMap(false);

    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }

  function pickOnMapHandler() {
    navigate.navigate('Map');
  }

  let locationPreview = <Text>No location picked yet.</Text>;

  if (lodingMap) {
    locationPreview = <Text>Loading map...</Text>;
  }

  if (pickedLocation) {
    locationPreview = (
      <Image
        style={styles.image}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlineButton icon={'location'} onPress={getLocationHandler}>
          Locate User
        </OutlineButton>
        <OutlineButton icon={'map'} onPress={pickOnMapHandler}>
          Pick on Map
        </OutlineButton>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    // borderRadius: 4,
  },
});
