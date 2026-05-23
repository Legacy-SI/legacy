import { Router } from 'express'
import { forgotPassword } from '../controllers/ForgotPasswordController'
import { resetPassword } from '../controllers/ResetPasswordController'
import { changePassword } from '../controllers/ChangePasswordController'
import { authenticate } from '../middlewares/authenticate'

const passwordRouter = Router()

passwordRouter.post('/forgot', forgotPassword)
passwordRouter.post('/reset', resetPassword)
passwordRouter.put('/change', authenticate, changePassword)

export { passwordRouter }
