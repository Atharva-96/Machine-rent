const { db } = require("../config/firebase");
const cloudinary = require("../config/cloudinary");

// ✅ Add a Machine (POST /api/machines)

const addMachine = async (req, res) => {
  try {
    const { title, category, fuelType, rentPrice, availabilityEndDate, location, images, description } = req.body;
    const ownerId = req.user.userId; // User adding the machine

    // 🔹 Ensure all required fields are present
    if (!title || !category || !fuelType || !rentPrice || !availabilityEndDate || !location || !images || !description) {
      return res.status(400).json({ error: "All fields, including description, are required!" });
    }

    // 🔹 Convert single image URL to an array (for consistency)
    const imageArray = Array.isArray(images) ? images : [images];

    const machineRef = await db.collection("machines").add({
      ownerId,
      title,
      title_lowercase: title.toLowerCase(), // 🔹 Store lowercase version
      category,
      fuelType,
      rentPrice,
      availabilityEndDate,
      location,
      images: imageArray, // 🔹 Store as an array
      description, // 🔹 NEW FIELD
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Machine added successfully!", machineId: machineRef.id });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ error: "Failed to add machine!" });
  }
};

/*
const addMachine = async (req, res) => {
  try {
    const { title, category, fuelType, rentPrice, availabilityEndDate, location, images } = req.body;
    const ownerId = req.user.userId; // User adding the machine

    // 🔹 Ensure all required fields are present
    if (!title || !category || !fuelType || !rentPrice || !availabilityEndDate || !location || !images) {
      return res.status(400).json({ error: "All fields are required, and images must be provided!" });
    }

    // 🔹 Convert single image URL to an array (for consistency)
    const imageArray = Array.isArray(images) ? images : [images];

    const machineRef = await db.collection("machines").add({
      ownerId,
      title,
      title_lowercase: title.toLowerCase(), // 🔹 Store lowercase version
      category,
      fuelType,
      rentPrice,
      availabilityEndDate,
      location,
      images: imageArray, // 🔹 Store as an array
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Machine added successfully!", machineId: machineRef.id });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ error: "Failed to add machine!" });
  }
};
*/
// ✅ Get All Machines (GET /api/machines)
const getAllMachines = async (req, res) => {
  try {
    const machinesSnapshot = await db.collection("machines").get();
    const machines = machinesSnapshot.docs.map(doc => ({
      machineId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ error: "Failed to fetch machines!" });
  }
};

// ✅ Get a Single Machine by ID (GET /api/machines/:id)
const getMachineById = async (req, res) => {
  try {
    const { id } = req.params;
    const machineDoc = await db.collection("machines").doc(id).get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    res.status(200).json({ machineId: id, ...machineDoc.data() });
  } catch (error) {
    console.error("Error fetching machine:", error);
    res.status(500).json({ error: "Failed to fetch machine!" });
  }
};

// ✅ Update a Machine (PUT /api/machines/:id)
const updateMachine = async (req, res) => {
  try {
      const { title, category, fuelType, rentPrice, availabilityEndDate, location, images } = req.body;
      const { id } = req.params;

      console.log("🔹 Updating Machine with ID:", id);
      console.log("🔹 Received Image Data:", images);

      let imageUrl = images; // Keep existing images if no new upload

      if (images && images.length > 0) {
          console.log("🔹 Uploading New Image to Cloudinary:", images[0]);

          try {
              const cloudinaryResponse = await cloudinary.uploader.upload(images[0], {
                  folder: "machine_rent"
              });

              console.log("✅ Cloudinary Upload Success:", cloudinaryResponse);
              imageUrl = [cloudinaryResponse.secure_url]; // Store the uploaded image URL
          } catch (cloudError) {
              console.error("❌ Cloudinary Upload Failed:", cloudError);
              return res.status(400).json({ 
                  error: "Image upload failed!",
                  details: cloudError.message 
              });
          }
      }

      console.log("🔹 Final Image URL:", imageUrl);

      const machineRef = db.collection("machines").doc(id);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
          return res.status(404).json({ error: "Machine not found!" });
      }

      await machineRef.update({
          title, category, fuelType, rentPrice, availabilityEndDate, location,
          images: imageUrl
      });

      res.json({ message: "Machine updated successfully!" });

  } catch (error) {
      console.error("❌ Error updating machine:", error);
      res.status(500).json({ error: "Failed to update machine!", details: error.message });
  }
};

/*const updateMachine = async (req, res) => {
  try {
      const { title, category, fuelType, rentPrice, availabilityEndDate, location, images } = req.body;
      const { id } = req.params;

      console.log("🔹 Updating Machine with ID:", id);
      
      let imageUrl = images; // Default: Keep existing images

      if (images && images.length > 0) {
          console.log("🔹 Uploading New Image to Cloudinary:", images[0]);

          try {
              const cloudinaryResponse = await cloudinary.uploader.upload(images[0]);
              console.log("✅ Cloudinary Upload Success:", cloudinaryResponse);
              imageUrl = [cloudinaryResponse.secure_url]; // Store the uploaded image URL
          } catch (cloudError) {
              console.error("❌ Cloudinary Upload Failed:", cloudError.message);
              return res.status(400).json({ error: "Image upload failed!" });
          }
      }

      const machineRef = db.collection("machines").doc(id);
      const machineDoc = await machineRef.get();

      if (!machineDoc.exists) {
          return res.status(404).json({ error: "Machine not found!" });
      }

      await machineRef.update({
          title, category, fuelType, rentPrice, availabilityEndDate, location,
          images: imageUrl
      });

      res.json({ message: "Machine updated successfully!" });

  } catch (error) {
      console.error("❌ Error updating machine:", error);
      res.status(500).json({ error: "Failed to update machine!" });
  }
};
*/

// ✅ Delete a Machine (DELETE /api/machines/:id)
const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Get the logged-in user ID

    // Fetch the machine to check ownership
    const machineRef = db.collection("machines").doc(id);
    const machineDoc = await machineRef.get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    const machineData = machineDoc.data();
    if (machineData.ownerId !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this machine!" });
    }

    // Delete associated images from Cloudinary
    if (machineData.images && Array.isArray(machineData.images)) {
      for (const imageUrl of machineData.images) {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract Cloudinary public_id
        await cloudinary.uploader.destroy(`machines/${publicId}`);
      }
    }

    // Delete machine from Firestore
    await machineRef.delete();

    res.status(200).json({ message: "Machine deleted successfully!" });
  } catch (error) {
    console.error("Error deleting machine:", error);
    res.status(500).json({ error: "Failed to delete machine!" });
  }
};

// ✅ Search & Filter Machines (Case-Insensitive Search)
const searchMachines = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    let queryRef = db.collection("machines");

    console.log("Search Query:", { query, category, minPrice, maxPrice });

    if (query) {
      const lowercaseQuery = query.toLowerCase();
      queryRef = queryRef.where("title_lowercase", ">=", lowercaseQuery)
                         .where("title_lowercase", "<=", lowercaseQuery + "\uf8ff");
    }

    if (category) {
      queryRef = queryRef.where("category", "==", category);
    }

    if (minPrice) {
      queryRef = queryRef.where("rentPrice", ">=", Number(minPrice));
    }

    if (maxPrice) {
      queryRef = queryRef.where("rentPrice", "<=", Number(maxPrice));
    }

    const snapshot = await queryRef.get();

    if (snapshot.empty) {
      console.log("No machines found matching the criteria.");
      return res.status(404).json({ message: "No machines found." });
    }

    const machines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log("Machines Found:", machines);
    res.json({ machines });
  } catch (error) {
    console.error("🔥 Error in searchMachines:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addMachine,
  getAllMachines,
  getMachineById,
  updateMachine,
  deleteMachine,  // ✅ Make sure this is correctly referenced
  searchMachines
};



/*const { db } = require("../config/firebase");
const cloudinary = require("../config/cloudinary");

// ✅ Add a Machine (POST /api/machines)
const addMachine = async (req, res) => {
  try {
    const { title, category, fuelType, rentPrice, availabilityEndDate, location, images } = req.body;
    const ownerId = req.user.userId; // User adding the machine

    // 🔹 Ensure all required fields are present
    if (!title || !category || !fuelType || !rentPrice || !availabilityEndDate || !location || !images) {
      return res.status(400).json({ error: "All fields are required, and images must be provided!" });
    }

    // 🔹 Convert single image URL to an array (for consistency)
    const imageArray = Array.isArray(images) ? images : [images];

    const machineRef = await db.collection("machines").add({
      ownerId,
      title,
      category,
      fuelType,
      rentPrice,
      availabilityEndDate,
      location,
      images: imageArray, // 🔹 Store as an array
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Machine added successfully!", machineId: machineRef.id });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ error: "Failed to add machine!" });
  }
};


// ✅ Get All Machines (GET /api/machines)
const getAllMachines = async (req, res) => {
  try {
    const machinesSnapshot = await db.collection("machines").get();
    const machines = machinesSnapshot.docs.map(doc => ({
      machineId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ error: "Failed to fetch machines!" });
  }
};

// ✅ Get a Single Machine by ID (GET /api/machines/:id)
const getMachineById = async (req, res) => {
  try {
    const { id } = req.params;
    const machineDoc = await db.collection("machines").doc(id).get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    res.status(200).json({ machineId: id, ...machineDoc.data() });
  } catch (error) {
    console.error("Error fetching machine:", error);
    res.status(500).json({ error: "Failed to fetch machine!" });
  }
};

// ✅ Update a Machine (PUT /api/machines/:id)
const updateMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, fuelType, rentPrice, availabilityEndDate, location, images } = req.body;
    const userId = req.user.userId; // Get the logged-in user ID

    const machineRef = db.collection("machines").doc(id);
    const machineDoc = await machineRef.get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    const machineData = machineDoc.data();
    if (machineData.ownerId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this machine!" });
    }

    let uploadedImages = machineData.images || [];
    if (images && Array.isArray(images)) {
      uploadedImages = [];
      for (const base64Image of images) {
        const uploadResponse = await cloudinary.uploader.upload(base64Image, { folder: "machines" });
        uploadedImages.push(uploadResponse.secure_url);
      }
    }

    await machineRef.update({
      title,
      category,
      fuelType,
      rentPrice,
      availabilityEndDate,
      location,
      images: uploadedImages,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Machine updated successfully!" });
  } catch (error) {
    console.error("Error updating machine:", error);
    res.status(500).json({ error: "Failed to update machine!" });
  }
};

// ✅ Delete a Machine (DELETE /api/machines/:id)
const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // Get the logged-in user ID

    // Fetch the machine to check ownership
    const machineRef = db.collection("machines").doc(id);
    const machineDoc = await machineRef.get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    const machineData = machineDoc.data();
    if (machineData.ownerId !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this machine!" });
    }

    // Delete associated images from Cloudinary
    if (machineData.images && Array.isArray(machineData.images)) {
      for (const imageUrl of machineData.images) {
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract Cloudinary public_id
        await cloudinary.uploader.destroy(`machines/${publicId}`);
      }
    }

    // Delete machine from Firestore
    await machineRef.delete();

    res.status(200).json({ message: "Machine deleted successfully!" });
  } catch (error) {
    console.error("Error deleting machine:", error);
    res.status(500).json({ error: "Failed to delete machine!" });
  }
};

// 📌 Search & Filter Machines with Debugging
 
const searchMachines = async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    let machinesRef = db.collection("machines");

    let queryRef = machinesRef;

    console.log("Search Query:", { query, category, minPrice, maxPrice });

    if (query) {
      queryRef = queryRef.where("name", ">=", query).where("name", "<=", query + "\uf8ff");
    }

    if (category) {
      queryRef = queryRef.where("category", "==", category);
    }

    if (minPrice) {
      queryRef = queryRef.where("pricePerDay", ">=", Number(minPrice));
    }

    if (maxPrice) {
      queryRef = queryRef.where("pricePerDay", "<=", Number(maxPrice));
    }

    const snapshot = await queryRef.get();

    if (snapshot.empty) {
      console.log("No machines found matching the criteria.");
      return res.status(404).json({ message: "No machines found." });
    }

    const machines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log("Machines Found:", machines);
    res.json({ machines });
  } catch (error) {
    console.error("🔥 Error in searchMachines:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { addMachine, getAllMachines, getMachineById, updateMachine, deleteMachine, searchMachines };
*/

/*const express = require("express");
const { db } = require("../config/firebase");

// \ud83d\udccc Add a Machine (POST /api/machines)
const addMachine = async (req, res) => {
  try {
    const { title, category, fuelType, rentPrice, availabilityEndDate, location, imageUrl } = req.body;
    const ownerId = req.user.userId; // User adding the machine

    if (!title || !category || !fuelType || !rentPrice || !availabilityEndDate || !location || !imageUrl) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const machineRef = await db.collection("machines").add({
      ownerId,
      title,
      category,
      fuelType,
      rentPrice,
      availabilityEndDate,
      location,
      imageUrl,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Machine added successfully!", machineId: machineRef.id });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ error: "Failed to add machine!" });
  }
};

// \ud83d\udccc Get All Machines (GET /api/machines)
const getAllMachines = async (req, res) => {
  try {
    const machinesSnapshot = await db.collection("machines").get();
    const machines = machinesSnapshot.docs.map(doc => ({
      machineId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ error: "Failed to fetch machines!" });
  }
};

// \ud83d\udccc Get a Single Machine by ID (GET /api/machines/:id)
const getMachineById = async (req, res) => {
  try {
    const { id } = req.params;
    const machineDoc = await db.collection("machines").doc(id).get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    res.status(200).json({ machineId: id, ...machineDoc.data() });
  } catch (error) {
    console.error("Error fetching machine:", error);
    res.status(500).json({ error: "Failed to fetch machine!" });
  }
};

// \ud83d\udccc Update a Machine (PUT /api/machines/:id)
const updateMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, fuelType, rentPrice, availabilityEndDate, location, imageUrl } = req.body;
    const userId = req.user.userId; // Get the logged-in user ID

    // Fetch the machine to check ownership
    const machineRef = db.collection("machines").doc(id);
    const machineDoc = await machineRef.get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    const machineData = machineDoc.data();

    if (machineData.ownerId !== userId) {
      return res.status(403).json({ error: "Unauthorized to update this machine!" });
    }

    // Update the machine details
    await machineRef.update({
      title,
      category,
      fuelType,
      rentPrice,
      availabilityEndDate,
      location,
      imageUrl,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Machine updated successfully!" });
  } catch (error) {
    console.error("Error updating machine:", error);
    res.status(500).json({ error: "Failed to update machine!" });
  }
};

module.exports = { addMachine, getAllMachines, getMachineById, updateMachine };
*/


/*const express = require("express");
const { db } = require("../config/firebase");

// 📌 Add a Machine (POST /api/machines)
const addMachine = async (req, res) => {
  try {
    const { title, category, fuelType, rentPrice, availabilityEndDate, location, imageUrl } = req.body;
    const ownerId = req.user.userId; // User adding the machine

    if (!title || !category || !fuelType || !rentPrice || !availabilityEndDate || !location || !imageUrl) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const machineRef = await db.collection("machines").add({
      ownerId,
      title,
      category,
      fuelType,
      rentPrice,
      availabilityEndDate,
      location,
      imageUrl,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({ message: "Machine added successfully!", machineId: machineRef.id });
  } catch (error) {
    console.error("Error adding machine:", error);
    res.status(500).json({ error: "Failed to add machine!" });
  }
};

// 📌 Get All Machines (GET /api/machines)
const getAllMachines = async (req, res) => {
  try {
    const machinesSnapshot = await db.collection("machines").get();
    const machines = machinesSnapshot.docs.map(doc => ({
      machineId: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(machines);
  } catch (error) {
    console.error("Error fetching machines:", error);
    res.status(500).json({ error: "Failed to fetch machines!" });
  }
};

// 📌 Get a Single Machine by ID (GET /api/machines/:id)
const getMachineById = async (req, res) => {
  try {
    const { id } = req.params;
    const machineDoc = await db.collection("machines").doc(id).get();

    if (!machineDoc.exists) {
      return res.status(404).json({ error: "Machine not found!" });
    }

    res.status(200).json({ machineId: id, ...machineDoc.data() });
  } catch (error) {
    console.error("Error fetching machine:", error);
    res.status(500).json({ error: "Failed to fetch machine!" });
  }
};

module.exports = { addMachine, getAllMachines, getMachineById };
*/
