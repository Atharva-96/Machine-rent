"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/auth-context"
import { validateEmail, signInWithGoogle } from "../utils/auth"

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordEmailError, setForgotPasswordEmailError] = useState("")
  const [showResetSentModal, setShowResetSentModal] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { login, isLoading } = useAuth()

  const validateInputs = () => {
    let isValid = true

    // Validate email
    if (!email) {
      setEmailError("Email is required")
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      isValid = false
    } else {
      setEmailError("")
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required")
      isValid = false
    } else {
      setPasswordError("")
    }

    return isValid
  }

  const handleLogin = async () => {
    if (!validateInputs()) {
      return
    }

    const success = await login(email, password)
    if (!success) {
      Alert.alert("Login Failed", "Invalid email or password. Please try again.")
    }
  }

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true)
    try {
      const result = await signInWithGoogle()
      if (result.success) {
        // In a real app, you would send this token to your backend
        // For now, we'll simulate a successful login
        await login(result.user.email, "google-auth-token")
      } else {
        Alert.alert("Login Failed", result.error || "Failed to login with Google")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during Google login")
      console.error(error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleForgotPassword = () => {
    setForgotPasswordEmail(email)
    setForgotPasswordEmailError("")
    setShowForgotPasswordModal(true)
  }

  const handleSendResetEmail = () => {
    if (!forgotPasswordEmail) {
      setForgotPasswordEmailError("Email is required")
      return
    }

    if (!validateEmail(forgotPasswordEmail)) {
      setForgotPasswordEmailError("Please enter a valid email address")
      return
    }

    // In a real app, you would call an API to send a reset email
    // For now, we'll just simulate it
    setShowForgotPasswordModal(false)
    setShowResetSentModal(true)
  }

  const handleSignup = () => {
    navigation.navigate("Signup")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/Machine.png")} style={styles.logo} />
          <Text style={styles.tagline}>Rent industrial machines with ease</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#1E88E5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (emailError && validateEmail(text)) {
                  setEmailError("")
                }
              }}
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#1E88E5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text)
                if (passwordError && text) {
                  setPasswordError("")
                }
              }}
            />
            <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading || isAuthenticating}>
            {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={isLoading || isAuthenticating}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowForgotPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalDescription}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <View style={styles.modalInputContainer}>
              <Ionicons name="mail-outline" size={20} color="#1E88E5" style={styles.inputIcon} />
              <TextInput
                style={styles.modalInput}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={forgotPasswordEmail}
                onChangeText={(text) => {
                  setForgotPasswordEmail(text)
                  if (forgotPasswordEmailError && validateEmail(text)) {
                    setForgotPasswordEmailError("")
                  }
                }}
              />
            </View>
            {forgotPasswordEmailError ? <Text style={styles.errorText}>{forgotPasswordEmailError}</Text> : null}

            <TouchableOpacity style={styles.modalButton} onPress={handleSendResetEmail}>
              <Text style={styles.modalButtonText}>Send Reset Link</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowForgotPasswordModal(false)}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Reset Email Sent Modal */}
      <Modal
        visible={showResetSentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowResetSentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
            </View>

            <Text style={styles.modalTitle}>Email Sent!</Text>
            <Text style={styles.modalDescription}>
              We've sent password reset instructions to {forgotPasswordEmail}. Please check your inbox.
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, styles.successButton]}
              onPress={() => setShowResetSentModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    borderRadius: 100, // Make the logo circular
  },
  tagline: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#000",
  },
  passwordToggle: {
    padding: 8,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#1E88E5",
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#1E88E5",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1E88E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    color: "#555",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DB4437",
    backgroundColor: "rgba(219, 68, 55, 0.05)",
  },
  googleButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    color: "#555",
    fontSize: 14,
  },
  signupLink: {
    color: "#1E88E5",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 20,
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  modalInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#000",
  },
  modalButton: {
    backgroundColor: "#1E88E5",
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalCancelButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  modalCancelButtonText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "600",
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
})

