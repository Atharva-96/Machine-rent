require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Debugging: Check if environment variables are loaded
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

// Import routes
const authRoutes = require("./routes/authRoutes");
const machineRoutes = require("./routes/machineRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const earningsRoutes = require("./routes/earningsRoutes");

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/rentals", rentalRoutes);  // ✅ Removed duplicate
app.use("/api/earnings", earningsRoutes); // ✅ Fixed route order

// Default route
app.get("/", (req, res) => res.send("Backend is running!"));

// ✅ Debugging: Show all registered endpoints
console.log(listEndpoints(app));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


/*require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");

const app = express();
app.use(cors());
app.use(express.json());

console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Exists ✅" : "Missing ❌");


// ✅ Debugging: Check if environment variables are loaded
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
console.log(listEndpoints(app));

// Import routes

const authRoutes = require("./routes/authRoutes");
const machineRoutes = require("./routes/machineRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
//const rentalRoutes = require('./routes/rentalRoutes');
const earningsRoutes = require('./routes/earningsRoutes');


// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/upload", uploadRoutes);
//app.use("/api/rentals", rentalRoutes);
//app.use('/api/rentals', rentalRoutes);
app.use('/api/earnings', earningsRoutes);
app.use("/api/rentals", require("./routes/rentalRoutes"));

app.get("/", (req, res) => res.send("Backend is running!"));

const PORT = process.env.PORT || 5000;
console.log(listEndpoints(app));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

*/
/*require("dotenv").config();
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);


require("dotenv").config({ path: "./.env" });

const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const machineRoutes = require("./routes/machineRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/rentals", rentalRoutes); // ✅ Fix: Directly use `rentalRoutes` without re-requiring


app.get("/", (req, res) => res.send("Backend is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/


/*const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");
const machineRoutes = require("./routes/machineRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/rentals", require("./routes/rentalRoutes"));


app.get("/", (req, res) => res.send("Backend is running!"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/

/*const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("Backend is running!"));

const PORT = process.env.PORT || 5000;
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/machines", require("./routes/machineRoutes"));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
*/
