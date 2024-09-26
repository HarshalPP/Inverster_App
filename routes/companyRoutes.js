const express = require('express')
const router = express.Router()
const {addCompany,getAllCompanies,GetSorted , GroupCompanies} = require("../controller/companycontroller")

// Routes Handling //

router.post("/create" , addCompany)

router.get("/get" , getAllCompanies)


router.get("/sorted" , GetSorted )

router.get("/GroupComany", GroupCompanies)



module.exports = router;