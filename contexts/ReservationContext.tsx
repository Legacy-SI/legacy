import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'
import { useAuth } from './AuthContext'

export type ApiProduct = {
  id: string
  name: string
  description: string
  imageUrl: string
  category: string
  sizes: string[]
  stockQuantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type ReservationItem = {
  id: string
  reservationId: string
  productId: string
  size: string | null
  quantity: number
  product: ApiProduct
}

export type Reservation = {
  id: string
  userId: string
  status: string
  createdAt: string
  items: ReservationItem[]
}

type ReservationContextData = {
  reservation: Reservation | null
  isLoading: boolean
  itemCount: number
  addItem: (productId: string, quantity: number, size?: string) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  cancelReservation: () => Promise<void>
  refresh: () => Promise<void>
}

const ReservationContext = createContext({} as ReservationContextData)

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!token) {
      setReservation(null)
      return
    }
    try {
      const data = await api.get<Reservation | null>('/reservations/me', {
        Authorization: `Bearer ${token}`,
      })
      setReservation(data)
    } catch {
      setReservation(null)
    }
  }, [token])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = async (productId: string, quantity: number, size?: string) => {
    if (!token) throw new Error('Você precisa estar logado')
    setIsLoading(true)
    try {
      const data = await api.post<Reservation>(
        '/reservations/items',
        { productId, quantity, size },
        { Authorization: `Bearer ${token}` },
      )
      setReservation(data)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!token) throw new Error('Você precisa estar logado')
    setIsLoading(true)
    try {
      await api.delete(`/reservations/items/${itemId}`, {
        Authorization: `Bearer ${token}`,
      })
      await refresh()
    } finally {
      setIsLoading(false)
    }
  }

  const cancelReservation = async () => {
    if (!token) throw new Error('Você precisa estar logado')
    setIsLoading(true)
    try {
      await api.delete('/reservations/me', { Authorization: `Bearer ${token}` })
      setReservation(null)
    } finally {
      setIsLoading(false)
    }
  }

  const itemCount = reservation?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <ReservationContext.Provider
      value={{ reservation, isLoading, itemCount, addItem, removeItem, cancelReservation, refresh }}
    >
      {children}
    </ReservationContext.Provider>
  )
}

export function useReservation() {
  return useContext(ReservationContext)
}
