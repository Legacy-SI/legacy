import { Router } from 'express'
import { usersRouter } from './users.routes'
import { sessionsRouter } from './sessions.routes'
import { passwordRouter } from './password.routes'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Legacy API', timestamp: new Date() })
})

router.use('/users', usersRouter)
router.use('/sessions', sessionsRouter)
router.use('/password', passwordRouter)

export { router }