const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')
const {ConnectDb}=require("./config/dbconfig")
const Router = require("./router")
const app = express();


dotenv.config();
const PORT=process.env.PORT




// To handle CORS //
app.use(cors())

// To have parse json data //
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// Set Middleware //

app.use("/api/v1" , Router)


//  DB Config //
ConnectDb().then(()=>{

    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`)
    })
})

.catch((error)=>{
    console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
})
