import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Route guard. Use as a layout route wrapping protected children.
 *   <Route element={<ProtectedRoute />}> ... </Route>
 *   <Route element={<ProtectedRoute requireAdmin />}> ... </Route>
 *
 * - While the session is being restored, renders a light loading state.
 * - Unauthenticated users are sent to /login (or /admin/login for admin areas),
 *   preserving the intended destination in location state.
 * - Authenticated non-admins hitting an admin route are sent home.
 */
export default function ProtectedRoute({ requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="container page" style={{ textAlign: 'center', padding: '96px 0' }}>
        <p className="muted">Chargement…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace state={{ from: location }} />
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
