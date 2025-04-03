const { db } = require("../config/firebase");

/**
 * 🔹 Rent a Machine (POST /api/rentals)
 */
const rentMachine = async (req, res) => {
  try {
    console.log("🔹 User ID:", req.user?.userId);
    console.log("🔹 Machine ID:", req.body.machineId);
    console.log("🔹 Rental Start Date:", req.body.rentalStartDate);
    console.log("🔹 Rental End Date:", req.body.rentalEndDate);

    const { machineId, rentalStartDate, rentalEndDate } = req.body;
    const userId = req.user.userId; // Get logged-in user

    if (!machineId || !rentalStartDate || !rentalEndDate) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Fetch machine details
    const machineRef = db.collection("machines").doc(machineId);
    const machineDoc = await machineRef.get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    const machineData = machineDoc.data();

    // Prevent renting own machine
    if (machineData.ownerId === userId) {
      return res.status(403).json({ error: "You cannot rent your own machine!" });
    }

    // Check for existing bookings during the requested period
    const bookingsRef = db.collection("rentals");
    const existingBookings = await bookingsRef.where("machineId", "==", machineId).get();

    for (const doc of existingBookings.docs) {
      const booking = doc.data();
      if (
        (new Date(rentalStartDate) >= new Date(booking.rentalStartDate) &&
          new Date(rentalStartDate) <= new Date(booking.rentalEndDate)) ||
        (new Date(rentalEndDate) >= new Date(booking.rentalStartDate) &&
          new Date(rentalEndDate) <= new Date(booking.rentalEndDate))
      ) {
        return res.status(400).json({ error: "Machine is already booked for the selected dates" });
      }
    }

    // Add rental record to Firestore
    const rentalRef = await db.collection("rentals").add({
      machineId,
      renterId: userId,
      ownerId: machineData.ownerId,
      rentalStartDate,
      rentalEndDate,
      status: "active", // Active until canceled
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Machine rented successfully!", rentalId: rentalRef.id });
  } catch (error) {
    console.error("Error renting machine:", error);
    res.status(500).json({ error: "Failed to rent machine!" });
  }
};

/**
 * 📌 Get User's Rental History (With Machine Details)
 */
const getUserRentals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const rentalsRef = db.collection("rentals").where("renterId", "==", userId);
    const snapshot = await rentalsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No rentals found." });
    }

    const rentals = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const machineRef = db.collection("machines").doc(data.machineId);
        const machineDoc = await machineRef.get();

        return {
          id: doc.id,
          machineId: data.machineId,
          rentalStartDate: data.rentalStartDate,
          rentalEndDate: data.rentalEndDate,
          createdAt: data.createdAt,
          status: data.status,
          machine: machineDoc.exists ? machineDoc.data() : null,
        };
      })
    );

    res.json({ rentals });
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ error: "Failed to fetch rentals!" });
  }
};

/**
 * 📌 Cancel Rental
 */
const cancelRental = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const userId = req.user.userId;

    // Fetch rental document
    const rentalRef = db.collection("rentals").doc(rentalId);
    const rentalDoc = await rentalRef.get();

    if (!rentalDoc.exists) {
      return res.status(404).json({ error: "Rental not found!" });
    }

    const rentalData = rentalDoc.data();

    // Only allow renter or owner to cancel
    if (rentalData.renterId !== userId && rentalData.ownerId !== userId) {
      return res.status(403).json({ error: "Unauthorized to cancel this rental!" });
    }

    // Delete rental from Firestore
    await rentalRef.delete();

    res.json({ message: "Rental canceled successfully!" });
  } catch (error) {
    console.error("Error canceling rental:", error);
    res.status(500).json({ error: "Failed to cancel rental!" });
  }
};

module.exports = { rentMachine, getUserRentals, cancelRental };


/*const { db } = require("../config/firebase");

// 🔹 Rent a Machine (POST /api/rentals)
 
const rentMachine = async (req, res) => {
  try {
    const { machineId, rentalStartDate, rentalEndDate } = req.body;
    const userId = req.user.userId; // Get logged-in user

    if (!machineId || !rentalStartDate || !rentalEndDate) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Fetch machine details
    const machineRef = db.collection("machines").doc(machineId);
    const machineDoc = await machineRef.get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    const machineData = machineDoc.data();

    // Prevent renting own machine
    if (machineData.ownerId === userId) {
      return res.status(403).json({ error: "You cannot rent your own machine!" });
    }

    // Add rental record to Firestore
    const rentalRef = await db.collection("rentals").add({
      machineId,
      renterId: userId,
      ownerId: machineData.ownerId,
      rentalStartDate,
      rentalEndDate,
      status: "active", // Active until canceled
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Machine rented successfully!", rentalId: rentalRef.id });
  } catch (error) {
    console.error("Error renting machine:", error);
    res.status(500).json({ error: "Failed to rent machine!" });
  }
};

module.exports = { rentMachine };
*/
