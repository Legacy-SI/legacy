import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { prisma } from '../config/database'
import { AppError } from '../middlewares/errorHandler'
import { env } from '../config/env'

export async function createSession(req: Request, res: Response) {
  const { email, password } = req.body

  if (!email || !password) {
    throw new AppError('E-mail e senha são obrigatórios')
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    throw new AppError('E-mail ou senha inválidos', 401)
  }

  const passwordMatch = await compare(password, user.password)

  if (!passwordMatch) {
    throw new AppError('E-mail ou senha inválidos', 401)
  }

  const token = sign({ sub: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  })

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
    mustChangePassword: false,
  })
}
