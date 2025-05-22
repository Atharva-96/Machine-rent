"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

import HomeScreen from "./screens/home-screen"
import BrowseScreen from "./screens/browse-screen"
import AddScreen from "./screens/add-screen"
import ProfileScreen from "./screens/profile-screen"
import EditProfileScreen from "./screens/edit-profile-screen"
import ProductDetailScreen from "./screens/product-detail-screen"
import LoginScreen from "./screens/login-screen"
import SignupScreen from "./screens/signup-screen"
import TermsConditionsScreen from "./screens/terms-conditions-screen"
import PrivacyPolicyScreen from "./screens/privacy-policy-screen"
import { MachineProvider } from "./context/machine-context"
import { AuthProvider, useAuth } from "./context/auth-context"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Browse") {
            iconName = focused ? "search" : "search-outline"
          } else if (route.name === "Add") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#1E88E5",
        tabBarInactiveTintColor: "#555",
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
        },
        headerTitleStyle: {
          color: "#1E88E5",
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: "#FFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Browse" component={BrowseScreen} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { isAuthenticated } = useAuth()

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              headerShown: true,
              title: "Edit Profile",
              headerStyle: {
                backgroundColor: "#FFF",
                borderBottomWidth: 1,
                borderBottomColor: "#E0E0E0",
              },
              headerTitleStyle: {
                color: "#1E88E5",
                fontWeight: "600",
              },
            }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: "transparent",
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTintColor: "#1E88E5",
              headerTransparent: true,
            }}
          />
          <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MachineProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </MachineProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

