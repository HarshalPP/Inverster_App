const express = require("express")
const app = express()

const companyRouter = require("./routes/companyRoutes")
const AuthRouter    = require("./routes/AuthRouter")
const InvestorRouter = require("./routes/InvestorRouter")
const NewsRouter = require("./routes/NewsRouter")
const DealRouter = require("./routes/DealRouter")
const FundingRouter =require("./routes/fundingRouter")
const ProductRouter = require("./routes/product")


 //  Define the Middleware //
 app.use("/Investment" , InvestorRouter)
 app.use("/Company" , companyRouter)
 app.use("/Auth" , AuthRouter)
 app.use("/NewsRouter" , NewsRouter)
 app.use("/Deal" , DealRouter)
 app.use("/funding",FundingRouter)
 app.use("/Prodcuts" , ProductRouter)


module.exports=app;