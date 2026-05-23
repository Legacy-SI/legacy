import { Router } from 'express'
import { createUser } from '../controllers/UsersController'

const usersRouter = Router()

usersRouter.post('/', createUser)

export { usersRouter }
