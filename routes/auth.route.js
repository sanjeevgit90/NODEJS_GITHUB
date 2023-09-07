const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { verifyAccessToken } = require('../helper/jwtHelper')
const  upload  = require('../helper/upload')


router.post('/register', verifyAccessToken, AuthController.registerUser)

router.get('/register', verifyAccessToken, AuthController.getUsers)

router.get('/register/:id', verifyAccessToken, AuthController.getUserDetailsById)

router.patch('/register', verifyAccessToken, AuthController.updateUserById)

router.delete('/register/:id', verifyAccessToken, AuthController.deleteUserById)

router.post('/filterUser', verifyAccessToken, AuthController.filterUsers)

router.post('/login', AuthController.loginUser)

router.post('/refresh-token', AuthController.refreshTokenMethod)

router.delete('/logout', AuthController.logout)

router.post('/menu', verifyAccessToken, AuthController.saveMenu)

router.post('/upload', upload.single('image'), AuthController.uploadImage)


module.exports = router