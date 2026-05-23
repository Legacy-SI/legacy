import { Request, Response } from 'express'
import { prisma } from '../config/database'
import { AppError } from '../middlewares/errorHandler'

export async function getMyReservation(req: Request, res: Response) {
  const reservation = await prisma.reservation.findFirst({
    where: { userId: req.userId, status: 'active' },
    include: {
      items: {
        include: { product: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
  return res.json(reservation ?? null)
}

export async function addOrUpdateItem(req: Request, res: Response) {
  const { productId, quantity, size } = req.body as {
    productId: string
    quantity: number
    size?: string
  }

  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    throw new AppError('productId e quantity (mínimo 1) são obrigatórios')
  }

  const reservation = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } })
    if (!product) throw new AppError('Produto não encontrado', 404)
    if (!product.isActive) throw new AppError('Produto indisponível', 400)

    if (product.sizes.length > 0 && !size) {
      throw new AppError('Selecione um tamanho antes de reservar')
    }
    if (size && product.sizes.length > 0 && !product.sizes.includes(size)) {
      throw new AppError('Tamanho inválido para este produto')
    }

    let activeReservation = await tx.reservation.findFirst({
      where: { userId: req.userId, status: 'active' },
    })
    if (!activeReservation) {
      activeReservation = await tx.reservation.create({
        data: { userId: req.userId, status: 'active' },
      })
    }

    const existingItem = await tx.reservationItem.findUnique({
      where: {
        reservationId_productId: {
          reservationId: activeReservation.id,
          productId,
        },
      },
    })

    const currentQty = existingItem?.quantity ?? 0
    const quantityDiff = quantity - currentQty

    if (quantityDiff > 0) {
      // Deduct stock atomically — WHERE clause prevents negative stock
      const updated = await tx.product.updateMany({
        where: { id: productId, stockQuantity: { gte: quantityDiff } },
        data: { stockQuantity: { decrement: quantityDiff } },
      })
      if (updated.count === 0) {
        const fresh = await tx.product.findUnique({ where: { id: productId } })
        throw new AppError(
          `Estoque insuficiente. Disponível: ${fresh?.stockQuantity ?? 0}`,
          400,
        )
      }
    } else if (quantityDiff < 0) {
      await tx.product.update({
        where: { id: productId },
        data: { stockQuantity: { increment: Math.abs(quantityDiff) } },
      })
    }

    await tx.reservationItem.upsert({
      where: {
        reservationId_productId: {
          reservationId: activeReservation.id,
          productId,
        },
      },
      create: { reservationId: activeReservation.id, productId, quantity, size },
      update: { quantity, size },
    })

    return tx.reservation.findUnique({
      where: { id: activeReservation.id },
      include: {
        items: { include: { product: true }, orderBy: { createdAt: 'asc' } },
      },
    })
  })

  return res.status(201).json(reservation)
}

export async function removeItem(req: Request, res: Response) {
  const itemId = req.params.itemId as string

  await prisma.$transaction(async (tx) => {
    const item = await tx.reservationItem.findUnique({
      where: { id: itemId },
      include: { reservation: true },
    })

    if (!item || item.reservation.userId !== req.userId) {
      throw new AppError('Item não encontrado', 404)
    }
    if (item.reservation.status !== 'active') {
      throw new AppError('Reserva não está mais ativa', 400)
    }

    await tx.product.update({
      where: { id: item.productId },
      data: { stockQuantity: { increment: item.quantity } },
    })

    await tx.reservationItem.delete({ where: { id: itemId } })
  })

  return res.status(204).send()
}

export async function cancelReservation(req: Request, res: Response) {
  await prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findFirst({
      where: { userId: req.userId, status: 'active' },
      include: { items: true },
    })

    if (!reservation) throw new AppError('Nenhuma reserva ativa encontrada', 404)

    for (const item of reservation.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity } },
      })
    }

    await tx.reservation.update({
      where: { id: reservation.id },
      data: { status: 'cancelled' },
    })
  })

  return res.status(204).send()
}
