"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useMachineContext, type UserProfile } from "../context/machine-context"
import { takePhoto, pickImageFromGallery } from "../utils/image-picker"

export default function EditProfileScreen({ navigation, route }) {
  const { userProfile, updateUserProfile } = useMachineContext()
  const [showImagePicker, setShowImagePicker] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<UserProfile>({
    ...userProfile,
  })

  useEffect(() => {
    // Check if we should show the image picker modal
    if (route.params?.showImagePicker) {
      setShowImagePicker(true)
    }
  }, [route.params])

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  const handleTakePhoto = async () => {
    setLoading(true)
    setShowImagePicker(false)

    const imageUri = await takePhoto()
    if (imageUri) {
      setForm({
        ...form,
        profileImage: imageUri,
      })
    }

    setLoading(false)
  }

  const handlePickFromGallery = async () => {
    setLoading(true)
    setShowImagePicker(false)

    const imageUri = await pickImageFromGallery()
    if (imageUri) {
      setForm({
        ...form,
        profileImage: imageUri,
      })
    }

    setLoading(false)
  }

  const handleSave = () => {
    // Validate form
    if (!form.name || !form.email) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    // Update profile
    updateUserProfile(form)

    // Show success message and navigate back
    Alert.alert("Success", "Your profile has been updated successfully.", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.imageSection}>
          <Image source={{ uri: form.profileImage }} style={styles.profileImage} />
          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#1E88E5" />
            </View>
          ) : (
            <TouchableOpacity style={styles.changeImageButton} onPress={() => setShowImagePicker(true)}>
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(text) => handleInputChange("email", text)}
            placeholder="Enter your email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(text) => handleInputChange("phone", text)}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.address}
            onChangeText={(text) => handleInputChange("address", text)}
            placeholder="Enter your address"
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showImagePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImagePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>

            <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={24} color="#1E88E5" />
              <Text style={styles.modalOptionText}>Take a Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption} onPress={handlePickFromGallery}>
              <Ionicons name="images-outline" size={24} color="#1E88E5" />
              <Text style={styles.modalOptionText}>Upload from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowImagePicker(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  formContainer: {
    padding: 16,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 60,
  },
  changeImageButton: {
    position: "absolute",
    bottom: 0,
    right: "50%",
    marginRight: -60,
    backgroundColor: "#1E88E5",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#000",
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E88E5",
  },
})

