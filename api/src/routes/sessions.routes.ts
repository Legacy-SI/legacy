import { Router } from 'express'
import { createSession } from '../controllers/SessionsController'

const sessionsRouter = Router()

sessionsRouter.post('/', createSession)

export { sessionsRouter }
