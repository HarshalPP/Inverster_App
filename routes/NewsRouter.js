const express = require('express')
const router = express.Router()
const{AddNews,getNews,markAsRead,subscribeNewsletter} = require("../controller/newsController")
const{isAuthenticated,isAuthorized} =require("../middleware/AuthticationMiddleware")


router.post("/create" , AddNews )
router.get('/unread', isAuthenticated , isAuthorized("Investor") ,  getNews);
router.put('/:newsId/mark-read', isAuthenticated , isAuthorized("Investor") , markAsRead);
router.post("/subscribe" , isAuthenticated , isAuthorized("Investor") ,subscribeNewsletter)


module.exports = router;