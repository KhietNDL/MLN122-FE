import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { Sparkles, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { authApi } from '../services/api'

export default function App() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSuccess = async (tokenResponse) => {
    setError('')
    setGoogleLoading(true)
    try {
      const { data } = await authApi.googleLogin(tokenResponse.access_token)
      if (data?.token) localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      const message = err?.response?.data?.message || 'Đăng nhập Google thất bại.'
      setError(Array.isArray(message) ? message.join(', ') : message)
    } finally {
      setGoogleLoading(false)
    }
  }

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Đăng nhập Google thất bại hoặc bị hủy.'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authApi.login(email, password)
      if (data?.token) localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Email hoặc mật khẩu không đúng.'
      setError(Array.isArray(message) ? message.join(', ') : message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-full bg-[#0d0d14] text-white relative overflow-hidden flex flex-col">
      {/* ── Background gradients ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-700/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/30 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-900/20 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold tracking-tight">
              Value<span className="text-violet-400">Check</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 ml-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs text-white/50">Bạn đang giữ lại bao nhiêu?</span>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 px-6 py-10">

        {/* Left: welcome text (large screens only) */}
        <div className="hidden lg:flex flex-col max-w-sm">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khám phá giá trị thực của bạn</span>
          </div>

          <h1
            className="text-white mb-4"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Chào mừng<br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              trở lại!
            </span>
          </h1>

          <p className="text-white/50" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
            Đăng nhập để xem bạn đang giữ lại bao nhiêu giá trị từ công việc của mình.
          </p>

          {/* Decorative info card */}
          <div className="mt-10 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-purple-600/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-300" />
              </div>
              <span className="text-white/80 text-sm font-semibold">Tính toán cục bộ</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              Dữ liệu của bạn được xử lý hoàn toàn trên thiết bị. Không lưu trữ thông tin cá nhân.
            </p>
          </div>
        </div>

        {/* Right: login card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/40">

            {/* Header */}
            <div className="mb-7">
              <h2 className="text-white mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                Đăng nhập
              </h2>
              <p className="text-white/40 text-sm">
                Chưa có tài khoản?{' '}
                <a href="/register" className="text-violet-400 hover:text-violet-300 transition-colors duration-200">
                  Đăng ký ngay
                </a>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error */}
              {error && (
                <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-white/60 text-xs mb-1.5 ml-0.5">Địa chỉ email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-all duration-200"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/60 text-xs mb-1.5 ml-0.5">Mật khẩu</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-violet-400 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors duration-200"
                >
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-white/30 text-xs">hoặc</span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Social buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  disabled={googleLoading || loading}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                      <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                      <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                      <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
                    </svg>
                  )}
                  <span>{googleLoading ? 'Đang xử lý...' : 'Google'}</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 2.5c-58.892 1.725-64.898 84.363-7.46 95h14.92c57.451-10.647 51.419-93.281-7.46-95z" fill="#1877f2" />
                    <path d="M57.46 64.104h11.125l2.117-13.814H57.46v-8.965c0-3.779 1.85-7.463 7.781-7.463h6.021V22.101c-12.894-2.323-28.385-1.616-28.722 17.66V50.29H30.417v13.814H42.54V97.5h14.92V64.104z" fill="#f1f1f1" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </form>

            {/* Footer note */}
            <p className="mt-6 text-center text-white/25 text-xs">
              Dữ liệu được tính toán hoàn toàn cục bộ. Không lưu thông tin cá nhân.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
