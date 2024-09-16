const express = require("express")
const app = express()

const companyRouter = require("./routes/companyRoutes")
const AuthRouter    = require("./routes/AuthRouter")






 //  Define the Middleware //
 
 app.use("/Company" , companyRouter)
 app.use("/Auth" , AuthRouter)











module.exports=app;