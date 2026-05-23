import { Request, Response, NextFunction } from 'express'

export class AppError {
  public readonly message: string
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  console.error('[UNHANDLED ERROR]', err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}