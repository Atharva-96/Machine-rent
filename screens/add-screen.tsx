"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import MultiImageUpload from "../components/multi-image-upload"
import { useMachineContext } from "../context/machine-context"

export default function AddScreen({ navigation }) {
  const { addMachine } = useMachineContext()

  const [form, setForm] = useState({
    name: "",
    description: "",
    contactDetails: "",
    type: "",
    fuelType: "",
    industryType: "",
    price: "",
    availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
  })

  const [images, setImages] = useState<string[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setForm({
      ...form,
      [field]: value,
    })
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setForm({
        ...form,
        availableUntil: selectedDate,
      })
    }
  }

  const handleSubmit = () => {
    // Validate form
    if (
      !form.name ||
      !form.description ||
      !form.contactDetails ||
      !form.type ||
      !form.fuelType ||
      !form.industryType ||
      !form.price ||
      images.length === 0
    ) {
      Alert.alert("Missing Information", "Please fill in all fields and add at least one machine image.")
      return
    }

    // Add machine to context
    addMachine({
      name: form.name,
      description: form.description,
      contactDetails: form.contactDetails,
      type: form.type,
      fuelType: form.fuelType,
      industryType: form.industryType,
      price: Number.parseInt(form.price),
      availableUntil: form.availableUntil.toISOString().split("T")[0],
      image: images[0], // Use first image as main image
      images: images,
      owner: "", // Will be set by context
    })

    // Show success message
    Alert.alert("Success!", "Your machine has been listed for rent successfully. You can view it in your profile.", [
      {
        text: "OK",
        onPress: () => {
          // Reset form
          setForm({
            name: "",
            description: "",
            contactDetails: "",
            type: "",
            fuelType: "",
            industryType: "",
            price: "",
            availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          })
          setImages([])

          // Navigate to profile
          navigation.navigate("Profile")
        },
      },
    ])
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>List Your Machine</Text>

          <MultiImageUpload images={images} onImagesChange={setImages} maxImages={6} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Machine Name *</Text>
            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="e.g. Excavator XL2000"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={form.description}
              onChangeText={(text) => handleInputChange("description", text)}
              placeholder="Describe your machine, its condition, and any special features"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Details *</Text>
            <TextInput
              style={styles.input}
              value={form.contactDetails}
              onChangeText={(text) => handleInputChange("contactDetails", text)}
              placeholder="Email or phone number"
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Machine Type *</Text>
              <TextInput
                style={styles.input}
                value={form.type}
                onChangeText={(text) => handleInputChange("type", text)}
                placeholder="e.g. Excavator"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Fuel Type *</Text>
              <TextInput
                style={styles.input}
                value={form.fuelType}
                onChangeText={(text) => handleInputChange("fuelType", text)}
                placeholder="e.g. Diesel"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Industry Type *</Text>
              <TextInput
                style={styles.input}
                value={form.industryType}
                onChangeText={(text) => handleInputChange("industryType", text)}
                placeholder="e.g. Construction"
                placeholderTextColor="#999"
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Daily Price (₹) *</Text>
              <TextInput
                style={styles.input}
                value={form.price}
                onChangeText={(text) => handleInputChange("price", text)}
                placeholder="e.g. 250"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Available Until *</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerButtonText}>{form.availableUntil.toLocaleDateString()}</Text>
              <Ionicons name="calendar-outline" size={24} color="#000" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.availableUntil}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Set minimum date to tomorrow
              />
            )}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>List Machine for Rent</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
    color: "#000",
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
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#000",
  },
  submitButton: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
})

