import { useState } from "react";
import Icon from "@/components/ui/icon";
import StudentApp from "@/components/StudentApp";
import AdminPanel from "@/components/AdminPanel";
import { type Role } from "@/types";

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleLogin() {
    if (password === "1234") { onLogin("student"); return; }
    if (password === "admin") { onLogin("admin"); return; }
    setError(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1e1048 40%, #0e2040 100%)" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${120 + i * 100}px`,
              height: `${120 + i * 100}px`,
              background: `radial-gradient(circle, ${["rgba(124,58,237,0.15)","rgba(6,182,212,0.12)","rgba(236,72,153,0.10)","rgba(245,158,11,0.10)","rgba(16,185,129,0.10)"][i]}, transparent)`,
              left: `${[15,70,35,80,10][i]}%`,
              top: `${[25,15,65,55,75][i]}%`,
              transform: "translate(-50%,-50%)",
              filter: "blur(20px)",
            }} />
        ))}
      </div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
            <span className="text-3xl">🎓</span>
          </div>
          <h1 className="font-heading font-black text-white text-3xl mb-1">EduSpace</h1>
          <p className="text-white/40 text-sm">Платформа для учеников репетитора</p>
        </div>
        <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <h2 className="font-heading font-bold text-white text-lg mb-1">Вход в систему</h2>
          <p className="text-white/40 text-sm mb-5">Введите пароль, выданный репетитором</p>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Введите пароль"
            className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm mb-3 focus:outline-none focus:ring-2 transition-all ${error ? "border border-rose-400 bg-rose-500/10 focus:ring-rose-400" : "bg-white/10 border border-white/20 focus:ring-violet-400"}`}
          />
          {error && (
            <p className="text-rose-400 text-xs mb-3 flex items-center gap-1.5">
              <Icon name="AlertCircle" size={13} />Неверный пароль
            </p>
          )}
          <button onClick={handleLogin} className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg">
            Войти
          </button>
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
            <p className="text-white/30 text-xs font-semibold">Демо-пароли:</p>
            <p className="text-white/40 text-xs flex justify-between"><span>Ученик</span><span className="font-mono text-white/60">1234</span></p>
            <p className="text-white/40 text-xs flex justify-between"><span>Репетитор</span><span className="font-mono text-white/60">admin</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("none");
  if (role === "none") return <LoginScreen onLogin={setRole} />;
  if (role === "admin") return <AdminPanel onLogout={() => setRole("none")} />;
  return <StudentApp onLogout={() => setRole("none")} />;
}
