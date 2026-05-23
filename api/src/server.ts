import 'dotenv/config'
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import { router } from './routes'
import { errorHandler } from './middlewares/errorHandler'
import { env } from './config/env'

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`🚀 Legacy API rodando na porta ${env.PORT}`)
  console.log(`📍 http://localhost:${env.PORT}/api/health`)
})
