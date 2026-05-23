import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { prisma } from '../config/database'
import { AppError } from '../middlewares/errorHandler'

const DEFAULT_PASSWORD = 'Legacy@2026'

export async function resetPassword(req: Request, res: Response) {
  const { email, code } = req.body

  if (!email || !code) {
    throw new AppError('E-mail e código são obrigatórios')
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

  const hashedPassword = await hash(DEFAULT_PASSWORD, 8)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  })

  console.log(`[RESET] Senha do usuário ${user.email} redefinida para ${DEFAULT_PASSWORD}`)

  return res.json({ message: 'Senha redefinida com sucesso' })
}
