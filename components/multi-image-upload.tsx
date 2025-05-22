"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { takePhoto, pickImageFromGallery, pickImageFromFiles } from "../utils/image-picker"

type MultiImageUploadProps = {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function MultiImageUpload({ images, onImagesChange, maxImages = 6 }: MultiImageUploadProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAddImage = () => {
    if (images.length >= maxImages) {
      Alert.alert("Maximum Images", `You can only upload up to ${maxImages} images.`)
      return
    }

    setModalVisible(true)
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onImagesChange(newImages)
  }

  const handleTakePhoto = async () => {
    setLoading(true)
    setModalVisible(false)

    const imageUri = await takePhoto()
    if (imageUri) {
      onImagesChange([...images, imageUri])
    }

    setLoading(false)
  }

  const handlePickFromGallery = async () => {
    setLoading(true)
    setModalVisible(false)

    const imageUri = await pickImageFromGallery()
    if (imageUri) {
      onImagesChange([...images, imageUri])
    }

    setLoading(false)
  }

  const handlePickFromFiles = async () => {
    setLoading(true)
    setModalVisible(false)

    const imageUri = await pickImageFromFiles()
    if (imageUri) {
      onImagesChange([...images, imageUri])
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Machine Images ({images.length}/{maxImages})
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesContainer}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
              <Ionicons name="close-circle" size={24} color="#1E88E5" />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < maxImages && (
          <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="large" color="#1E88E5" />
            ) : (
              <>
                <Ionicons name="add" size={40} color="#1E88E5" />
                <Text style={styles.addImageText}>Add Image</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>

      <Text style={styles.helperText}>
        First image will be used as the main image. You can add up to {maxImages} images.
      </Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Source</Text>

            <TouchableOpacity style={styles.sourceButton} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={24} color="#1E88E5" />
              <Text style={styles.sourceButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sourceButton} onPress={handlePickFromGallery}>
              <Ionicons name="images" size={24} color="#1E88E5" />
              <Text style={styles.sourceButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sourceButton} onPress={handlePickFromFiles}>
              <Ionicons name="folder" size={24} color="#1E88E5" />
              <Text style={styles.sourceButtonText}>Browse Files</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  imagesContainer: {
    paddingVertical: 8,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 0,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    fontSize: 12,
    color: "#1E88E5",
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#555",
    marginTop: 8,
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
  sourceButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sourceButtonText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#000",
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E88E5",
  },
})
