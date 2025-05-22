"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E88E5" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: March 23, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Machine Rentals ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you use our mobile application.
          </Text>
          <Text style={styles.paragraph}>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please
            do not access the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.paragraph}>We may collect information about you in various ways:</Text>
          <Text style={styles.subheading}>2.1 Personal Data</Text>
          <Text style={styles.paragraph}>
            When you register an account, we may collect personally identifiable information, such as:
          </Text>
          <Text style={styles.listItem}>• Your name</Text>
          <Text style={styles.listItem}>• Email address</Text>
          <Text style={styles.listItem}>• Phone number</Text>
          <Text style={styles.listItem}>• Address</Text>
          <Text style={styles.listItem}>• Profile picture</Text>

          <Text style={styles.subheading}>2.2 Machine Listing Data</Text>
          <Text style={styles.paragraph}>
            When you list a machine for rent, we collect information about the machine, including:
          </Text>
          <Text style={styles.listItem}>• Machine name and description</Text>
          <Text style={styles.listItem}>• Machine type and specifications</Text>
          <Text style={styles.listItem}>• Rental price and availability</Text>
          <Text style={styles.listItem}>• Machine images</Text>

          <Text style={styles.subheading}>2.3 Usage Data</Text>
          <Text style={styles.paragraph}>
            We may also collect information that your device sends whenever you use our application, such as:
          </Text>
          <Text style={styles.listItem}>• Your device's IP address</Text>
          <Text style={styles.listItem}>• Device type and model</Text>
          <Text style={styles.listItem}>• Operating system</Text>
          <Text style={styles.listItem}>• The time and date of your use</Text>
          <Text style={styles.listItem}>• The pages or features you access</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>We may use the information we collect for various purposes:</Text>
          <Text style={styles.listItem}>• To provide and maintain our Service</Text>
          <Text style={styles.listItem}>• To notify you about changes to our Service</Text>
          <Text style={styles.listItem}>• To allow you to participate in interactive features of our Service</Text>
          <Text style={styles.listItem}>• To provide customer support</Text>
          <Text style={styles.listItem}>• To gather analysis or valuable information to improve our Service</Text>
          <Text style={styles.listItem}>• To monitor the usage of our Service</Text>
          <Text style={styles.listItem}>• To detect, prevent and address technical issues</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Disclosure of Your Information</Text>
          <Text style={styles.paragraph}>We may disclose your information in the following situations:</Text>
          <Text style={styles.subheading}>4.1 To Other Users</Text>
          <Text style={styles.paragraph}>
            When you list a machine or contact a machine owner, certain information will be shared with other users to
            facilitate the rental process.
          </Text>

          <Text style={styles.subheading}>4.2 Service Providers</Text>
          <Text style={styles.paragraph}>
            We may employ third-party companies and individuals to facilitate our Service, provide the Service on our
            behalf, perform Service-related services, or assist us in analyzing how our Service is used.
          </Text>

          <Text style={styles.subheading}>4.3 Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information where required to do so by law or in response to valid requests by public
            authorities.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Security of Your Information</Text>
          <Text style={styles.paragraph}>
            We use commercially reasonable security measures to protect your information. However, no method of
            transmission over the Internet or method of electronic storage is 100% secure. While we strive to use
            commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Data Protection Rights</Text>
          <Text style={styles.paragraph}>
            Depending on your location, you may have certain rights regarding your personal information:
          </Text>
          <Text style={styles.listItem}>• The right to access the information we have about you</Text>
          <Text style={styles.listItem}>• The right to rectification of inaccurate information</Text>
          <Text style={styles.listItem}>• The right to erasure of your information</Text>
          <Text style={styles.listItem}>• The right to restrict processing of your information</Text>
          <Text style={styles.listItem}>• The right to data portability</Text>
          <Text style={styles.listItem}>• The right to object to processing of your information</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Changes to This Privacy Policy</Text>
          <Text style={styles.paragraph}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date.
          </Text>
          <Text style={styles.paragraph}>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
            are effective when they are posted on this page.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>privacy@machinerentals.com</Text>
          <Text style={styles.contactInfo}>+1 (555) 123-4567</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    fontStyle: "italic",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 12,
  },
  bold: {
    fontWeight: "700",
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 8,
    marginLeft: 16,
  },
  contactInfo: {
    fontSize: 16,
    color: "#1E88E5",
    marginBottom: 8,
    fontWeight: "500",
  },
})

