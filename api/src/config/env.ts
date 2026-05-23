export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT) || 3333,
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  EMAIL_FROM: process.env.EMAIL_FROM!,
  EMAIL_SMTP_LOGIN: process.env.EMAIL_SMTP_LOGIN!,
  EMAIL_SMTP_KEY: process.env.EMAIL_SMTP_KEY!,
  APP_NAME: process.env.APP_NAME ?? 'Legacy',
  APP_URL: process.env.APP_URL ?? 'http://localhost:3333',
}