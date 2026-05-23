import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { prisma } from '../config/database'
import { AppError } from '../middlewares/errorHandler'

export async function changePassword(req: Request, res: Response) {
  const { newPassword } = req.body
  const userId = req.userId

  if (!newPassword) {
    throw new AppError('Nova senha é obrigatória')
  }

  if (newPassword.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres')
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new AppError('Usuário não encontrado', 404)
  }

  const hashedPassword = await hash(newPassword, 8)

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  })

  return res.json({ message: 'Senha alterada com sucesso' })
}
