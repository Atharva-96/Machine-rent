"use client"

import { useState } from "react"
import { View, TextInput, StyleSheet, TouchableOpacity, Modal, Text, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type SearchBarProps = {
  value: string
  onChangeText: (text: string) => void
  onSubmit?: () => void
  placeholder?: string
  onFilterPress?: () => void
  showFilterButton?: boolean
}

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search for machines...",
  onFilterPress,
  showFilterButton = false,
}: SearchBarProps) {
  const [showSearchModal, setShowSearchModal] = useState(false)

  const handleSearchPress = () => {
    setShowSearchModal(true)
  }

  const handleCloseModal = () => {
    setShowSearchModal(false)
    if (onSubmit) onSubmit()
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearchPress}>
            <Ionicons name="search" size={20} color="#555" style={styles.icon} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#999"
            returnKeyType="search"
            onSubmitEditing={onSubmit}
            onFocus={handleSearchPress}
          />
          {value.length > 0 && (
            <TouchableOpacity onPress={() => onChangeText("")}>
              <Ionicons name="close-circle" size={20} color="#555" />
            </TouchableOpacity>
          )}
          {showFilterButton && (
            <TouchableOpacity onPress={onFilterPress} style={styles.filterButton}>
              <Ionicons name="options-outline" size={20} color="#555" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Modal visible={showSearchModal} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Machines</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchContainer}>
              <Ionicons name="search" size={20} color="#555" style={styles.icon} />
              <TextInput
                style={styles.modalInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                returnKeyType="search"
                autoFocus
                onSubmitEditing={handleCloseModal}
              />
              {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText("")}>
                  <Ionicons name="close-circle" size={20} color="#555" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.recentSearches}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              <ScrollView>
                {["Excavator", "Bulldozer", "Crane", "Forklift", "Construction"].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.recentSearchItem}
                    onPress={() => {
                      onChangeText(item)
                      handleCloseModal()
                    }}
                  >
                    <Ionicons name="time-outline" size={16} color="#555" />
                    <Text style={styles.recentSearchText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.searchButton} onPress={handleCloseModal}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  filterButton: {
    marginLeft: 8,
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  modalSearchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  recentSearches: {
    flex: 1,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  recentSearchText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
  },
  searchButton: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
})
