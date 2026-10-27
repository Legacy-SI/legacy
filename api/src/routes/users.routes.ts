import { Router } from 'express'
import { createUser, getMe, updateMe } from '../controllers/UsersController'
import { authenticate } from '../middlewares/authenticate'

const usersRouter = Router()

usersRouter.post('/', createUser)
usersRouter.get('/me', authenticate, getMe)
usersRouter.patch('/me', authenticate, updateMe)

export { usersRouter }
