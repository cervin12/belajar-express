import express from "express";
import jwtAuth from "../middlewares/jswAuth.js";
import AuthController from "../controllers/authController.js";
import FormController from "../controllers/FormController.js"


const router = express()

router.post('/register', AuthController.register)
router.post('/login',AuthController.login)
router.post('/refresh-token', AuthController.refreshToken)

router.post('/forms',jwtAuth(),FormController.store)
router.get('/forms/:id',jwtAuth(),FormController.show)

export default router;