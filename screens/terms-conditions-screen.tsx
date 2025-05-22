"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function TermsConditionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E88E5" />
        </TouchableOpacity>
        <Text style={styles.title}>Terms and Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: March 23, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Machine Rentals. These Terms and Conditions govern your use of our mobile application and
            services. By accessing or using our application, you agree to be bound by these Terms. If you disagree with
            any part of the terms, you may not access the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Definitions</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>"Application"</Text> refers to the Machine Rentals mobile application.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>"User"</Text> refers to the individual accessing or using the Application.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>"Service"</Text> refers to the machine rental facilitation service provided
            through the Application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            When you create an account with us, you must provide information that is accurate, complete, and current at
            all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of
            your account.
          </Text>
          <Text style={styles.paragraph}>
            You are responsible for safeguarding the password that you use to access the Application and for any
            activities or actions under your password.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Machine Listings</Text>
          <Text style={styles.paragraph}>
            Users may list machines for rent on the Application. By listing a machine, you represent and warrant that:
          </Text>
          <Text style={styles.listItem}>• You own or have the right to rent the machine</Text>
          <Text style={styles.listItem}>• The machine is in good working condition</Text>
          <Text style={styles.listItem}>• All information provided about the machine is accurate</Text>
          <Text style={styles.listItem}>
            • You have all necessary permits and licenses required for renting the machine
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Rental Agreements</Text>
          <Text style={styles.paragraph}>
            The Application facilitates rental agreements between users. Machine Rentals is not a party to these
            agreements and assumes no responsibility for the actions or omissions of any user.
          </Text>
          <Text style={styles.paragraph}>
            Users are solely responsible for negotiating, entering into, and fulfilling rental agreements. We recommend
            documenting all terms in writing outside of the Application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Fees and Payments</Text>
          <Text style={styles.paragraph}>
            Machine Rentals may charge fees for the use of certain features of the Application. You agree to pay all
            fees and charges incurred in connection with your account.
          </Text>
          <Text style={styles.paragraph}>
            Payments between users for machine rentals are handled directly between the parties. Machine Rentals is not
            responsible for any payment disputes between users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            In no event shall Machine Rentals, its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </Text>
          <Text style={styles.listItem}>• Your access to or use of or inability to access or use the Application</Text>
          <Text style={styles.listItem}>• Any conduct or content of any third party on the Application</Text>
          <Text style={styles.listItem}>• Any content obtained from the Application</Text>
          <Text style={styles.listItem}>• Unauthorized access, use or alteration of your transmissions or content</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
            material we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </Text>
          <Text style={styles.paragraph}>
            By continuing to access or use our Application after those revisions become effective, you agree to be bound
            by the revised terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>If you have any questions about these Terms, please contact us at:</Text>
          <Text style={styles.contactInfo}>support@machinerentals.com</Text>
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

