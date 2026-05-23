import { Stack } from 'expo-router'
import { AuthProvider } from '../contexts/AuthContext'
import { ReservationProvider } from '../contexts/ReservationContext'

export default function RootLayout() {
  return (
    <AuthProvider>
      <ReservationProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </ReservationProvider>
    </AuthProvider>
  )
}
