import { Request, Response } from 'express'
import { prisma } from '../config/database'
import { sendEmail, passwordResetEmailTemplate } from '../utils/email'

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body

  if (!email) {
    return res.status(200).json({ message: 'Se o e-mail existir, você receberá um código.' })
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    return res.status(200).json({ message: 'Se o e-mail existir, você receberá um código.' })
  }

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } })

  const code = String(Math.floor(1000 + Math.random() * 9000))
  const token = `${user.id}_${code}`
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  })

  try {
    await sendEmail({
      to: email,
      subject: 'Legacy — Código de recuperação de senha',
      html: passwordResetEmailTemplate(code),
    })
    console.log(`[EMAIL] Código ${code} enviado para ${email}`)
  } catch (err) {
    console.error('[EMAIL ERROR]', err)
  }

  return res.status(200).json({ message: 'Se o e-mail existir, você receberá um código.' })
}
