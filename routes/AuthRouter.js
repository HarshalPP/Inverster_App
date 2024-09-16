const express = require('express')
const router = express.Router()
const {Register,Login ,logout} = require("../controller/authController")


router.post("/Register" , Register )
router.post("/login" , Login)
router.post("/logout", logout)


module.exports = router;