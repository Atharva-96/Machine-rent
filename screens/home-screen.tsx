"use client"

import { useState, useCallback } from "react"
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import MachineCard from "../components/machine-card"
import SearchBar from "../components/search-bar"
import { useMachineContext } from "../context/machine-context"

export default function HomeScreen({ navigation }) {
  const { machines, refreshMachines } = useMachineContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Get top listings (first 4 machines)
  const topListings = machines.slice(0, 4)

  // Get recently added (last 2 machines)
  const recentRentals = machines.slice(4, 6)

  const handleMachinePress = (machine) => {
    navigation.navigate("ProductDetail", { machineId: machine.id })
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate("Browse", { searchQuery })
    }
  }

  const handleCategoryPress = (category) => {
    navigation.navigate("Browse", { selectedIndustry: category })
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    // Refresh data
    await refreshMachines()
    setRefreshing(false)
  }, [refreshMachines])

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1E88E5"]} />}
    >
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} onSubmit={handleSearch} />

      {/* Popular Categories - Moved to be right after search bar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.categoriesContainer}>
          {["Construction", "Agriculture", "Warehouse", "Mining", "Transportation", "Maintenance"].map((category) => (
            <TouchableOpacity key={category} style={styles.categoryItem} onPress={() => handleCategoryPress(category)}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Listings</Text>
        <FlatList
          data={topListings}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <MachineCard machine={item} onPress={handleMachinePress} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recently Added</Text>
        <FlatList
          data={recentRentals}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <MachineCard machine={item} onPress={handleMachinePress} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 12,
    color: "#000",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardWrapper: {
    width: 180,
    marginRight: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },
  categoryItem: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E88E5",
  },
})

