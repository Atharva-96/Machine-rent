"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ImageCarousel from "../components/image-carousel"
import type { Machine } from "../components/machine-card"
import { useMachineContext } from "../context/machine-context"

const { width } = Dimensions.get("window")
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

// Default placeholder image for fallback
const DEFAULT_PLACEHOLDER_IMAGE = "https://placeholder.svg?height=400&width=600&text=No+Image+Available"

export default function ProductDetailScreen({ route, navigation }) {
  const { machineId } = route.params
  const { machines, rentMachine } = useMachineContext()
  const [machine, setMachine] = useState<Machine | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [isRented, setIsRented] = useState(false)
  const [currentDate, setCurrentDate] = useState("")

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current
  const modalOpacity = useRef(new Animated.Value(0)).current
  const modalScale = useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    // Set current date
    const now = new Date()
    setCurrentDate(now.toISOString().split("T")[0])

    // Find the machine by ID
    const foundMachine = machines.find((m) => m.id === machineId)
    if (foundMachine) {
      // Check if machine is already rented
      const isAlreadyRented = foundMachine.rentedOn !== undefined
      setIsRented(isAlreadyRented)

      // Ensure consistent contact information with proper fallbacks
      const contactDetails = foundMachine.contactDetails || "Contact information not available"
      const ownerPhone = foundMachine.ownerPhone || "+1 (555) 123-4567"
      const ownerEmail = foundMachine.ownerEmail || contactDetails

      // Calculate days remaining from listing date or rental date
      let daysRemaining = 0
      if (foundMachine.availableUntil) {
        const availableUntil = new Date(foundMachine.availableUntil)
        const diffTime = availableUntil.getTime() - now.getTime()
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        daysRemaining = Math.max(0, daysRemaining) // Ensure non-negative
      }

      // Ensure consistent display of contact information
      setMachine({
        ...foundMachine,
        contactDetails: contactDetails,
        ownerPhone: ownerPhone,
        ownerEmail: ownerEmail,
        listingDate: foundMachine.listingDate || "2023-11-01",
        daysRemaining: daysRemaining,
      })
    }
  }, [machineId, machines])

  const handleRentPress = () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Show modal with animation
      setModalVisible(true)
      Animated.parallel([
        Animated.timing(modalOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(modalScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    })
  }

  const handleCloseModal = () => {
    // Close modal with animation
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false)
    })
  }

  const handleContactOwner = () => {
    handleCloseModal()

    // Check if machine exists before accessing its properties
    if (!machine) {
      Alert.alert("Error", "Machine information is not available", [{ text: "OK" }])
      return
    }

    // In a real app, this would open messaging or calling functionality
    Alert.alert(
      "Contact Owner",
      `You can contact ${machine.owner || "the owner"} at ${machine.ownerPhone || "N/A"} or ${machine.ownerEmail || "N/A"}`,
      [{ text: "OK" }],
    )
  }

  // Remove the owner section and fix the View My Rentals button navigation
  const handleRentMachine = () => {
    if (machine) {
      // Add machine to user's rented machines
      rentMachine(machine.id)
      setIsRented(true)

      // Show success message
      Alert.alert(
        "Success!",
        "You have successfully rented this machine. You can view it in your profile under 'My Rentals'.",
        [
          {
            text: "View My Rentals",
            onPress: () => {
              handleCloseModal()
              // Navigate to Profile with rentals tab active
              navigation.navigate("Profile", { initialTab: "rentals" })
            },
          },
          {
            text: "OK",
            onPress: () => handleCloseModal(),
          },
        ],
      )
    }
  }

  if (!machine) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    )
  }

  // Prepare images array with robust fallback handling
  const getImagesArray = () => {
    // Check if images array exists and has items
    if (machine.images && Array.isArray(machine.images) && machine.images.length > 0) {
      return machine.images
    }

    // Check if single image exists
    if (machine.image) {
      return [machine.image]
    }

    // Default fallback
    return [DEFAULT_PLACEHOLDER_IMAGE]
  }

  const images = getImagesArray()

  // In the render section, remove the owner section
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <ImageCarousel images={images} height={350} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.name}>{machine.name || "Unnamed Machine"}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>₹{machine.price || 0}</Text>
            <Text style={styles.priceUnit}>/day</Text>
          </View>

          <View style={styles.rentalStatusContainer}>
            <Text style={[styles.rentalStatusText, isRented ? styles.rentedStatusText : styles.availableStatusText]}>
              {isRented ? "Already Rented" : "Available for Rent"}
            </Text>
          </View>

          <View style={styles.tagsContainer}>
            {machine.type && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{machine.type}</Text>
              </View>
            )}
            {machine.industryType && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{machine.industryType}</Text>
              </View>
            )}
            {machine.fuelType && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{machine.fuelType}</Text>
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{machine.description || "No description available"}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Machine Details</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Ionicons name="construct-outline" size={20} color="#1E88E5" />
                <Text style={styles.detailLabel}>Machine Type:</Text>
                <Text style={styles.detailValue}>{machine.type || "Not specified"}</Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="business-outline" size={20} color="#1E88E5" />
                <Text style={styles.detailLabel}>Industry Type:</Text>
                <Text style={styles.detailValue}>{machine.industryType || "Not specified"}</Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="flash-outline" size={20} color="#1E88E5" />
                <Text style={styles.detailLabel}>Fuel Type:</Text>
                <Text style={styles.detailValue}>{machine.fuelType || "Not specified"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.availabilityContainer}>
              <View style={styles.availabilityItem}>
                <Ionicons name="calendar-outline" size={20} color="#1E88E5" />
                <Text style={styles.availabilityText}>Available until {machine.availableUntil || "Not specified"}</Text>
              </View>
              {machine.daysRemaining !== undefined && (
                <View style={styles.availabilityItem}>
                  <Ionicons name="time-outline" size={20} color="#1E88E5" />
                  <Text style={styles.availabilityText}>{machine.daysRemaining} days remaining</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedTouchable
          style={[styles.rentButton, isRented && styles.rentedButton, { transform: [{ scale: buttonScale }] }]}
          onPress={handleRentPress}
          activeOpacity={0.9}
          disabled={isRented}
        >
          <Text style={styles.rentButtonText}>{isRented ? "Already Rented" : "Get on Rent"}</Text>
        </AnimatedTouchable>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="none" onRequestClose={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rent This Machine</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#1E88E5" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Machine Details</Text>

              <View style={styles.modalDetailItem}>
                <Ionicons name="cube-outline" size={20} color="#1E88E5" />
                <Text style={styles.modalDetailText}>{machine.name || "Unnamed Machine"}</Text>
              </View>

              <View style={styles.modalDetailItem}>
                <Ionicons name="construct-outline" size={20} color="#1E88E5" />
                <Text style={styles.modalDetailText}>{machine.type || "Type not specified"}</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Owner Details</Text>

              <View style={styles.modalDetailItem}>
                <Ionicons name="person-outline" size={20} color="#1E88E5" />
                <Text style={styles.modalDetailText}>{machine.owner || "Unknown Owner"}</Text>
              </View>

              <View style={styles.modalDetailItem}>
                <Ionicons name="call-outline" size={20} color="#1E88E5" />
                <Text style={styles.modalDetailText}>{machine.ownerPhone || "Phone not available"}</Text>
              </View>

              <View style={styles.modalDetailItem}>
                <Ionicons name="mail-outline" size={20} color="#1E88E5" />
                <Text style={styles.modalDetailText}>{machine.ownerEmail || "Email not available"}</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Other Details</Text>

              <View style={styles.modalDetailItem}>
                <Ionicons name="calendar-outline" size={20} color="#1E88E5" />
                <Text style={styles.modalDetailText}>Listed on: {machine.listingDate || "Date not available"}</Text>
              </View>

              <View style={styles.modalDetailItem}>
                <Ionicons name="today-outline" size={20} color="#1E88E5" />
                <Text style={styles.modalDetailText}>Today's Date: {currentDate}</Text>
              </View>
            </View>

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity style={[styles.modalButton, styles.contactButton]} onPress={handleContactOwner}>
                <Text style={styles.contactButtonText}>Contact Owner</Text>
              </TouchableOpacity>

              {!isRented && (
                <TouchableOpacity style={[styles.modalButton, styles.rentNowButton]} onPress={handleRentMachine}>
                  <Text style={styles.rentNowButtonText}>Rent Now</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 350,
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "white",
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E88E5",
  },
  priceUnit: {
    fontSize: 16,
    color: "#555",
    marginLeft: 4,
  },
  rentalStatusContainer: {
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  rentalStatusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  rentedStatusText: {
    color: "#D32F2F",
  },
  availableStatusText: {
    color: "#388E3C",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "rgba(30, 136, 229, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(30, 136, 229, 0.2)",
  },
  tagText: {
    fontSize: 14,
    color: "#1E88E5",
    fontWeight: "500",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  availabilityContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  availabilityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  ownerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  ownerContact: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  spacer: {
    height: 80,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  rentButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  rentedButton: {
    backgroundColor: "#9E9E9E",
  },
  rentButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E88E5",
  },
  modalSection: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 8,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E88E5",
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#1E88E5",
    paddingLeft: 8,
  },
  modalDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  modalDetailText: {
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
  },
  contactButton: {
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },
  contactButtonText: {
    color: "#1E88E5",
    fontWeight: "700",
    fontSize: 16,
  },
  rentNowButton: {
    backgroundColor: "#1E88E5",
    marginLeft: 8,
  },
  rentNowButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 12,
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: "#555",
    flex: 1,
  },
})

