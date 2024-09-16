const express = require('express')
const router = express.Router()
const {addCompany,getAllCompanies} = require("../controller/companycontroller")

// Routes Handling //

router.post("/create" , addCompany)

router.get("/get" , getAllCompanies)




module.exports = router;