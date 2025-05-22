import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native"

export type Machine = {
  id: string
  name: string
  description: string
  image: string
  images?: string[]
  type: string
  fuelType: string
  industryType: string
  availableUntil: string
  owner: string
  contactDetails: string
  price: number
  rentedOn?: string
  daysRemaining?: number
  ownerPhone?: string
  ownerEmail?: string
  listingDate?: string
}

type MachineCardProps = {
  machine: Machine
  onPress: (machine: Machine) => void
  showRentalStatus?: boolean
  isOwnerView?: boolean
}

const { width } = Dimensions.get("window")
const cardWidth = width / 2 - 24 // Adjusted for consistent margins

export default function MachineCard({
  machine,
  onPress,
  showRentalStatus = true,
  isOwnerView = false,
}: MachineCardProps) {
  // Determine rental status
  const isRented = machine.rentedOn !== undefined

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(machine)} activeOpacity={0.7}>
      <Image source={{ uri: machine.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {machine.name}
        </Text>
        <Text style={styles.type}>
          {machine.type} • {machine.industryType}
        </Text>
        <Text style={styles.price}>₹{machine.price}/day</Text>

        {showRentalStatus && (
          <View style={[styles.statusContainer, isRented ? styles.rentedStatus : styles.availableStatus]}>
            <Text style={[styles.statusText, isRented ? styles.rentedStatusText : styles.availableStatusText]}>
              {isRented ? "Already Rented" : isOwnerView ? "Not Yet Rented" : "Available"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  type: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E88E5",
    marginBottom: 8,
  },
  statusContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  rentedStatus: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  availableStatus: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
  },
  rentedStatusText: {
    color: "#D32F2F",
  },
  availableStatusText: {
    color: "#388E3C",
  },
  remainingContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  remainingText: {
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
})
