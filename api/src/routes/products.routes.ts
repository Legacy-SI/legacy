import { Router } from 'express'
import { getProduct, listOutOfStock, listProducts } from '../controllers/ProductsController'

const productsRouter = Router()

productsRouter.get('/', listProducts)
productsRouter.get('/out-of-stock', listOutOfStock)
productsRouter.get('/:id', getProduct)

export { productsRouter }
