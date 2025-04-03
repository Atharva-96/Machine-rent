const express = require('express');
const { getOwnerEarnings, getEarningsBreakdown } = require('../controllers/earningsController');
const router = express.Router();

// ✅ Get total earnings of the owner
router.get('/owner/:ownerId', getOwnerEarnings);

// ✅ Get earnings breakdown for each rental
router.get('/breakdown/:ownerId', getEarningsBreakdown);

module.exports = router;


/*const express = require('express');
const { getOwnerEarnings, getEarningsBreakdown } = require('../controllers/earningsController');
const router = express.Router();

router.get('/owner/:ownerId', getOwnerEarnings);  // Get total earnings
router.get('/breakdown/:ownerId', getEarningsBreakdown);  // Get earnings breakdown

module.exports = router;
*/
