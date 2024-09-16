const express = require('express')
const router = express.Router()
const {Register,Login ,logout, verifytoken} = require("../controller/authController")


router.post("/Register" , Register )
router.post("/login" , Login)
router.post("/logout", logout)
router.get("/verify", verifytoken)


module.exports = router;