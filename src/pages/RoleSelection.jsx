import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Briefcase, Truck, Sparkles, ChevronRight, History } from "lucide-react";

const roles = [
  {
    id: "office",
    icon: Briefcase,
    title: "Tôi là nhân viên văn phòng",
    description:
      "Tính tỷ lệ giá trị bạn giữ lại so với những gì bạn tạo ra cho công ty.",
    badge: "Phổ biến nhất",
    gradient: "from-violet-500/20 to-purple-600/10",
    border: "border-violet-500/40",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    id: "driver",
    icon: Truck,
    title: "Tôi là tài xế công nghệ",
    description:
      "Tính phần bạn thực sự giữ lại sau khi trừ chiết khấu nền tảng và chi phí vận hành.",
    badge: null,
    gradient: "from-indigo-500/20 to-blue-600/10",
    border: "border-indigo-500/40",
    glow: "group-hover:shadow-indigo-500/20",
  },
];

export default function RoleSelection() {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  // Decode username from JWT without extra API call
  const username = (() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || null;
    } catch { return null; }
  })();

  return (
    <div className="h-screen w-full bg-[#0d0d14] text-white relative overflow-hidden flex flex-col">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-700/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-violet-600/30 rounded-full blur-[80px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-indigo-900/20 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Navbar */}
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Lịch sử</span>
          </button>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Badge */}
        <div className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Khám phá giá trị thực của bạn</span>
        </div>

        {/* Heading */}
        <div className="text-center max-w-3xl mb-6">
          {username && (
            <p className="text-white/80 text-xl mb-3">
              Xin chào, <span className="text-violet-300 font-semibold">{username}</span> 👋
            </p>
          )}
          <h1 className="text-white mb-3" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Bạn đang giữ lại bao nhiêu
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              từ công việc của mình?
            </span>
          </h1>
          <p className="text-white/50 max-w-md mx-auto" style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", lineHeight: 1.7 }}>
            Chọn vai trò để bắt đầu tính toán và hiểu vị thế của bạn trong quan hệ lao động.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mt-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => { setSelected(role.id); navigate(`/calculator/${role.id}`); }}
                className={`group relative text-left rounded-2xl p-6 border transition-all duration-300 bg-gradient-to-br ${role.gradient} ${role.border} hover:border-opacity-80 ${isSelected ? "ring-2 ring-violet-500/60 scale-[1.02]" : "hover:scale-[1.02]"} shadow-xl ${role.glow} hover:shadow-2xl`}
              >
                {/* Card background shimmer */}
                <div className="absolute inset-0 rounded-2xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {role.badge && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium">
                    {role.badge}
                  </div>
                )}

                {/* Icon */}
                <div className="mb-5 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-600/20 border border-violet-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon className="w-5 h-5 text-violet-300" />
                </div>

                {/* Text */}
                <h2 className="text-white mb-2" style={{ fontSize: "1.05rem", fontWeight: 700 }}>
                  {role.title}
                </h2>
                <p className="text-white/50 mb-5" style={{ fontSize: "0.875rem", lineHeight: 1.65 }}>
                  {role.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-violet-400 group-hover:text-violet-300 transition-colors duration-200" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                  <span>Bắt đầu</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-white/25 text-xs text-center">
          Dữ liệu của bạn được tính toán hoàn toàn cục bộ. Không lưu trữ thông tin cá nhân.
        </p>
      </main>
    </div>
  );
}
