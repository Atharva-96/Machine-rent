const express = require("express");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../middlewares/authMiddleware");
const { rentMachine, getUserRentals, cancelRental } = require("../controllers/rentalsController");

const router = express.Router();

/**
 * 📌 Rental Booking Route
 */
router.post(
  "/book",
  verifyToken,
  [
    body("machineId").notEmpty().withMessage("Machine ID is required"),
    body("rentalStartDate").isISO8601().withMessage("Start date must be in ISO8601 format"),
    body("rentalEndDate").isISO8601().withMessage("End date must be in ISO8601 format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    rentMachine(req, res);
  }
);

/**
 * 📌 Get User's Rental History (With Machine Details)
 */
router.get("/my-rentals", verifyToken, getUserRentals);

/**
 * 📌 Cancel Rental
 */
router.delete("/cancel/:rentalId", verifyToken, cancelRental);

module.exports = router;


/*const express = require("express");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Rental Booking Route
 
router.post(
  "/book",
  verifyToken,
  [
    body("machineId").notEmpty().withMessage("Machine ID is required"),
    body("startDate").isISO8601().withMessage("Start date must be in ISO8601 format"),
    body("endDate").isISO8601().withMessage("End date must be in ISO8601 format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { machineId, startDate, endDate } = req.body;
    const userId = req.user.userId;

    try {
      // Check if the machine exists
      const machineRef = db.collection("machines").doc(machineId);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
        return res.status(404).json({ error: "Machine not found" });
      }

      // Check if the machine is already booked during the requested period
      const bookingsRef = db.collection("rentals");
      const existingBookings = await bookingsRef.where("machineId", "==", machineId).get();

      for (const doc of existingBookings.docs) {
        const booking = doc.data();
        if (
          (new Date(startDate) >= booking.startDate.toDate() &&
            new Date(startDate) <= booking.endDate.toDate()) ||
          (new Date(endDate) >= booking.startDate.toDate() &&
            new Date(endDate) <= booking.endDate.toDate())
        ) {
          return res.status(400).json({ error: "Machine is already booked for the selected dates" });
        }
      }

      // Store the booking details
      const newBooking = {
        userId,
        machineId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
      };

      const bookingRef = await db.collection("rentals").add(newBooking);
      res.status(201).json({ message: "Booking successful", bookingId: bookingRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


 // 📌 Get User's Rental History (With Machine Details)
 
router.get("/my-rentals", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const rentalsRef = db.collection("rentals").where("userId", "==", userId);
    const snapshot = await rentalsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No rentals found." });
    }

    const rentals = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const machineRef = db.collection("machines").doc(data.machineId);
        const machineDoc = await machineRef.get();

        let machineDetails = {};
        if (machineDoc.exists) {
          machineDetails = machineDoc.data();
        }

        return {
          id: doc.id,
          userId: data.userId,
          machineId: data.machineId,
          startDate: new Date(data.startDate._seconds * 1000).toISOString(),
          endDate: new Date(data.endDate._seconds * 1000).toISOString(),
          createdAt: new Date(data.createdAt._seconds * 1000).toISOString(),
          machine: {
            name: machineDetails.name || "Unknown Machine",
            image: machineDetails.image || null,
            pricePerDay: machineDetails.pricePerDay || "N/A",
          },
        };
      })
    );

    res.json({ rentals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


 // 📌 Cancel Rental
 
router.delete("/cancel/:rentalId", verifyToken, async (req, res) => {
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
    if (rentalData.userId !== userId && rentalData.ownerId !== userId) {
      return res.status(403).json({ error: "Unauthorized to cancel this rental!" });
    }

    // Delete rental from Firestore
    await rentalRef.delete();
    
    res.json({ message: "Rental canceled successfully!" });
  } catch (error) {
    console.error("Error canceling rental:", error);
    res.status(500).json({ error: "Failed to cancel rental!" });
  }
});


module.exports = router;
*/

/*const express = require("express");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// 📌 Rental Booking Route
 
router.post(
  "/book",
  verifyToken,
  [
    body("machineId").notEmpty().withMessage("Machine ID is required"),
    body("startDate").isISO8601().withMessage("Start date must be in ISO8601 format"),
    body("endDate").isISO8601().withMessage("End date must be in ISO8601 format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { machineId, startDate, endDate } = req.body;
    const userId = req.user.userId;

    try {
      // Check if the machine exists
      const machineRef = db.collection("machines").doc(machineId);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
        return res.status(404).json({ error: "Machine not found" });
      }

      // Check if the machine is already booked during the requested period
      const bookingsRef = db.collection("rentals");
      const existingBookings = await bookingsRef.where("machineId", "==", machineId).get();

      for (const doc of existingBookings.docs) {
        const booking = doc.data();
        if (
          (new Date(startDate) >= new Date(booking.startDate._seconds * 1000) &&
            new Date(startDate) <= new Date(booking.endDate._seconds * 1000)) ||
          (new Date(endDate) >= new Date(booking.startDate._seconds * 1000) &&
            new Date(endDate) <= new Date(booking.endDate._seconds * 1000))
        ) {
          return res.status(400).json({ error: "Machine is already booked for the selected dates" });
        }
      }

      // Store the booking details
      const newBooking = {
        userId,
        machineId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
      };

      const bookingRef = await db.collection("rentals").add(newBooking);
      res.status(201).json({ message: "Booking successful", bookingId: bookingRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get User's Rental History
 
router.get("/my-rentals", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const rentalsRef = db.collection("rentals").where("userId", "==", userId);
    const snapshot = await rentalsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No rentals found." });
    }

    const rentals = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        machineId: data.machineId,
        startDate: new Date(data.startDate._seconds * 1000).toISOString(),
        endDate: new Date(data.endDate._seconds * 1000).toISOString(),
        createdAt: new Date(data.createdAt._seconds * 1000).toISOString(),
      };
    });

    res.json({ rentals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/* const express = require("express");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/book",
  verifyToken,
  [
    body("machineId").notEmpty().withMessage("Machine ID is required"),
    body("startDate").isISO8601().withMessage("Start date must be in ISO8601 format"),
    body("endDate").isISO8601().withMessage("End date must be in ISO8601 format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { machineId, startDate, endDate } = req.body;
    const userId = req.user.userId;

    try {
      // Check if the machine exists
      const machineRef = db.collection("machines").doc(machineId);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
        return res.status(404).json({ error: "Machine not found" });
      }

      // Check if the machine is already booked during the requested period
      const bookingsRef = db.collection("rentals");
      const existingBookings = await bookingsRef.where("machineId", "==", machineId).get();

      for (const doc of existingBookings.docs) {
        const booking = doc.data();
        if (
          (new Date(startDate) >= booking.startDate && new Date(startDate) <= booking.endDate) ||
          (new Date(endDate) >= booking.startDate && new Date(endDate) <= booking.endDate)
        ) {
          return res.status(400).json({ error: "Machine is already booked for the selected dates" });
        }
      }

      // Store the booking details
      const newBooking = {
        userId,
        machineId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
      };

      const bookingRef = await db.collection("rentals").add(newBooking);
      res.status(201).json({ message: "Booking successful", bookingId: bookingRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


router.get("/my-rentals", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Get logged-in user's ID
    const rentalsRef = db.collection("rentals").where("userId", "==", userId);
    const snapshot = await rentalsRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No rentals found." });
    }

    const rentals = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        machineId: data.machineId,
        startDate: new Date(data.startDate._seconds * 1000).toISOString(), // Convert Firestore timestamp
        endDate: new Date(data.endDate._seconds * 1000).toISOString(), // Convert Firestore timestamp
        createdAt: new Date(data.createdAt._seconds * 1000).toISOString(), // Convert Firestore timestamp
      };
    });

    res.json({ rentals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/*const express = require("express");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware"); // ✅ Correct import

const router = express.Router();

// Rental Booking Route
router.post(
  "/book",
  verifyToken, // ✅ Corrected middleware usage
  [
    body("machineId").notEmpty().withMessage("Machine ID is required"),
    body("startDate").isISO8601().withMessage("Start date must be in ISO8601 format"),
    body("endDate").isISO8601().withMessage("End date must be in ISO8601 format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { machineId, startDate, endDate } = req.body;
    const userId = req.user.userId; // ✅ `req.user` is set by `verifyToken`

    try {
      // Check if the machine exists
      const machineRef = db.collection("machines").doc(machineId);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
        return res.status(404).json({ error: "Machine not found" });
      }

      // Check if the machine is already booked during the requested period
      const bookingsRef = db.collection("rentals");
      const existingBookings = await bookingsRef
        .where("machineId", "==", machineId)
        .get();

      for (const doc of existingBookings.docs) {
        const booking = doc.data();
        if (
          (new Date(startDate) >= new Date(booking.startDate) && new Date(startDate) <= new Date(booking.endDate)) ||
          (new Date(endDate) >= new Date(booking.startDate) && new Date(endDate) <= new Date(booking.endDate))
        ) {
          return res.status(400).json({ error: "Machine is already booked for the selected dates" });
        }
      }

      // Store the booking details
      const newBooking = {
        userId,
        machineId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
      };

      const bookingRef = await db.collection("rentals").add(newBooking);
      res.status(201).json({ message: "Booking successful", bookingId: bookingRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all rentals for the logged-in user
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const rentalsRef = db.collection("rentals");
    const snapshot = await rentalsRef.where("userId", "==", userId).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No rentals found" });
    }

    const rentals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ rentals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
*/

/*const express = require("express");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const { verifyToken } = require("../middlewares/authMiddleware"); // ✅ Correct import

const router = express.Router();

// Rental Booking Route
router.post(
  "/book",
  verifyToken, // ✅ Corrected middleware usage
  [
    body("machineId").notEmpty().withMessage("Machine ID is required"),
    body("startDate").isISO8601().withMessage("Start date must be in ISO8601 format"),
    body("endDate").isISO8601().withMessage("End date must be in ISO8601 format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { machineId, startDate, endDate } = req.body;
    const userId = req.user.userId; // ✅ `req.user` is set by `verifyToken`

    try {
      // Check if the machine exists
      const machineRef = db.collection("machines").doc(machineId);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
        return res.status(404).json({ error: "Machine not found" });
      }

      // Check if the machine is already booked during the requested period
      const bookingsRef = db.collection("rentals");
      const existingBookings = await bookingsRef
        .where("machineId", "==", machineId)
        .get();

      for (const doc of existingBookings.docs) {
        const booking = doc.data();
        if (
          (new Date(startDate) >= booking.startDate && new Date(startDate) <= booking.endDate) ||
          (new Date(endDate) >= booking.startDate && new Date(endDate) <= booking.endDate)
        ) {
          return res.status(400).json({ error: "Machine is already booked for the selected dates" });
        }
      }

      // Store the booking details
      const newBooking = {
        userId,
        machineId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
      };

      const bookingRef = await db.collection("rentals").add(newBooking);
      res.status(201).json({ message: "Booking successful", bookingId: bookingRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
*/

/*const express = require("express");
const { body, validationResult } = require("express-validator");
const { db } = require("../config/firebase");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Rental Booking Route
router.post(
  "/book",
  authMiddleware,
  [
    body("machineId").notEmpty().withMessage("Machine ID is required"),
    body("startDate").isISO8601().withMessage("Start date must be in ISO8601 format"),
    body("endDate").isISO8601().withMessage("End date must be in ISO8601 format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { machineId, startDate, endDate } = req.body;
    const userId = req.user.userId;

    try {
      // Check if the machine exists
      const machineRef = db.collection("machines").doc(machineId);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
        return res.status(404).json({ error: "Machine not found" });
      }

      // Check if the machine is already booked during the requested period
      const bookingsRef = db.collection("rentals");
      const existingBookings = await bookingsRef
        .where("machineId", "==", machineId)
        .get();

      for (const doc of existingBookings.docs) {
        const booking = doc.data();
        if (
          (new Date(startDate) >= booking.startDate && new Date(startDate) <= booking.endDate) ||
          (new Date(endDate) >= booking.startDate && new Date(endDate) <= booking.endDate)
        ) {
          return res.status(400).json({ error: "Machine is already booked for the selected dates" });
        }
      }

      // Store the booking details
      const newBooking = {
        userId,
        machineId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdAt: new Date(),
      };

      const bookingRef = await db.collection("rentals").add(newBooking);
      res.status(201).json({ message: "Booking successful", bookingId: bookingRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
*/
