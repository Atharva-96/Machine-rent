import * as AuthSession from "expo-auth-session"
import { Platform } from "react-native"

// Google Auth Configuration
const googleConfig = {
  clientId:
    Platform.OS === "ios"
      ? "YOUR_IOS_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
      : "YOUR_ANDROID_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
  redirectUri: AuthSession.makeRedirectUri({
    scheme: "machine-rentals",
  }),
  scopes: ["profile", "email"],
}

// Google Sign In
export const signInWithGoogle = async () => {
  try {
    const discovery = await AuthSession.fetchDiscoveryAsync("https://accounts.google.com")

    const request = new AuthSession.AuthRequest({
      clientId: googleConfig.clientId,
      scopes: googleConfig.scopes,
      redirectUri: googleConfig.redirectUri,
    })

    const result = await request.promptAsync(discovery)

    if (result.type === "success") {
      // Get user info using the access token
      const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
      })

      const userInfo = await userInfoResponse.json()
      return {
        success: true,
        user: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          photo: userInfo.picture,
        },
      }
    } else {
      return { success: false, error: "Google sign in was cancelled or failed" }
    }
  } catch (error) {
    console.error("Error signing in with Google:", error)
    return { success: false, error: "Failed to sign in with Google" }
  }
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters long" }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one uppercase letter" }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain at least one lowercase letter" }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain at least one number" }
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, message: "Password must contain at least one special character" }
  }

  return { valid: true, message: "Password is strong" }
}

