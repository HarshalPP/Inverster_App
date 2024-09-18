const express = require("express")
const router = express.Router();
const {createDeal,getActiveDeals} = require("../controller/DealController")


// Make a Router for the Deal ..  //

router.post("/create" , createDeal)
router.get("/get" , getActiveDeals)


module.exports = router;