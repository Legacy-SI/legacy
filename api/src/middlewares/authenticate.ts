import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { AppError } from './errorHandler'

interface JwtPayload {
  sub: string
}

declare global {
  namespace Express {
    interface Request {
      userId: string
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Token não fornecido', 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    req.userId = payload.sub
    return next()
  } catch {
    throw new AppError('Token inválido ou expirado', 401)
  }
}