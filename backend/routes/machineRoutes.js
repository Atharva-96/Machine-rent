const express = require("express");
const { 
  addMachine, 
  getAllMachines, 
  getMachineById, 
  updateMachine, 
  deleteMachine,
  searchMachines // ✅ Added Search API
} = require("../controllers/machineController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addMachine); // Add a new machine
router.get("/", getAllMachines); // Get all machines
router.get("/search", searchMachines); // ✅ Search & Filter machines
router.get("/:id", getMachineById); // Get a single machine
router.put("/:id", verifyToken, updateMachine); // Update a machine
router.delete("/:id", verifyToken, deleteMachine); // Delete a machine ✅ (New)

module.exports = router;


/*const express = require("express");
const { 
  addMachine, 
  getAllMachines, 
  getMachineById, 
  updateMachine, 
  deleteMachine 
} = require("../controllers/machineController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addMachine); // Add a new machine
router.get("/", getAllMachines); // Get all machines
router.get("/:id", getMachineById); // Get a single machine
router.put("/:id", verifyToken, updateMachine); // Update a machine
router.delete("/:id", verifyToken, deleteMachine); // Delete a machine ✅ (New)

module.exports = router;
*/

/*const express = require("express");
const { addMachine, getAllMachines, getMachineById, updateMachine } = require("../controllers/machineController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addMachine); // Add a new machine
router.get("/", getAllMachines); // Get all machines
router.get("/:id", getMachineById); // Get a single machine
router.put("/:id", verifyToken, updateMachine); // Update a machine

module.exports = router;
*/

/*const express = require("express");
const { addMachine, getAllMachines, getMachineById, updateMachine } = require("../controllers/machineController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", verifyToken, addMachine); // Add a new machine
router.get("/", getAllMachines); // Get all machines
router.get("/:id", getMachineById); // Get a single machine
router.put("/:id", verifyToken, updateMachine); // Update a machine (Fix added here)

module.exports = router;
*/

/*const express = require("express");
const { addMachine, getAllMachines, getMachineById } = require("../controllers/machineController");
const { verifyToken } = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/", verifyToken, addMachine); // Add a new machine
router.get("/", getAllMachines); // Get all machines
router.get("/:id", getMachineById); // Get a single machine
router.put("/:id", verifyToken, updateMachine);


module.exports = router;
*/
