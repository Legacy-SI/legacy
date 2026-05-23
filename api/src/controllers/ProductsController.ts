import { Request, Response } from 'express'
import { prisma } from '../config/database'
import { AppError } from '../middlewares/errorHandler'

export async function listProducts(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
  })
  return res.json(products)
}

export async function getProduct(req: Request, res: Response) {
  const id = req.params.id as string
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) throw new AppError('Produto não encontrado', 404)
  return res.json(product)
}

export async function listOutOfStock(_req: Request, res: Response) {
  const products = await prisma.product.findMany({
    where: { isActive: true, stockQuantity: 0 },
    orderBy: { createdAt: 'asc' },
  })
  return res.json(products)
}
