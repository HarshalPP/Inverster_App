const express = require("express")
const router = express.Router()
const {aggregateProducts,addProduct,getConsignorName,createProduct,createConsignorInfo,updateConsignorNames,InsertMany} = require("../controller/ProductController")

router.get('/products', aggregateProducts);
router.post("/addProduct" , addProduct)
router.get("/getConsignorName/:id",getConsignorName )
router.post("/createProduct" , createProduct)
router.post("/createConsignorInfo" , createConsignorInfo)
router.put("/UpdateConsignor" , updateConsignorNames)
router.post("/InsertProducts" , InsertMany)

module.exports = router;