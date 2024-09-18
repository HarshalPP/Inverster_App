const express = require('express')
const router = express.Router();
const {createFundingRound , getFundingRounds } = require("../controller/fundingController")

// Make a Route of Funding //

router.post("/create" , createFundingRound)
router.get("/:companyId/get" , getFundingRounds)

module.exports = router;