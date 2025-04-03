const { db } = require('../config/firebase'); // Import Firestore connection

exports.getOwnerEarnings = async (req, res) => {
    try {
        const { ownerId } = req.params;

        const rentalSnapshot = await db.collection('rentals')
            .where('machineId', '!=', null)
            .get();

        let totalEarnings = 0;

        const promises = rentalSnapshot.docs.map(async (doc) => {
            const rental = doc.data();
            if (rental.machineId) {
                const machineDoc = await db.collection('machines').doc(rental.machineId).get();
                if (machineDoc.exists && machineDoc.data().ownerId === ownerId) {
                    const rentPrice = machineDoc.data().rentPrice || 0;
                    const rentalDays = (rental.endDate.toDate() - rental.startDate.toDate()) / (1000 * 60 * 60 * 24);
                    totalEarnings += rentPrice * rentalDays;
                }
            }
        });

        await Promise.all(promises); // Wait for all async operations

        res.status(200).json({ success: true, totalEarnings });
    } catch (error) {
        console.error("Error fetching earnings:", error);
        res.status(500).json({ success: false, message: "Error fetching earnings", error });
    }
};

exports.getEarningsBreakdown = async (req, res) => {
    try {
        const { ownerId } = req.params;

        const rentalSnapshot = await db.collection('rentals')
            .where('machineId', '!=', null)
            .get();

        let earningsBreakdown = [];

        const promises = rentalSnapshot.docs.map(async (doc) => {
            const rental = doc.data();
            if (rental.machineId) {
                const machineDoc = await db.collection('machines').doc(rental.machineId).get();
                if (machineDoc.exists && machineDoc.data().ownerId === ownerId) {
                    earningsBreakdown.push({
                        machineId: rental.machineId,
                        rentPrice: machineDoc.data().rentPrice || 0,
                        rentalDays: (rental.endDate.toDate() - rental.startDate.toDate()) / (1000 * 60 * 60 * 24) // Convert ms to days
                    });
                }
            }
        });

        await Promise.all(promises);

        res.status(200).json({ success: true, earningsBreakdown });
    } catch (error) {
        console.error("Error fetching earnings breakdown:", error);
        res.status(500).json({ success: false, message: "Error fetching earnings breakdown", error });
    }
};


/*const admin = require("firebase-admin");
const db = admin.firestore(); // Get Firestore instance

exports.getOwnerEarnings = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // 🔍 Query Firestore to fetch completed rentals for this owner
        const rentalsSnapshot = await db.collection("rentals")
            .where("ownerId", "==", ownerId)
            .where("status", "==", "completed") // Only count completed rentals
            .get();

        let totalEarnings = 0;
        rentalsSnapshot.forEach((doc) => {
            totalEarnings += doc.data().totalPrice || 0;
        });

        res.status(200).json({ success: true, totalEarnings });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching earnings", error });
    }
};

exports.getEarningsBreakdown = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // 🔍 Query Firestore to get breakdown of completed rentals
        const rentalsSnapshot = await db.collection("rentals")
            .where("ownerId", "==", ownerId)
            .where("status", "==", "completed")
            .get();

        let earningsBreakdown = [];
        rentalsSnapshot.forEach((doc) => {
            let rental = doc.data();
            earningsBreakdown.push({
                rentalId: doc.id,
                machineId: rental.machineId,
                totalPrice: rental.totalPrice || 0,
                rentalDays: rental.rentalDays || 0
            });
        });

        res.status(200).json({ success: true, earningsBreakdown });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching earnings breakdown", error });
    }
};
*/

/*const Rental = require('../models/Rental'); // ✅ Uncommented Import

exports.getOwnerEarnings = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // ✅ Fetch only completed (successful) rentals
        const rentals = await Rental.find({ ownerId, status: 'completed' });

        // ✅ Calculate total earnings
        const totalEarnings = rentals.reduce((sum, rental) => sum + (rental.totalPrice || 0), 0);

        res.status(200).json({ success: true, totalEarnings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching earnings", error });
    }
};

exports.getEarningsBreakdown = async (req, res) => {
    try {
        const { ownerId } = req.params;

        // ✅ Fetch earnings breakdown
        const rentals = await Rental.find({ ownerId, status: 'completed' })
            .select('machineId totalPrice rentalDays');

        res.status(200).json({ success: true, earningsBreakdown: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching earnings breakdown", error });
    }
};
*/

/*
//const Rental = require('../models/Rental');

exports.getOwnerEarnings = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const rentals = await Rental.find({ ownerId, status: 'active' });
        const totalEarnings = rentals.reduce((sum, rental) => sum + rental.totalPrice, 0);
        res.status(200).json({ success: true, totalEarnings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching earnings", error });
    }
};

exports.getEarningsBreakdown = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const rentals = await Rental.find({ ownerId, status: 'active' }).select('machineId totalPrice rentalDays');
        res.status(200).json({ success: true, earningsBreakdown: rentals });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching earnings breakdown", error });
    }
};
*/
