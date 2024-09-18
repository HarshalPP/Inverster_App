const express = require('express')
const router = express.Router()
const multer = require('multer');
const {Register,Login ,logout, verifytoken,GetUsers,bulkCreateUsers , passwordSetup} = require("../controller/authController")

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,  // Store file in memory
  limits: { fileSize: 5000000 },  // Optional: Limit file size (example: 5MB)
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(csv)$/)) {
      return cb(new Error('Please upload a CSV file'));
    }
    cb(null, true);
  }
});


// Route to bulk create users with file upload
router.post('/bulk-create', upload.single('file'), bulkCreateUsers);
router.post("/Register" , Register )
router.post("/login" , Login)
router.post("/logout", logout)
router.post("/password-reset" ,passwordSetup)
router.get("/verify", verifytoken)
router.get("/get",GetUsers)


module.exports = router;