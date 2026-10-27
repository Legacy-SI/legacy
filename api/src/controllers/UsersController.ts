import { Request, Response } from 'express'
import { hash } from 'bcryptjs'
import { prisma } from '../config/database'
import { AppError } from '../middlewares/errorHandler'
import { sendEmail, welcomeEmailTemplate } from '../utils/email'

export async function getMe(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  if (!user) throw new AppError('Usuário não encontrado', 404)
  return res.json(user)
}

export async function updateMe(req: Request, res: Response) {
  const { name } = req.body as { name?: string }
  if (!name?.trim()) throw new AppError('Nome é obrigatório')
  const user = await prisma.user.update({
    where: { id: req.userId },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  return res.json(user)
}

export async function createUser(req: Request, res: Response) {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new AppError('Nome, e-mail e senha são obrigatórios')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new AppError('E-mail inválido')
  }

  if (password.length < 6) {
    throw new AppError('A senha deve ter pelo menos 6 caracteres')
  }

  const emailAlreadyExists = await prisma.user.findUnique({ where: { email } })

  if (emailAlreadyExists) {
    throw new AppError('E-mail já cadastrado', 409)
  }

  const hashedPassword = await hash(password, 8)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  sendEmail({
    to: email,
    subject: 'Bem-vindo à Legacy!',
    html: welcomeEmailTemplate(name),
  })
    .then(() => console.log('[WELCOME EMAIL] Enviado para', email))
    .catch(err => console.error('[WELCOME EMAIL ERROR]', err.message, err))

  return res.status(201).json(user)
}
