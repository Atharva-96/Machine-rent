import * as ImagePicker from "expo-image-picker"
import * as DocumentPicker from "expo-document-picker"
import { Alert, Platform } from "react-native"

// Function to request camera permissions
export const requestCameraPermission = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need camera permissions to make this work!", [{ text: "OK" }])
      return false
    }
    return true
  }
  return true
}

// Function to request media library permissions
export const requestMediaLibraryPermission = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need media library permissions to make this work!", [
        { text: "OK" },
      ])
      return false
    }
    return true
  }
  return true
}

// Function to take a photo using the camera
export const takePhoto = async () => {
  const hasPermission = await requestCameraPermission()
  if (!hasPermission) return null

  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri
    }
  } catch (error) {
    console.error("Error taking photo:", error)
    Alert.alert("Error", "Failed to take photo")
  }
  return null
}

// Function to pick an image from the gallery
export const pickImageFromGallery = async () => {
  const hasPermission = await requestMediaLibraryPermission()
  if (!hasPermission) return null

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri
    }
  } catch (error) {
    console.error("Error picking image:", error)
    Alert.alert("Error", "Failed to pick image")
  }
  return null
}

// Function to pick a file using document picker
export const pickImageFromFiles = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/*",
      copyToCacheDirectory: true,
    })

    if (result.type === "success") {
      return result.uri
    }
  } catch (error) {
    console.error("Error picking document:", error)
    Alert.alert("Error", "Failed to pick document")
  }
  return null
}

