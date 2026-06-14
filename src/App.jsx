import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'

import HomePage        from './pages/HomePage'
import HotelsPage      from './pages/HotelsPage'
import HotelDetailPage from './pages/HotelDetailPage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import BookingPage     from './pages/BookingPage'
import MyBookingsPage  from './pages/MyBookingsPage'
import PaymentPage     from './pages/PaymentPage'
import ProfilePage     from './pages/ProfilePage'
import AdminPage       from './pages/AdminPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'

/* Normal layout: Navbar + content + Footer */
function MainLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  )
}

/* Admin-only route — redirects non-admins to home */
function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Loader />
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Auth pages — full screen dark, no nav/footer */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public pages */}
          <Route path="/" element={
            <MainLayout><HomePage /></MainLayout>
          } />
          <Route path="/hotels" element={
            <MainLayout><HotelsPage /></MainLayout>
          } />
          <Route path="/hotels/:id" element={
            <MainLayout><HotelDetailPage /></MainLayout>
          } />

          {/* Protected pages */}
          <Route path="/book/:roomId" element={
            <MainLayout>
              <ProtectedRoute><BookingPage /></ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/my-bookings" element={
            <MainLayout>
              <ProtectedRoute><MyBookingsPage /></ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/payment/:bookingId" element={
            <MainLayout>
              <ProtectedRoute><PaymentPage /></ProtectedRoute>
            </MainLayout>
          } />
          <Route path="/profile" element={
            <MainLayout>
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            </MainLayout>
          } />

          {/* Admin only */}
          <Route path="/admin" element={
            <MainLayout>
              <AdminRoute><AdminPage /></AdminRoute>
            </MainLayout>
          } />

          <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

          {/* 404 */}
          <Route path="*" element={
            <MainLayout>
              <div className="text-center py-5 my-5">
                <div className="font-display fw-bold text-muted"
                     style={{ fontSize: '6rem', lineHeight: 1 }}>
                  404
                </div>
                <h4 className="font-display mb-3">Page Not Found</h4>
                <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-gold btn-lg px-5">Go Home</a>
              </div>
            </MainLayout>
          } />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
