import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, Mail, ArrowLeft, Loader2, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { authApi } from '../services/api'

// ─── Step indicator ──────────────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ['Email', 'Xác nhận OTP', 'Mật khẩu mới']
  return (
    <div className="flex items-center gap-2 mb-7">
      {steps.map((label, i) => {
        const idx = i + 1
        const done = idx < current
        const active = idx === current
        return (
          <div key={idx} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${active ? 'opacity-100' : done ? 'opacity-70' : 'opacity-30'}`}>
              <div className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0
                ${done ? 'bg-violet-500 text-white' : active ? 'bg-violet-600 text-white ring-2 ring-violet-400/40' : 'bg-white/10 text-white/50'}`}>
                {done ? '✓' : idx}
              </div>
              <span className={`text-xs hidden sm:block ${active ? 'text-white/80' : 'text-white/40'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px w-6 ${done ? 'bg-violet-500' : 'bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)          // 1 | 2 | 3
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // ── Step 1: send OTP ────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setStep(2)
    } catch (err) {
      setError(err?.response?.data?.message || 'Gửi OTP thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 2: verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.verifyOtp(email, otp)
      setStep(3)
    } catch (err) {
      setError(err?.response?.data?.message || 'OTP không hợp lệ hoặc đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  // ── Step 3: reset password ──────────────────────────────────────────────────
  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    setLoading(true)
    try {
      await authApi.resetPassword(email, otp, newPassword)
      setDone(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Đặt lại mật khẩu thất bại.')
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

        {/* Left panel */}
        <div className="hidden lg:flex flex-col max-w-sm">
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Khôi phục tài khoản</span>
          </div>
          <h1
            className="text-white mb-4"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Quên<br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              mật khẩu?
            </span>
          </h1>
          <p className="text-white/50" style={{ fontSize: '1rem', lineHeight: 1.7 }}>
            Không sao! Nhập email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu.
          </p>
          <div className="mt-10 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-purple-600/5 p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-violet-300" />
              </div>
              <span className="text-white/80 text-sm font-semibold">Kiểm tra email</span>
            </div>
            <p className="text-white/40 text-xs leading-relaxed">
              Mã OTP 6 chữ số sẽ được gửi đến hộp thư của bạn. Có hiệu lực trong 10 phút.
            </p>
          </div>
        </div>

        {/* Right: card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 shadow-2xl shadow-black/40">

            {done ? (
              /* ── Success ── */
              <div className="flex flex-col items-center text-center space-y-5 py-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <h2 className="text-white mb-2" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    Thành công!
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Mật khẩu của bạn đã được đặt lại. Hãy đăng nhập với mật khẩu mới.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-500/25 hover:scale-[1.02]"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : (
              <>
                <Steps current={step} />

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3 rounded-xl mb-4">
                    <span className="flex-shrink-0 mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* ── Step 1: Email ── */}
                {step === 1 && (
                  <>
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
                        <Mail className="w-5 h-5 text-violet-300" />
                      </div>
                      <h2 className="text-white mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        Đặt lại mật khẩu
                      </h2>
                      <p className="text-white/40 text-sm">Nhập email tài khoản để nhận mã OTP.</p>
                    </div>
                    <form onSubmit={handleSendOtp} className="space-y-4">
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
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-500/25 hover:scale-[1.02]"
                      >
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang gửi...</span></> : 'Gửi mã OTP'}
                      </button>
                      <div className="flex justify-center pt-1">
                        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-violet-400 transition-colors duration-200">
                          <ArrowLeft className="w-4 h-4" />Quay lại đăng nhập
                        </Link>
                      </div>
                    </form>
                  </>
                )}

                {/* ── Step 2: OTP ── */}
                {step === 2 && (
                  <>
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
                        <KeyRound className="w-5 h-5 text-violet-300" />
                      </div>
                      <h2 className="text-white mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        Nhập mã OTP
                      </h2>
                      <p className="text-white/40 text-sm">
                        Mã 6 chữ số đã được gửi đến <span className="text-violet-300">{email}</span>.
                      </p>
                    </div>
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div>
                        <label className="block text-white/60 text-xs mb-1.5 ml-0.5">Mã OTP</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-center text-xl tracking-[0.5em] placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-all duration-200"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-500/25 hover:scale-[1.02]"
                      >
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang xác nhận...</span></> : 'Xác nhận OTP'}
                      </button>
                      <div className="flex justify-between pt-1 text-sm">
                        <button type="button" onClick={() => { setStep(1); setOtp(''); setError('') }} className="text-white/40 hover:text-violet-400 transition-colors duration-200 flex items-center gap-1">
                          <ArrowLeft className="w-3.5 h-3.5" />Quay lại
                        </button>
                        <button
                          type="button"
                          onClick={async () => { setError(''); setLoading(true); try { await authApi.forgotPassword(email) } catch {} setLoading(false) }}
                          className="text-violet-400 hover:text-violet-300 transition-colors duration-200"
                        >
                          Gửi lại OTP
                        </button>
                      </div>
                    </form>
                  </>
                )}

                {/* ── Step 3: New password ── */}
                {step === 3 && (
                  <>
                    <div className="mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/10 border border-violet-500/20 flex items-center justify-center mb-4">
                        <KeyRound className="w-5 h-5 text-violet-300" />
                      </div>
                      <h2 className="text-white mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                        Mật khẩu mới
                      </h2>
                      <p className="text-white/40 text-sm">Đặt mật khẩu mới cho tài khoản của bạn.</p>
                    </div>
                    <form onSubmit={handleReset} className="space-y-4">
                      <div>
                        <label className="block text-white/60 text-xs mb-1.5 ml-0.5">Mật khẩu mới</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-all duration-200"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-violet-400 transition-colors duration-200">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-white/60 text-xs mb-1.5 ml-0.5">Xác nhận mật khẩu</label>
                        <div className="relative">
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-all duration-200"
                          />
                          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-violet-400 transition-colors duration-200">
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-500/25 hover:scale-[1.02]"
                      >
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Đang lưu...</span></> : 'Đặt lại mật khẩu'}
                      </button>
                    </form>
                  </>
                )}
              </>
            )}

            <p className="mt-6 text-center text-white/25 text-xs">
              Dữ liệu được tính toán hoàn toàn cục bộ. Không lưu thông tin cá nhân.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
