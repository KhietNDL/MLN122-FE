import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { calculationApi } from '../services/api'

// ─── Formatters ────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n))
const pct = (n) => `${(n * 100).toFixed(1)}%`

// ─── Time Bar ──────────────────────────────────────────────────────────────
function TimeBar({ timeForSelf, timeForSystem, totalHours }) {
  const selfPct = (timeForSelf / totalHours) * 100
  const systemPct = 100 - selfPct

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
          Thời gian làm cho bản thân
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-gray-300" />
          Thời gian làm cho hệ thống
        </span>
      </div>

      <div className="h-9 rounded-full overflow-hidden flex w-full bg-gray-100 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${selfPct}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full flex items-center justify-center relative"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
        >
          {selfPct > 12 && (
            <span className="text-white text-xs font-bold drop-shadow">{selfPct.toFixed(0)}%</span>
          )}
        </motion.div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${systemPct}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="h-full bg-gray-200 flex items-center justify-center"
        >
          {systemPct > 12 && (
            <span className="text-gray-500 text-xs font-bold">{systemPct.toFixed(0)}%</span>
          )}
        </motion.div>
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{timeForSelf.toFixed(1)} giờ / ngày cho bản thân</span>
        <span>{timeForSystem.toFixed(1)} giờ / ngày cho hệ thống</span>
      </div>
    </div>
  )
}

// ─── Retention Slider ──────────────────────────────────────────────────────
function RetentionSlider({ currentRetention, minRetention, W, L, role }) {
  const minPct = Math.ceil(minRetention * 100)
  const currentPct = Math.round(currentRetention * 100)
  const [target, setTarget] = useState(Math.max(currentPct + 10, minPct + 10))

  const requiredL = W * (target / 100)
  const increaseNeeded = requiredL - L
  const increasePct = ((increaseNeeded / L) * 100).toFixed(1)
  const sliderMin = Math.max(minPct, 1)
  const sliderMax = 95
  const progress = ((target - sliderMin) / (sliderMax - sliderMin)) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">Mức giữ lại mong muốn</p>
        <span
          className="px-3 py-1 rounded-full text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
        >
          {target}%
        </span>
      </div>

      <div className="relative">
        <div className="h-2 rounded-full bg-gray-100 w-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
          />
        </div>
        <input
          type="range"
          min={sliderMin}
          max={sliderMax}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-2"
          style={{ margin: 0 }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-amber-500 font-medium">Sàn sống được: {minPct}%</span>
        <span className="text-emerald-500 font-medium">Mức lý tưởng: 95%</span>
      </div>

      {target > currentPct ? (
        <div className="rounded-2xl p-4 space-y-1.5" style={{ background: 'linear-gradient(135deg, #faf5ff, #f3e8ff)', border: '1px solid #e9d5ff' }}>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-purple-500">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
            </span>
            <p className="text-sm text-gray-700">
              Để giữ lại{' '}
              <strong className="text-purple-700">{target}%</strong> giá trị tạo ra, bạn cần thu nhập{' '}
              <strong className="text-gray-900">≥ {fmt(requiredL)} VNĐ</strong>.
            </p>
          </div>
          <div className="flex items-start gap-2 pl-5">
            {role === 'driver' ? (
              <p className="text-sm font-medium text-purple-600">
                → Cân nhắc yêu cầu giảm chiết khấu hoặc tăng giá cước để thu thêm{' '}
                <strong>~{fmt(increaseNeeded)} VNĐ/ngày</strong>{' '}
                <span className="font-normal">(tăng ~{increasePct}% thu nhập ròng).</span>
              </p>
            ) : (
              <p className="text-sm font-medium text-purple-600">
                → Cân nhắc thương lượng tăng lương khoảng{' '}
                <strong>{increasePct}%</strong>{' '}
                <span className="font-normal">(thêm ~{fmt(increaseNeeded)} VNĐ/tháng).</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', border: '1px solid #bbf7d0' }}>
          <p className="text-sm text-emerald-700">
            ✓ Bạn đang đạt mục tiêu này rồi — tiếp tục duy trì!
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent, icon }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl p-4 relative overflow-hidden cursor-default ${
        accent
          ? 'text-white shadow-lg shadow-purple-200'
          : 'bg-white border border-gray-100 shadow-sm'
      }`}
      style={accent ? { background: 'linear-gradient(135deg, #6d28d9, #9333ea)' } : {}}
    >
      {accent && (
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
      )}
      <p className={`text-xs font-medium mb-2 ${accent ? 'text-purple-200' : 'text-gray-400'}`}>
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </p>
      <p className={`text-xl font-bold truncate ${accent ? 'text-white' : 'text-gray-800'}`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${accent ? 'text-purple-200' : 'text-gray-400'}`}>{sub}</p>}
    </motion.div>
  )
}

// ─── Main Result ────────────────────────────────────────────────────────────
export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.normalized) {
    navigate('/dashboard')
    return null
  }

  const { role, normalized } = state
  const { W, L, H, C } = normalized

  const retention_rate = L / W
  const contribution_multiple = W / L
  const time_for_self = (C / L) * H
  const time_for_system = H - time_for_self
  const min_retention = C / W

  // Fire-and-forget: save to history, don't block UI
  // useRef guard prevents double-save from React StrictMode double-mount
  const saved = useRef(false)
  useEffect(() => {
    if (saved.current) return
    saved.current = true
    calculationApi.save(role, normalized, state.raw).catch(() => {
      // Silently ignore — user still sees results
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #0f0c29, #1a1035, #2d1b69)' }}
    >
      {/* Decorative blob */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-20 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

      {/* Back button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="relative z-10 px-6 pt-6 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(`/calculator/${role}`)}
          className="flex items-center gap-1.5 text-sm text-purple-300/70 hover:text-purple-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Chỉnh sửa số liệu
        </button>
      </motion.div>

      {/* ── 2-column layout ───────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

        {/* ── LEFT: summary ─────────────────────────── */}
        <div className="space-y-5">

          {/* Headline card */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: '#ffffff' }}
          >
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7, #ec4899)' }} />
            <div className="p-6 sm:p-7">
              <p className="text-xs font-semibold tracking-widest uppercase mb-2 flex items-center gap-1.5" style={{ color: '#9333ea' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-purple-500" />
                {role === 'office' ? 'Nhân viên văn phòng' : 'Tài xế công nghệ'}
              </p>
              <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                Bạn đang tạo ra giá trị{' '}
                <span className="relative inline-block" style={{ color: '#7c3aed' }}>
                  gấp {contribution_multiple.toFixed(1)} lần
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full opacity-30" style={{ background: '#7c3aed' }} />
                </span>{' '}
                {role === 'office' ? 'mức lương nhận được.' : 'thu nhập bạn giữ lại.'}
              </h2>
            </div>
          </motion.div>

          {/* Stat grid */}
          <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="grid grid-cols-2 gap-3">
            <StatCard label="Tỷ lệ giữ lại" value={pct(retention_rate)}
              sub={`Trên tổng ${role === 'driver' ? 'thu' : 'giá trị tạo ra'}`} accent icon="📊" />
            <StatCard label="Hệ số đóng góp" value={`${contribution_multiple.toFixed(2)}×`}
              sub="Giá trị / Thu nhập" icon="⚡" />
            <StatCard label="Tổng giá trị tạo ra" value={fmt(W)}
              sub={role === 'office' ? 'VNĐ / tháng' : 'VNĐ / ngày'} icon="💡" />
            <StatCard label="Thu nhập giữ lại" value={fmt(L)}
              sub={role === 'office' ? 'VNĐ / tháng' : 'VNĐ / ngày'} icon="💰" />
          </motion.div>

          {/* Quote */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show">
            <div className="relative rounded-2xl px-6 py-5 text-center overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #faf5ff, #f5f3ff)' }}>
              <span className="absolute top-2 left-4 text-5xl leading-none text-purple-200 font-serif select-none">"</span>
              <blockquote className="text-sm text-gray-500 italic leading-relaxed relative z-10">
                Con số này giúp bạn hiểu mình đang ở đâu trước khi thương lượng lương
                hoặc quyết định thay đổi công việc.
              </blockquote>
              <span className="absolute bottom-0 right-4 text-5xl leading-none text-purple-200 font-serif select-none">"</span>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3.5 rounded-2xl border-2 border-white/10 text-gray-300 hover:border-purple-400/50 hover:text-purple-200 text-sm font-medium transition-all duration-200"
            >
              Tính vai trò khác
            </button>
            <button
              onClick={() => navigate(`/calculator/${role}`)}
              className="flex-1 py-3.5 rounded-2xl text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-purple-900/40 hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}
            >
              Tính lại
            </button>
          </motion.div>
        </div>

        {/* ── RIGHT: analysis ───────────────────────── */}
        <div className="space-y-5">

          {/* Time bar */}
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#ffffff' }}>
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }} />
            <div className="p-6 sm:p-7 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Trong <strong className="text-purple-700">{H} giờ</strong> làm, thời gian của bạn phân bổ như thế nào?
              </h3>
              <TimeBar
                timeForSelf={time_for_self}
                timeForSystem={time_for_system}
                totalHours={H}
              />
              <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
                <em>
                  "Thời gian làm cho bản thân" = số giờ cần làm để đủ chi phí sống (C).
                  Phần còn lại tạo ra giá trị mà bạn không trực tiếp nhận được.
                </em>
              </p>
            </div>
          </motion.div>

          {/* Retention slider */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-3xl overflow-hidden shadow-2xl" style={{ background: '#ffffff' }}>
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }} />
            <div className="p-6 sm:p-7 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">
                Nếu muốn giữ lại nhiều hơn — cần thay đổi bao nhiêu?
              </h3>
              <RetentionSlider
                currentRetention={retention_rate}
                minRetention={min_retention}
                W={W}
                L={L}
                role={role}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
