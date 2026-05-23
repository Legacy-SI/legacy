import { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { api } from '../services/api'

const TOKEN_KEY = 'legacy_token'

type User = {
  id: string
  name: string
  email: string
}

type AuthContextData = {
  user: User | null
  token: string | null
  isLoading: boolean
  mustChangePassword: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mustChangePassword, setMustChangePassword] = useState(false)

  useEffect(() => {
    async function loadStoredToken() {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY)
      if (stored) setToken(stored)
      setIsLoading(false)
    }
    loadStoredToken()
  }, [])

  async function signIn(email: string, password: string): Promise<{ mustChangePassword: boolean }> {
    const response = await api.post<{ user: User; token: string; mustChangePassword: boolean }>(
      '/sessions',
      { email, password }
    )
    await SecureStore.setItemAsync(TOKEN_KEY, response.token)
    setUser(response.user)
    setToken(response.token)
    setMustChangePassword(response.mustChangePassword ?? false)
    return { mustChangePassword: response.mustChangePassword ?? false }
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY)
    setUser(null)
    setToken(null)
    setMustChangePassword(false)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, mustChangePassword, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
