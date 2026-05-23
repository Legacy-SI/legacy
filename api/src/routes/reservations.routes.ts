import { Router } from 'express'
import {
  addOrUpdateItem,
  cancelReservation,
  getMyReservation,
  removeItem,
} from '../controllers/ReservationsController'
import { authenticate } from '../middlewares/authenticate'

const reservationsRouter = Router()

reservationsRouter.use(authenticate)

reservationsRouter.get('/me', getMyReservation)
reservationsRouter.post('/items', addOrUpdateItem)
reservationsRouter.delete('/items/:itemId', removeItem)
reservationsRouter.delete('/me', cancelReservation)

export { reservationsRouter }
