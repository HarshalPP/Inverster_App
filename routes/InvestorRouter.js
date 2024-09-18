const express = require('express')
const router  = express.Router()
const{isAuthenticated,isAuthorized} = require("../middleware/AuthticationMiddleware")
const {addInvestment}=require("../controller/investmentController")



router.post("/Inverstor" , isAuthenticated , isAuthorized('Admin')  , addInvestment)

// router.route("/Inverstor").post(isAuthenticated,isAuthorized(['Admin']))


module.exports=router