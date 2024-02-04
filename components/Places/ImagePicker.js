import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  PermissionStatus,
} from 'expo-image-picker';
import { Colors } from '../../constants/colors';
import OutlineButton from '../UI/OutlineButton';

const ImagePicker = ({ onTakeImage }) => {
  const [pickedImage, setPickedImage] = useState();

  const [cameraPermessionInformation, requestPermession] =
    useCameraPermissions();

  async function verifyPermessions() {
    if (cameraPermessionInformation.status === PermissionStatus.UNDETERMINED) {
      const permessionResponse = await requestPermession();

      return permessionResponse.granted;
    }

    if (cameraPermessionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        'Insifficient Permessions!',
        'You need to grant camera permission to use this app.'
      );

      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermession = await verifyPermessions();

    if (!hasPermession) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    setPickedImage(image.assets[0].uri);
    onTakeImage(image.assets[0].uri);
  }

  let imagePreview = <Text>No image taken yet.</Text>;

  if (pickedImage) {
    imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlineButton icon={'camera'} onPress={takeImageHandler}>
        Take image
      </OutlineButton>
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  imagePreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
