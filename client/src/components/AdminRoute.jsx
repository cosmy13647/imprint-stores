import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  const isAdmin = user?.role === 'admin'

  if (loading) return <div>Loading...</div>
  if (!user)    return <Navigate to="/login" />
  if (!isAdmin) return <Navigate to="/" />

  return children
}