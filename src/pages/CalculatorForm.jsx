import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Office worker fields ───────────────────────────────────────────────────
const officeFields = [
  {
    key: "salary_monthly",
    label: "Lương thực nhận / tháng",
    placeholder: "15,000,000",
    hint: "Số tiền thực tế vào tài khoản mỗi tháng",
    unit: "VNĐ",
    icon: "💰",
  },
  {
    key: "total_work_hours_monthly",
    label: "Tổng giờ làm / tháng",
    placeholder: "176",
    hint: "Bao gồm cả OT nếu có",
    unit: "giờ",
    icon: "⏱️",
  },
  {
    key: "total_value_created_monthly",
    label: "Giá trị tạo ra cho công ty / tháng",
    placeholder: "50,000,000",
    hint: "Doanh thu bạn mang về, chi phí tiết kiệm, hoặc giá trị sản phẩm đóng góp",
    unit: "VNĐ",
    icon: "📈",
  },
  {
    key: "living_cost_monthly",
    label: "Chi phí sinh hoạt tối thiểu / tháng",
    placeholder: "8,000,000",
    hint: "Tổng chi phí tối thiểu để đảm bảo cuộc sống",
    unit: "VNĐ",
    icon: "🏠",
  },
];

// ─── Driver fields ────────────────────────────────────────────────────────────
const driverFields = [
  {
    key: "total_revenue_daily",
    label: "Tổng thu / ngày",
    placeholder: "600,000",
    hint: "Tổng tiền khách hàng trả trước khi nền tảng trừ",
    unit: "VNĐ",
    icon: "💵",
  },
  {
    key: "commission_rate",
    label: "% Chiết khấu nền tảng",
    placeholder: "25",
    hint: "Tỷ lệ nền tảng (Grab, Gojek…) trừ vào doanh thu",
    unit: "%",
    icon: "✂️",
  },
  {
    key: "fuel_cost_daily",
    label: "Chi phí xăng / ngày",
    placeholder: "80,000",
    hint: "Chi phí nhiên liệu mỗi ngày",
    unit: "VNĐ",
    icon: "⛽",
  },
  {
    key: "depreciation_daily",
    label: "Khấu hao xe / ngày",
    placeholder: "50,000",
    hint: "Khấu hao + bảo dưỡng ước tính chia theo ngày",
    unit: "VNĐ",
    icon: "🔧",
  },
  {
    key: "living_cost_daily",
    label: "Chi phí sinh hoạt tối thiểu / ngày",
    placeholder: "150,000",
    hint: "Chi phí sinh hoạt tối thiểu mỗi ngày",
    unit: "VNĐ",
    icon: "🏠",
  },
  {
    key: "total_work_hours_daily",
    label: "Tổng giờ làm / ngày",
    placeholder: "10",
    hint: "Số giờ thực tế bạn chạy xe mỗi ngày",
    unit: "giờ",
    icon: "⏱️",
  },
];

const roleConfig = {
  office: {
    title: "Nhân viên văn phòng",
    fields: officeFields,
    icon: "👔",
    gradient: "from-violet-600 to-purple-700",
    accent: "purple",
  },
  driver: {
    title: "Tài xế công nghệ",
    fields: driverFields,
    icon: "🚗",
    gradient: "from-blue-600 to-indigo-700",
    accent: "blue",
  },
};

// ─── Calculation engine ───────────────────────────────────────────────────────
function calculate(role, raw) {
  if (role === "office") {
    const W = raw.total_value_created_monthly;
    const L = raw.salary_monthly;
    const H = raw.total_work_hours_monthly;
    const C = raw.living_cost_monthly;
    return { W, L, H, C };
  }

  const W = raw.total_revenue_daily;
  const platform_cut = W * (raw.commission_rate / 100);
  const driver_gross = W - platform_cut;
  const L =
    driver_gross -
    (raw.fuel_cost_daily + raw.depreciation_daily);
  const C = raw.living_cost_daily;
  const H = raw.total_work_hours_daily;
  return {
    W,
    L,
    H,
    C,
    platform_cut,
    commission_rate: raw.commission_rate,
  };
}

// ─── Input Field Component ────────────────────────────────────────────────────
function InputField({ field, value, error, onChange }) {
  const [focused, setFocused] = useState(false);
  const { key, label, placeholder, hint, unit, icon } = field;
  const hasValue = value !== "" && value !== undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <label className="flex items-center gap-1.5 text-sm text-gray-600 mb-2 cursor-pointer">
        <span className="text-base leading-none">{icon}</span>
        <span className="font-medium text-gray-700">
          {label}
        </span>
        <span className="text-purple-400 font-normal">
          ({unit})
        </span>
      </label>

      <div
        className={`relative flex items-center rounded-xl border-2 transition-all duration-200 overflow-hidden
          ${
            error
              ? "border-red-400 bg-red-50/40"
              : focused
                ? "border-purple-400 bg-white shadow-[0_0_0_4px_rgba(168,85,247,0.08)]"
                : hasValue
                  ? "border-purple-200 bg-white"
                  : "border-gray-200 bg-gray-50/80 hover:border-gray-300 hover:bg-gray-50"
          }`}
      >
        <input
          type="number"
          min="0"
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 text-sm px-3 py-2.5 bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-400
            [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <div
          className={`px-3 py-2.5 border-l-2 text-xs font-semibold transition-colors duration-200
            ${
              error
                ? "border-red-300 text-red-400 bg-red-50"
                : focused
                  ? "border-purple-300 text-purple-500 bg-purple-50/60"
                  : "border-gray-200 text-gray-400 bg-gray-100/80"
            }`}
        >
          {unit}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-xs text-red-500 mt-1.5"
          >
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </motion.p>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-gray-400 mt-1.5 pl-0.5"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ fields, values }) {
  const filled = fields.filter(({ key }) => {
    const v = values[key];
    return (
      v !== "" &&
      v !== undefined &&
      v !== null &&
      !isNaN(Number(v))
    );
  }).length;
  const total = fields.length;
  const pct = Math.round((filled / total) * 100);

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">
          {filled}/{total} trường đã điền
        </span>
        <span className="text-xs font-semibold text-purple-500">
          {pct}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CalculatorForm() {
  const { role } = useParams();
  const navigate = useNavigate();
  const config = roleConfig[role];

  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  if (!config) {
    navigate("/dashboard");
    return null;
  }

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    config.fields.forEach(({ key }) => {
      const val = values[key];
      if (val === "" || val === undefined || val === null) {
        newErrors[key] = "Vui lòng nhập giá trị";
      } else if (isNaN(Number(val)) || Number(val) < 0) {
        newErrors[key] = "Vui lòng nhập số hợp lệ (≥ 0)";
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const raw = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, Number(v)]),
    );
    const normalized = calculate(role, raw);
    navigate("/result", { state: { role, normalized, raw } });
  };

  const leftContent = role === 'office'
    ? {
        headline: 'Bạn tạo ra bao nhiêu — và giữ lại được bao nhiêu?',
        desc: 'Điền thông tin để hiểu tỷ lệ giá trị bạn thực sự giữ lại từ công việc của mình.',
        bullets: [
          { icon: '📊', text: 'Tỷ lệ giá trị bạn giữ lại so với đóng góp thực tế' },
          { icon: '⏱️', text: 'Bao nhiêu giờ bạn làm cho bản thân, bao nhiêu cho hệ thống' },
          { icon: '💬', text: 'Con số cụ thể để thương lượng tăng lương' },
        ],
      }
    : {
        headline: 'Sau khấu trừ, tay bạn còn lại bao nhiêu?',
        desc: 'Điền thông tin để tính chính xác thu nhập ròng và tỷ lệ nền tảng đang lấy từ bạn.',
        bullets: [
          { icon: '✂️', text: 'Tỷ lệ thực sự nền tảng đang chiết khấu' },
          { icon: '⏱️', text: 'Số giờ bạn làm cho bản thân vs cho nền tảng' },
          { icon: '📢', text: 'Cơ sở yêu cầu giảm chiết khấu hoặc tăng giá cước' },
        ],
      }

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-purple-950">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-700/15 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row">

        {/* ── Left panel ───────────────────────────────────────────────── */}
        <div className="flex-col flex justify-center lg:px-16 px-8 py-12 lg:py-0 lg:h-screen lg:overflow-hidden sm:max-w-full lg:max-w-xl xl:max-w-2xl z-10 w-full">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-10"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200 transition-colors group"
            >
              <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              Quay lại
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex flex-col text-gray-300"
          >
            {/* Role badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} w-fit mb-6 shadow-lg`}>
              <span className="text-lg">{config.icon}</span>
              <span className="text-white text-sm font-semibold">{config.title}</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-bold text-white leading-snug mb-4">
              {leftContent.headline}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              {leftContent.desc}
            </p>

            <div className="space-y-3">
              {leftContent.bullets.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-base">
                    {b.icon}
                  </span>
                  <span className="text-sm text-gray-300">{b.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Right panel — form card ───────────────────────────────────── */}
        <div className="flex justify-center self-center z-10 px-4 py-8 lg:h-screen lg:overflow-y-auto w-full lg:w-[440px] lg:flex-shrink-0 lg:mr-16 xl:mr-24"
          style={{ scrollbarWidth: 'none' }}>
          <div className="py-2 w-full">
            <div className="relative">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-purple-500/30 via-transparent to-violet-500/20 pointer-events-none" />
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-purple-950/40 overflow-hidden">
                <div className={`h-1 w-full bg-gradient-to-r ${config.gradient}`} />

                <div className="p-5">
                  {/* Header (mobile only) */}
                  <div className="mb-3 lg:hidden">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} shadow-md mb-3`}>
                      <span className="text-xl">{config.icon}</span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-xl">{config.title}</h2>
                    <p className="text-gray-400 text-sm mt-1">Nhập thông tin bên dưới để tính toán.</p>
                  </div>
                  {/* Header (desktop) */}
                  <div className="mb-3 hidden lg:block">
                    <p className="text-gray-400 text-sm">Nhập thông tin bên dưới để tính toán.</p>
                  </div>

                  <ProgressBar fields={config.fields} values={values} />

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-3">
                      {config.fields.map((field, i) => (
                        <motion.div
                          key={field.key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                        >
                          <InputField
                            field={field}
                            value={values[field.key]}
                            error={errors[field.key]}
                            onChange={handleChange}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative w-full mt-5 py-3 rounded-2xl bg-gradient-to-r ${config.gradient}
                        text-white font-semibold shadow-lg shadow-purple-900/30
                        hover:shadow-xl hover:shadow-purple-900/40 transition-shadow duration-200
                        overflow-hidden group`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      <span className="relative flex items-center justify-center gap-2">
                        Xem kết quả
                        <motion.span
                          className="inline-block"
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        >
                          →
                        </motion.span>
                      </span>
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}