"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import MachineCard from "../components/machine-card"
import { useMachineContext } from "../context/machine-context"

export default function ProfileScreen({ navigation, route }) {
  const { userProfile, userMachines, rentedMachines, refreshMachines } = useMachineContext()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [refreshing, setRefreshing] = useState(false)

  // Check if we should show a specific tab based on navigation params
  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab)
      // Clear the params to avoid re-triggering this effect
      navigation.setParams({ initialTab: undefined })
      // Log for debugging
      console.log(`Setting active tab to: ${route.params.initialTab}`)
    }
  }, [route.params])

  const handleMachinePress = (machine) => {
    navigation.navigate("ProductDetail", { machineId: machine.id })
  }

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const handleAddMachine = () => {
    navigation.navigate("Add")
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    // Refresh data
    await refreshMachines()
    setRefreshing(false)
  }, [refreshMachines])

  // Stats for the dashboard
  const stats = {
    totalEarnings: userMachines.reduce((sum, machine) => sum + machine.price, 0),
    activeListings: userMachines.length,
    totalRentals: rentedMachines.length,
  }

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{stats.totalEarnings}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.activeListings}</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalRentals}</Text>
          <Text style={styles.statLabel}>Total Rentals</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Listed Machines</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {userMachines.map((machine) => (
            <View key={machine.id} style={styles.horizontalCard}>
              <MachineCard machine={machine} onPress={handleMachinePress} isOwnerView={true} />
            </View>
          ))}
          <TouchableOpacity style={styles.addCardButton} onPress={handleAddMachine}>
            <Ionicons name="add" size={40} color="#1E88E5" />
            <Text style={styles.addCardText}>List New Machine</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Machines You've Rented</Text>
        {rentedMachines.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {rentedMachines.map((machine) => (
              <View key={machine.id} style={styles.horizontalCard}>
                <MachineCard machine={machine} onPress={handleMachinePress} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={40} color="#BDBDBD" />
            <Text style={styles.emptyStateText}>You haven't rented any machines yet</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rental Activity</Text>
        <View style={styles.activityChart}>
          <Text style={styles.chartPlaceholder}>Rental activity chart would be displayed here</Text>
        </View>
      </View>
    </View>
  )

  const renderListings = () => (
    <View style={styles.listingsContainer}>
      <Text style={styles.sectionTitle}>Your Listed Machines</Text>
      {userMachines.length > 0 ? (
        userMachines.map((machine) => (
          <TouchableOpacity key={machine.id} style={styles.listingItem} onPress={() => handleMachinePress(machine)}>
            <Image source={{ uri: machine.image }} style={styles.listingImage} />
            <View style={styles.listingDetails}>
              <Text style={styles.listingName}>{machine.name}</Text>
              <Text style={styles.listingType}>
                {machine.type} • {machine.industryType}
              </Text>
              <Text style={styles.listingPrice}>₹{machine.price}/day</Text>

              <View style={[styles.rentalStatusBadge, machine.rentedOn ? styles.rentedBadge : styles.availableBadge]}>
                <Text style={[styles.rentalStatusText, machine.rentedOn ? styles.rentedText : styles.availableText]}>
                  {machine.rentedOn ? "Already Rented" : "Not Yet Rented"}
                </Text>
              </View>

              <View style={styles.listingStatus}>
                <Text style={styles.listingStatusText}>
                  {machine.daysRemaining ? `${machine.daysRemaining} days remaining` : "Active"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.listingAction}>
              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={40} color="#BDBDBD" />
          <Text style={styles.emptyStateText}>You haven't listed any machines yet</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddMachine}>
        <Text style={styles.addButtonText}>Add New Machine</Text>
      </TouchableOpacity>
    </View>
  )

  const renderRentals = () => (
    <View style={styles.listingsContainer}>
      <Text style={styles.sectionTitle}>Machines You've Rented</Text>
      {rentedMachines.length > 0 ? (
        rentedMachines.map((machine) => (
          <TouchableOpacity key={machine.id} style={styles.listingItem} onPress={() => handleMachinePress(machine)}>
            <Image source={{ uri: machine.image }} style={styles.listingImage} />
            <View style={styles.listingDetails}>
              <Text style={styles.listingName}>{machine.name}</Text>
              <Text style={styles.listingType}>
                {machine.type} • {machine.industryType}
              </Text>
              <Text style={styles.listingPrice}>₹{machine.price}/day</Text>

              <View style={[styles.rentalStatusBadge, styles.rentedBadge]}>
                <Text style={[styles.rentalStatusText, styles.rentedText]}>Already Rented</Text>
              </View>

              <View style={styles.listingStatus}>
                <Text style={styles.listingStatusText}>
                  {machine.daysRemaining ? `${machine.daysRemaining} days remaining` : "Active"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.listingAction}>
              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={40} color="#BDBDBD" />
          <Text style={styles.emptyStateText}>You haven't rented any machines yet</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Browse")}>
            <Text style={styles.browseButtonText}>Browse Machines</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#1E88E5"]} />}
    >
      <View style={styles.profileHeader}>
        <Image source={{ uri: userProfile.profileImage }} style={styles.profileImage} />
        <TouchableOpacity
          style={styles.changeImageButton}
          onPress={() => navigation.navigate("EditProfile", { showImagePicker: true })}
        >
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileEmail}>{userProfile.email}</Text>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dashboard" && styles.activeTab]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Text style={[styles.tabText, activeTab === "dashboard" && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "listings" && styles.activeTab]}
          onPress={() => setActiveTab("listings")}
        >
          <Text style={[styles.tabText, activeTab === "listings" && styles.activeTabText]}>My Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "rentals" && styles.activeTab]}
          onPress={() => setActiveTab("rentals")}
        >
          <Text style={[styles.tabText, activeTab === "rentals" && styles.activeTabText]}>My Rentals</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "listings" && renderListings()}
      {activeTab === "rentals" && renderRentals()}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  profileHeader: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    position: "relative",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  changeImageButton: {
    position: "absolute",
    bottom: 16,
    left: 60,
    backgroundColor: "#1E88E5",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
    zIndex: 1,
  },
  profileInfo: {
    marginLeft: 16,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  profileEmail: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  editProfileButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  editProfileButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E88E5",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#1E88E5",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  activeTabText: {
    color: "#1E88E5",
  },
  dashboardContainer: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E88E5",
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  horizontalList: {
    paddingLeft: 4,
    paddingRight: 16,
  },
  horizontalCard: {
    width: 180,
    marginLeft: 12,
  },
  addCardButton: {
    width: 180,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    marginLeft: 12,
  },
  addCardText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E88E5",
  },
  activityChart: {
    height: 200,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  chartPlaceholder: {
    color: "#555",
  },
  listingsContainer: {
    padding: 16,
  },
  listingItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  listingImage: {
    width: 80,
    height: 80,
    backgroundColor: "#F5F5F5",
    objectFit: "cover",
  },
  listingDetails: {
    flex: 1,
    padding: 12,
  },
  listingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  listingType: {
    fontSize: 12,
    color: "#555",
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E88E5",
    marginBottom: 6,
  },
  rentalStatusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  rentedBadge: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  availableBadge: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  rentalStatusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  rentedText: {
    color: "#D32F2F",
  },
  availableText: {
    color: "#388E3C",
  },
  listingStatus: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  listingStatusText: {
    fontSize: 10,
    color: "#000",
  },
  listingAction: {
    padding: 12,
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#555",
    marginTop: 12,
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
})

