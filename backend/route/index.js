const express = require("express")

const router  = express.Router()

const  userAPI  = require('./user')
const  account = require("./account")

router.use('/user',userAPI)
router.use('/account' , account )

module.exports = router;

