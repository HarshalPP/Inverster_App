const express = require('express')
const router  = express.Router()
const {addInvestment}=require("../controller/investmentController")
const{isAuthenticated,isAuthorized} = require("../middleware/AuthticationMiddleware")


router.post("/Inverstor" ,  addInvestment)


module.exports=router