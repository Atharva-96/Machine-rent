"use client"

import { useState, useEffect, useCallback } from "react"
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native"
import MachineCard from "../components/machine-card"
import SearchBar from "../components/search-bar"
import { Ionicons } from "@expo/vector-icons"
import { useMachineContext } from "../context/machine-context"

// Filter options
const filterOptions = {
  types: ["All", "Excavator", "Bulldozer", "Crane", "Forklift", "Mixer", "Lift", "Tractor", "Truck"],
  industries: ["All", "Construction", "Warehouse", "Agriculture", "Maintenance", "Mining", "Transportation"],
  fuelTypes: ["All", "Diesel", "Electric", "Gasoline", "Hybrid"],
}

export default function BrowseScreen({ navigation, route }) {
  const { machines, refreshMachines } = useMachineContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedType, setSelectedType] = useState("All")
  const [selectedIndustry, setSelectedIndustry] = useState("All")
  const [selectedFuelType, setSelectedFuelType] = useState("All")
  const [refreshing, setRefreshing] = useState(false)

  // Check if we have any parameters from navigation
  useEffect(() => {
    if (route.params?.searchQuery) {
      setSearchQuery(route.params.searchQuery)
    }

    if (route.params?.selectedIndustry) {
      setSelectedIndustry(route.params.selectedIndustry)
    }
  }, [route.params])

  const handleMachinePress = (machine) => {
    navigation.navigate("ProductDetail", { machineId: machine.id })
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    // Refresh data
    await refreshMachines()
    setRefreshing(false)
  }, [refreshMachines])

  // Filter machines based on search query and selected filters
  const filteredMachines = machines.filter((machine) => {
    // Search across multiple fields
    const matchesSearch =
      searchQuery.toLowerCase().trim() === "" ||
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.industryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.fuelType.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "All" || machine.type === selectedType
    const matchesIndustry = selectedIndustry === "All" || machine.industryType === selectedIndustry
    const matchesFuelType = selectedFuelType === "All" || machine.fuelType === selectedFuelType

    return matchesSearch && matchesType && matchesIndustry && matchesFuelType
  })

  const renderFilterChips = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedType !== "All" && (
          <TouchableOpacity style={styles.filterChip} onPress={() => setSelectedType("All")}>
            <Text style={styles.filterChipText}>{selectedType}</Text>
            <Ionicons name="close-circle" size={16} color="#1E88E5" />
          </TouchableOpacity>
        )}

        {selectedIndustry !== "All" && (
          <TouchableOpacity style={styles.filterChip} onPress={() => setSelectedIndustry("All")}>
            <Text style={styles.filterChipText}>{selectedIndustry}</Text>
            <Ionicons name="close-circle" size={16} color="#1E88E5" />
          </TouchableOpacity>
        )}

        {selectedFuelType !== "All" && (
          <TouchableOpacity style={styles.filterChip} onPress={() => setSelectedFuelType("All")}>
            <Text style={styles.filterChipText}>{selectedFuelType}</Text>
            <Ionicons name="close-circle" size={16} color="#1E88E5" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )

  const renderFilterSection = () => (
    <View style={styles.filterSection}>
      <View style={styles.filterGroup}>
        <Text style={styles.filterTitle}>Machine Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.types.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterOption, selectedType === type && styles.filterOptionSelected]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[styles.filterOptionText, selectedType === type && styles.filterOptionTextSelected]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterGroup}>
        <Text style={styles.filterTitle}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.industries.map((industry) => (
            <TouchableOpacity
              key={industry}
              style={[styles.filterOption, selectedIndustry === industry && styles.filterOptionSelected]}
              onPress={() => setSelectedIndustry(industry)}
            >
              <Text style={[styles.filterOptionText, selectedIndustry === industry && styles.filterOptionTextSelected]}>
                {industry}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.filterGroup}>
        <Text style={styles.filterTitle}>Fuel Type</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.fuelTypes.map((fuelType) => (
            <TouchableOpacity
              key={fuelType}
              style={[styles.filterOption, selectedFuelType === fuelType && styles.filterOptionSelected]}
              onPress={() => setSelectedFuelType(fuelType)}
            >
              <Text style={[styles.filterOptionText, selectedFuelType === fuelType && styles.filterOptionTextSelected]}>
                {fuelType}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          showFilterButton={true}
          onFilterPress={() => setShowFilters(!showFilters)}
        />
      </View>

      {(selectedType !== "All" || selectedIndustry !== "All" || selectedFuelType !== "All") && renderFilterChips()}

      {showFilters && renderFilterSection()}

      <Text style={styles.resultsText}>{filteredMachines.length} machines available</Text>

      <FlatList
        data={filteredMachines}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <MachineCard machine={item} onPress={handleMachinePress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1E88E5"]} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardContainer: {
    marginBottom: 16,
  },
  resultsText: {
    marginLeft: 16,
    marginBottom: 8,
    fontSize: 14,
    color: "#555",
  },
  filterSection: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#000",
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterOptionSelected: {
    backgroundColor: "#1E88E5",
    borderColor: "#1E88E5",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#000",
  },
  filterOptionTextSelected: {
    color: "white",
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterChipText: {
    fontSize: 14,
    color: "#1E88E5",
    marginRight: 4,
  },
})

