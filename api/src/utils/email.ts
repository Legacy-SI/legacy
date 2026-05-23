import nodemailer from 'nodemailer'
import { env } from '../config/env'

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_SMTP_LOGIN,
    pass: env.EMAIL_SMTP_KEY,
  },
})

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  await transporter.sendMail({
    from: `Legacy <${env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  })
}

export function welcomeEmailTemplate(name: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
      <div style="background: #E7003B; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 36px; font-weight: 900; letter-spacing: 4px; margin: 0;">LEGACY</h1>
      </div>
      <div style="padding: 32px; border: 1px solid #f0f0f0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #111111; font-size: 22px; margin-bottom: 12px;">Bem-vindo, ${name}!</h2>
        <p style="color: #444444; font-size: 15px; line-height: 1.6;">
          Sua conta foi criada com sucesso. Estamos felizes em ter você na família Legacy.
        </p>
        <p style="color: #444444; font-size: 15px; line-height: 1.6;">
          Agora você tem acesso a eventos, grupos de comunidade (GCs) e muito mais.
        </p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0; text-align: center;">
          <p style="color: #999999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Legacy. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  `
}

export function passwordResetEmailTemplate(code: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #E7003B;">Legacy — Recuperação de Senha</h2>
      <p>Seu código de verificação é:</p>
      <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #111111; padding: 20px; background: #f5f5f5; text-align: center; border-radius: 8px;">
        ${code}
      </div>
      <p style="color: #666; font-size: 14px;">Este código expira em 15 minutos.</p>
      <p style="color: #666; font-size: 14px;">Se você não solicitou isso, ignore este email.</p>
    </div>
  `
}