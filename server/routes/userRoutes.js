const express = require('express')
const { registerController, loginController, getUserById } = require('../controllers/userController')
const authenticateUser = require('../middleware/authuser')


// //router object
const router = express.Router()

// //ROUTES
router.post('/register', registerController)

//LOGIN || POST

router.post("/login", loginController)

router.get('/:id', authenticateUser, getUserById);




// //export
module.exports = router