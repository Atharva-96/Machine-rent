"use client"

import type React from "react"
import { createContext, useState, useContext, type ReactNode, useEffect } from "react"
import type { Machine } from "../components/machine-card"

// Initial mock data for machines
const initialMachines: Machine[] = [
  {
    id: "1",
    name: "Excavator XL2000",
    description:
      "Heavy duty excavator for construction sites. Features a powerful engine and advanced hydraulic system for efficient digging and material handling. Suitable for large construction projects.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Excavator+Front",
      "https://placeholder.svg?height=400&width=600&text=Excavator+Side",
      "https://placeholder.svg?height=400&width=600&text=Excavator+Back",
      "https://placeholder.svg?height=400&width=600&text=Excavator+Cabin",
    ],
    type: "Excavator",
    fuelType: "Diesel",
    industryType: "Construction",
    availableUntil: "2023-12-31",
    owner: "John Doe",
    contactDetails: "john.doe@example.com",
    ownerPhone: "+1 (555) 123-4567",
    ownerEmail: "john.doe@example.com",
    listingDate: "2023-10-15",
    price: 2500,
    daysRemaining: 15,
  },
  {
    id: "2",
    name: "Bulldozer Pro",
    description:
      "Powerful bulldozer for land clearing and grading operations. Equipped with a robust blade and ripper for handling tough terrain. Ideal for construction and mining projects.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Bulldozer+Front",
      "https://placeholder.svg?height=400&width=600&text=Bulldozer+Side",
      "https://placeholder.svg?height=400&width=600&text=Bulldozer+Back",
    ],
    type: "Bulldozer",
    fuelType: "Diesel",
    industryType: "Construction",
    availableUntil: "2023-12-25",
    owner: "John Doe",
    contactDetails: "john.doe@example.com",
    ownerPhone: "+1 (555) 123-4567",
    ownerEmail: "john.doe@example.com",
    listingDate: "2023-10-10",
    price: 3000,
    daysRemaining: 10,
  },
  {
    id: "3",
    name: "Crane T500",
    description:
      "High-reach crane for tall buildings and heavy lifting operations. Features advanced stabilization systems and precise controls for safe operation at height.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Crane+Full",
      "https://placeholder.svg?height=400&width=600&text=Crane+Boom",
      "https://placeholder.svg?height=400&width=600&text=Crane+Controls",
    ],
    type: "Crane",
    fuelType: "Diesel",
    industryType: "Construction",
    availableUntil: "2024-01-15",
    owner: "Sky High Rentals",
    contactDetails: "rentals@skyhigh.com",
    ownerPhone: "+1 (555) 987-6543",
    ownerEmail: "rentals@skyhigh.com",
    listingDate: "2023-09-20",
    price: 4500,
    daysRemaining: 30,
  },
  {
    id: "4",
    name: "Forklift Mini",
    description:
      "Compact forklift for warehouses and indoor material handling. Electric-powered for zero emissions, making it ideal for enclosed spaces and food storage facilities.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Forklift+Front",
      "https://placeholder.svg?height=400&width=600&text=Forklift+Side",
    ],
    type: "Forklift",
    fuelType: "Electric",
    industryType: "Warehouse",
    availableUntil: "2023-12-20",
    owner: "Warehouse Solutions",
    contactDetails: "support@warehousesolutions.com",
    ownerPhone: "+1 (555) 456-7890",
    ownerEmail: "support@warehousesolutions.com",
    listingDate: "2023-10-05",
    price: 1500,
    daysRemaining: 5,
  },
  {
    id: "5",
    name: "Concrete Mixer",
    description:
      "Industrial concrete mixer for large projects. Features high-capacity drum and reliable mixing action for consistent concrete quality on construction sites.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Mixer+Full",
      "https://placeholder.svg?height=400&width=600&text=Mixer+Drum",
    ],
    type: "Mixer",
    fuelType: "Diesel",
    industryType: "Construction",
    availableUntil: "2024-01-10",
    owner: "Concrete Kings",
    contactDetails: "info@concretekings.com",
    ownerPhone: "+1 (555) 234-5678",
    ownerEmail: "info@concretekings.com",
    listingDate: "2023-09-15",
    price: 1800,
    daysRemaining: 25,
    rentedOn: "2023-10-15", // Already rented
  },
  {
    id: "6",
    name: "Scissor Lift",
    description:
      "Electric scissor lift for indoor work at height. Provides stable elevated platform for maintenance, installation, and repair tasks in commercial and industrial settings.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Lift+Extended",
      "https://placeholder.svg?height=400&width=600&text=Lift+Folded",
      "https://placeholder.svg?height=400&width=600&text=Lift+Platform",
    ],
    type: "Lift",
    fuelType: "Electric",
    industryType: "Maintenance",
    availableUntil: "2023-12-28",
    owner: "Lift & Shift Co.",
    contactDetails: "rentals@liftshift.com",
    ownerPhone: "+1 (555) 345-6789",
    ownerEmail: "rentals@liftshift.com",
    listingDate: "2023-10-01",
    price: 1200,
    daysRemaining: 12,
    rentedOn: "2023-10-10", // Already rented
  },
  {
    id: "7",
    name: "Tractor 4x4",
    description:
      "All-terrain tractor for agricultural use. Features four-wheel drive for excellent traction in varied field conditions and powerful engine for pulling implements.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Tractor+Side",
      "https://placeholder.svg?height=400&width=600&text=Tractor+Front",
    ],
    type: "Tractor",
    fuelType: "Diesel",
    industryType: "Agriculture",
    availableUntil: "2024-02-15",
    owner: "Farm Equipment Ltd.",
    contactDetails: "sales@farmequipment.com",
    ownerPhone: "+1 (555) 567-8901",
    ownerEmail: "sales@farmequipment.com",
    listingDate: "2023-09-10",
    price: 2000,
  },
  {
    id: "8",
    name: "Dump Truck",
    description:
      "Large capacity dump truck for construction and mining operations. Designed for heavy-duty hauling of materials like soil, gravel, and demolition waste.",
    image: "https://placeholder.svg?height=200&width=200",
    images: [
      "https://placeholder.svg?height=400&width=600&text=Truck+Side",
      "https://placeholder.svg?height=400&width=600&text=Truck+Back",
      "https://placeholder.svg?height=400&width=600&text=Truck+Cabin",
    ],
    type: "Truck",
    fuelType: "Diesel",
    industryType: "Construction",
    availableUntil: "2024-01-05",
    owner: "Heavy Haulers",
    contactDetails: "dispatch@heavyhaulers.com",
    ownerPhone: "+1 (555) 678-9012",
    ownerEmail: "dispatch@heavyhaulers.com",
    listingDate: "2023-09-25",
    price: 3500,
  },
]

// Initial mock data for user profile
export type UserProfile = {
  name: string
  email: string
  phone: string
  address: string
  profileImage: string
}

const initialUserProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main St, Anytown, USA",
  profileImage: "https://placeholder.svg?height=150&width=150",
}

// Context type definitions
type MachineContextType = {
  machines: Machine[]
  addMachine: (machine: Omit<Machine, "id">) => void
  rentMachine: (machineId: string) => void
  userProfile: UserProfile
  updateUserProfile: (profile: UserProfile) => void
  userMachines: Machine[]
  rentedMachines: Machine[]
  refreshMachines: () => Promise<void>
}

// Create context
const MachineContext = createContext<MachineContextType | undefined>(undefined)

// Provider component
export const MachineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>(initialMachines)
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile)
  const [userRentedMachineIds, setUserRentedMachineIds] = useState<string[]>(["5", "6"])

  // User's own machines (first two from the initial list)
  const userMachines = machines.filter((machine) => machine.owner === userProfile.name || machine.owner === "John Doe")

  // Machines rented by the user
  const rentedMachines = machines.filter((machine) => userRentedMachineIds.includes(machine.id))

  // Add a new machine
  const addMachine = (machine: Omit<Machine, "id">) => {
    const currentDate = new Date()
    const listingDate = currentDate.toISOString().split("T")[0]

    // Calculate days remaining based on availableUntil date
    const availableUntil = new Date(machine.availableUntil)
    const diffTime = availableUntil.getTime() - currentDate.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    const newMachine: Machine = {
      ...machine,
      id: (machines.length + 1).toString(),
      owner: userProfile.name,
      contactDetails: userProfile.email,
      ownerPhone: userProfile.phone,
      ownerEmail: userProfile.email,
      listingDate: listingDate,
      daysRemaining: Math.max(0, daysRemaining), // Ensure non-negative
    }

    setMachines([newMachine, ...machines])
  }

  // Rent a machine
  const rentMachine = (machineId: string) => {
    if (!userRentedMachineIds.includes(machineId)) {
      setUserRentedMachineIds([...userRentedMachineIds, machineId])

      // Get current date
      const currentDate = new Date()
      const rentedOnDate = currentDate.toISOString().split("T")[0]

      // Update the machine to show it's rented
      setMachines(
        machines.map((machine) => {
          if (machine.id === machineId) {
            // Calculate days remaining based on availableUntil date
            const availableUntil = new Date(machine.availableUntil)
            const diffTime = availableUntil.getTime() - currentDate.getTime()
            const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            return {
              ...machine,
              rentedOn: rentedOnDate,
              daysRemaining: Math.max(0, daysRemaining), // Ensure non-negative
            }
          }
          return machine
        }),
      )

      // Log for debugging
      console.log(`Machine ${machineId} has been rented and added to user's rentals`)
    }
  }

  // Update user profile
  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile)
  }

  // Calculate days remaining for all machines
  const calculateDaysRemaining = () => {
    const currentDate = new Date()

    setMachines(
      machines.map((machine) => {
        if (machine.availableUntil) {
          const availableUntil = new Date(machine.availableUntil)
          const diffTime = availableUntil.getTime() - currentDate.getTime()
          const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

          return {
            ...machine,
            daysRemaining: Math.max(0, daysRemaining), // Ensure non-negative
          }
        }
        return machine
      }),
    )
  }

  // Refresh machines - simulates fetching updated data
  const refreshMachines = async (): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Recalculate days remaining
    calculateDaysRemaining()

    // Return a resolved promise
    return Promise.resolve()
  }

  // Update days remaining when component mounts
  useEffect(() => {
    calculateDaysRemaining()

    // Set up interval to update days remaining daily
    const interval = setInterval(calculateDaysRemaining, 24 * 60 * 60 * 1000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <MachineContext.Provider
      value={{
        machines,
        addMachine,
        rentMachine,
        userProfile,
        updateUserProfile,
        userMachines,
        rentedMachines,
        refreshMachines,
      }}
    >
      {children}
    </MachineContext.Provider>
  )
}

// Custom hook to use the machine context
export const useMachineContext = () => {
  const context = useContext(MachineContext)
  if (context === undefined) {
    throw new Error("useMachineContext must be used within a MachineProvider")
  }
  return context
}
