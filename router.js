const express = require("express")
const app = express()

const companyRouter = require("./routes/companyRoutes")
const AuthRouter    = require("./routes/AuthRouter")
const InvestorRouter = require("./routes/InvestorRouter")






 //  Define the Middleware //
 app.use("/Investment" , InvestorRouter)
 app.use("/Company" , companyRouter)
 app.use("/Auth" , AuthRouter)












module.exports=app;