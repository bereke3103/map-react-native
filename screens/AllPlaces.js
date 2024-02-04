import { View } from 'react-native';
import PlaceList from '../components/Places/PlaceList';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { fetchPlaces } from '../util/database';

const AllPlaces = ({ route }) => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      const places = await fetchPlaces();
      setLoadedPlaces(places);
    }
    if (isFocused) {
      loadPlaces();
      // setLoadedPlaces((curPlaces) => [...curPlaces, route.params.place]);
    }
  }, [
    isFocused,
    // route
  ]);

  return <PlaceList places={loadedPlaces} />;
};

export default AllPlaces;
