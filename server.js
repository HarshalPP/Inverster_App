const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')
const cookieParser = require('cookie-parser');
const {ConnectDb}=require("./config/dbconfig")
const Router = require("./router")
const app = express();


dotenv.config();


// To handle CORS //
app.use(cors())

// Use the cookie-parser middleware
app.use(cookieParser());

// To have parse json data //
app.use(express.json())
app.use(express.urlencoded({extended:true}));

// To check api is Running or Nor

// To check if API is running
app.get('/', (req, res) => {
    res.send("API IS RUNNING");
    console.log("API IS RUNNING");
  });

// Set Middleware //

app.use("/api/v1" , Router)

// Define the PORT //
const PORT=process.env.PORT

//  DB Config //
ConnectDb()
.then(()=>{

    app.listen(PORT,()=>{
        console.log(`Server is Running On ${PORT}`)
    })
})

.catch((error)=>{
    console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
})
