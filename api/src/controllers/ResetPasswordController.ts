import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { prisma } from '../config/database'
import { AppError } from '../middlewares/errorHandler'

export async function resetPassword(req: Request, res: Response) {
  const { email, code, newPassword } = req.body

  if (!email || !code || !newPassword) {
    throw new AppError('E-mail, código e nova senha são obrigatórios')
  }

  if (newPassword.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres')
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new AppError('Código inválido ou expirado')
  }

  const token = `${user.id}_${code}`

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } })

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw new AppError('Código inválido ou expirado')
  }

  const hashedPassword = await hash(newPassword, 8)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  })

  return res.json({ message: 'Senha redefinida com sucesso' })
}
