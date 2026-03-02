import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { calculationApi } from '../services/api'
import { ArrowLeft, Briefcase, Truck, Clock, Trash2, BarChart2, RefreshCw, X, ChevronRight } from 'lucide-react'

const officeLabels = {
  salary_monthly:              { label: 'Lương thực nhận / tháng',             unit: 'VNĐ' },
  total_work_hours_monthly:    { label: 'Tổng giờ làm / tháng',                unit: 'giờ' },
  total_value_created_monthly: { label: 'Giá trị tạo ra cho công ty / tháng',  unit: 'VNĐ' },
  living_cost_monthly:         { label: 'Chi phí sinh hoạt tối thiểu / tháng', unit: 'VNĐ' },
}
const driverLabels = {
  total_revenue_daily:    { label: 'Tổng thu / ngày',                       unit: 'VNĐ' },
  commission_rate:        { label: '% Chiết khấu nền tảng',                 unit: '%'   },
  fuel_cost_daily:        { label: 'Chi phí xăng / ngày',                   unit: 'VNĐ' },
  depreciation_daily:     { label: 'Khấu hao xe / ngày',                    unit: 'VNĐ' },
  living_cost_daily:      { label: 'Chi phí sinh hoạt tối thiểu / ngày',    unit: 'VNĐ' },
  total_work_hours_daily: { label: 'Tổng giờ làm / ngày',                   unit: 'giờ' },
}

const fmt    = (n) => new Intl.NumberFormat('vi-VN').format(Math.round(n))
const pct    = (n) => `${(n * 100).toFixed(1)}%`
const fmtDate = (d) =>
  new Date(d).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

function RoleBadge({ role }) {
  return role === 'office' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/20 border border-violet-500/30 text-violet-300">
      <Briefcase className="w-3 h-3" /> Văn phòng
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-500/30 text-blue-300">
      <Truck className="w-3 h-3" /> Tài xế
    </span>
  )
}

function HistoryCard({ item, onDelete, onClick }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm('Xóa bản ghi này?')) return
    setDeleting(true)
    try {
      await calculationApi.remove(item.id)
      onDelete(item.id)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="relative rounded-2xl border border-white/8 overflow-hidden cursor-pointer group hover:border-white/15 transition-colors duration-200"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      {/* Top accent */}
      <div
        className="h-0.5 w-full"
        style={{
          background: item.role === 'office'
            ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
            : 'linear-gradient(90deg, #3b82f6, #6366f1)',
        }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <RoleBadge role={item.role} />
            <span className="flex items-center gap-1 text-xs text-white/35">
              <Clock className="w-3 h-3" />
              {fmtDate(item.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat
            label="Tỷ lệ giữ lại"
            value={pct(item.retention_rate)}
            highlight={item.retention_rate >= 0.5}
            color={item.retention_rate >= 0.5 ? 'text-emerald-400' : 'text-amber-400'}
          />
          <Stat
            label="Bội số đóng góp"
            value={`${item.contribution_multiple.toFixed(2)}×`}
            color="text-violet-300"
          />
          <Stat
            label="Giờ cho bản thân"
            value={`${item.time_for_self.toFixed(1)}h`}
            color="text-sky-300"
          />
          <Stat
            label="Giờ cho hệ thống"
            value={`${item.time_for_system.toFixed(1)}h`}
            color="text-rose-300"
          />
        </div>

        {/* Mini bar */}
        <div className="mt-4">
          <div className="h-1.5 rounded-full overflow-hidden bg-white/5 flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(item.time_for_self / (item.time_for_self + item.time_for_system)) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{
                background: item.role === 'office'
                  ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
                  : 'linear-gradient(90deg, #3b82f6, #6366f1)',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Stat({ label, value, color = 'text-white' }) {
  return (
    <div className="rounded-xl px-3 py-2.5 bg-white/[0.03] border border-white/5">
      <p className="text-xs text-white/35 mb-1 truncate">{label}</p>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, onClose }) {
  const labelMap = item.role === 'office' ? officeLabels : driverLabels
  const raw = item.raw_input || {}
  const selfPct   = (item.time_for_self / (item.time_for_self + item.time_for_system)) * 100
  const systemPct = 100 - selfPct
  const gradient  = item.role === 'office'
    ? 'linear-gradient(90deg, #7c3aed, #a855f7)'
    : 'linear-gradient(90deg, #3b82f6, #6366f1)'
  const increaseAmt = Math.max(0, item.W * 0.5 - item.L)
  const increasePct = item.L > 0 ? ((increaseAmt / item.L) * 100).toFixed(1) : '0'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        style={{ background: '#111827', scrollbarWidth: 'none' }}
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-1 w-full rounded-t-3xl" style={{ background: gradient }} />
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <RoleBadge role={item.role} />
              <p className="flex items-center gap-1.5 text-xs text-white/35 mt-2">
                <Clock className="w-3 h-3" />{fmtDate(item.created_at)}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Số liệu đã nhập */}
          {Object.keys(raw).length > 0 && (
            <section>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Số liệu bạn nhập</h4>
              <div className="space-y-0">
                {Object.entries(raw).map(([key, val]) => {
                  const meta = labelMap[key]
                  if (!meta) return null
                  return (
                    <div key={key} className="flex justify-between py-2.5 border-b border-white/5 last:border-0">
                      <span className="text-sm text-white/50">{meta.label}</span>
                      <span className="text-sm font-semibold text-white">
                        {meta.unit === '%' ? `${val}%` : `${fmt(val)} ${meta.unit}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Kết quả */}
          <section>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Kết quả tính toán</h4>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Tỷ lệ giữ lại" value={pct(item.retention_rate)}
                color={item.retention_rate >= 0.5 ? 'text-emerald-400' : 'text-amber-400'} />
              <Stat label="Bội số đóng góp" value={`${item.contribution_multiple.toFixed(2)}×`} color="text-violet-300" />
              <Stat label="Giờ cho bản thân / ngày" value={`${item.time_for_self.toFixed(1)}h`} color="text-sky-300" />
              <Stat label="Giờ cho hệ thống / ngày" value={`${item.time_for_system.toFixed(1)}h`} color="text-rose-300" />
            </div>
          </section>

          {/* Phân bổ thời gian */}
          <section>
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Phân bổ thời gian</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/40">
                <span>Bản thân ({selfPct.toFixed(0)}%)</span>
                <span>Hệ thống ({systemPct.toFixed(0)}%)</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden bg-white/5 flex">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${selfPct}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full" style={{ background: gradient }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/30">
                <span>{item.time_for_self.toFixed(1)} giờ</span>
                <span>{item.time_for_system.toFixed(1)} giờ</span>
              </div>
            </div>
          </section>

          {/* Gợi ý */}
          <section className="rounded-2xl p-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <h4 className="text-xs font-semibold text-violet-300 uppercase tracking-widest mb-2">Gợi ý thương lượng</h4>
            {item.retention_rate < 0.5 ? (
              <p className="text-sm text-white/70 leading-relaxed">
                Bạn đang giữ lại <strong className="text-amber-400">{pct(item.retention_rate)}</strong>.
                Để đạt mức <strong className="text-violet-300">50%</strong>, cần tăng thêm{' '}
                <strong className="text-white">~{fmt(increaseAmt)} VNĐ</strong>{' '}
                ({item.role === 'driver' ? 'giảm chiết khấu hoặc tăng giá cước' : 'thương lượng tăng lương'}{' '}
                ~<strong className="text-violet-300">{increasePct}%</strong>).
              </p>
            ) : (
              <p className="text-sm text-emerald-400">
                ✓ Bạn đang giữ lại <strong>{pct(item.retention_rate)}</strong> — trên mức 50%. Tiếp tục duy trì!
              </p>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [records, setRecords]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [hasMore, setHasMore]   = useState(false)
  const [offset, setOffset]     = useState(0)
  const [selected, setSelected] = useState(null)
  const LIMIT = 10

  const fetchRecords = async (off = 0, replace = true) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await calculationApi.getAll(LIMIT, off)
      const rows = data.data || []
      setRecords(prev => replace ? rows : [...prev, ...rows])
      setHasMore(off + rows.length < (data.meta?.total || 0))
      setOffset(off + rows.length)
    } catch {
      setError('Không thể tải lịch sử. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchRecords(0) }, [])

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-700/30 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/5 backdrop-blur-sm">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <BarChart2 className="w-4 h-4 text-violet-400" />
          Lịch sử tính toán
        </div>
        <button
          onClick={() => fetchRecords(0)}
          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </nav>

      {/* Content */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Loading skeleton */}
        {loading && records.length === 0 && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-white/[0.04] border border-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => fetchRecords(0)}
              className="px-4 py-2 rounded-xl text-sm bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && records.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
              <BarChart2 className="w-7 h-7 text-violet-400" />
            </div>
            <div>
              <p className="text-white/70 font-medium mb-1">Chưa có lịch sử nào</p>
              <p className="text-white/35 text-sm">Thực hiện tính toán đầu tiên của bạn để xem kết quả ở đây.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #6d28d9, #9333ea)' }}
            >
              Bắt đầu tính
            </button>
          </div>
        )}

        {/* Records */}
        {records.length > 0 && (
          <>
            <p className="text-xs text-white/30 mb-4">
              {records.length} bản ghi{hasMore ? ' (còn thêm)' : ''} — nhấn vào để xem chi tiết
            </p>
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {records.map(item => (
                  <HistoryCard key={item.id} item={item} onDelete={handleDelete} onClick={() => setSelected(item)} />
                ))}
              </div>
            </AnimatePresence>

            {/* Load more */}
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => fetchRecords(offset, false)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-sm text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all disabled:opacity-40"
                >
                  {loading ? 'Đang tải...' : 'Xem thêm'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && <DetailModal item={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
