"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/auth-context"
import { validateEmail, validatePassword, signInWithGoogle } from "../utils/auth"

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const [termsError, setTermsError] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { signup, isLoading } = useAuth()

  const validateInputs = () => {
    let isValid = true

    // Validate name
    if (!name) {
      setNameError("Name is required")
      isValid = false
    } else {
      setNameError("")
    }

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
      const passwordValidation = validatePassword(password)
      if (!passwordValidation.valid) {
        setPasswordError(passwordValidation.message)
        isValid = false
      } else {
        setPasswordError("")
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password")
      isValid = false
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      isValid = false
    } else {
      setConfirmPasswordError("")
    }

    // Validate terms agreement
    if (!agreeToTerms) {
      setTermsError("You must agree to the Terms and Conditions")
      isValid = false
    } else {
      setTermsError("")
    }

    return isValid
  }

  const handleSignup = async () => {
    if (!validateInputs()) {
      return
    }

    const success = await signup(name, email, password)
    if (!success) {
      Alert.alert("Signup Failed", "There was an error creating your account. Please try again.")
    }
  }

  const handleGoogleSignup = async () => {
    setIsAuthenticating(true)
    try {
      const result = await signInWithGoogle()
      if (result.success) {
        // In a real app, you would send this token to your backend
        // For now, we'll simulate a successful signup
        await signup(result.user.name, result.user.email, "google-auth-token")
      } else {
        Alert.alert("Signup Failed", result.error || "Failed to signup with Google")
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during Google signup")
      console.error(error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  const handleLogin = () => {
    navigation.navigate("Login")
  }

  const handleViewTerms = () => {
    navigation.navigate("TermsConditions")
  }

  const handleViewPrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy")
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1E88E5" />
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#1E88E5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={(text) => {
                setName(text)
                if (nameError && text) {
                  setNameError("")
                }
              }}
            />
          </View>
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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
                if (passwordError) {
                  const validation = validatePassword(text)
                  if (validation.valid) {
                    setPasswordError("")
                  }
                }
              }}
            />
            <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#1E88E5" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text)
                if (confirmPasswordError && text === password) {
                  setConfirmPasswordError("")
                }
              }}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#555" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => {
                setAgreeToTerms(!agreeToTerms)
                if (termsError && !agreeToTerms) {
                  setTermsError("")
                }
              }}
            >
              {agreeToTerms ? (
                <Ionicons name="checkbox" size={24} color="#1E88E5" />
              ) : (
                <Ionicons name="square-outline" size={24} color="#555" />
              )}
            </TouchableOpacity>
            <Text style={styles.termsText}>
              I agree to the{" "}
              <Text style={styles.termsLink} onPress={handleViewTerms}>
                Terms and Conditions
              </Text>{" "}
              and{" "}
              <Text style={styles.termsLink} onPress={handleViewPrivacyPolicy}>
                Privacy Policy
              </Text>
            </Text>
          </View>
          {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}

          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={isLoading || isAuthenticating}>
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignup}
            disabled={isLoading || isAuthenticating}
          >
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    marginRight: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  termsLink: {
    color: "#1E88E5",
    fontWeight: "600",
  },
  signupButton: {
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
  signupButtonText: {
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#555",
    fontSize: 14,
  },
  loginLink: {
    color: "#1E88E5",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 4,
  },
})

