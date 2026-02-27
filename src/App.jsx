import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'

function Dashboard() {
  const token = localStorage.getItem('token')
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white space-y-4">
        <h1 className="text-4xl font-bold text-purple-400">Dashboard</h1>
        <p className="text-gray-400">Đăng nhập thành công! 🎉</p>
        {token && <p className="text-xs text-gray-500 break-all max-w-sm">Token: {token}</p>}
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/' }}
          className="px-6 py-2 bg-purple-800 hover:bg-purple-700 rounded-lg text-sm font-semibold transition"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
