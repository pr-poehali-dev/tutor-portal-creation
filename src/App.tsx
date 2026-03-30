import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";

const API = "https://functions.poehali.dev/0fbe2e51-ab9d-4a51-a987-ac6fe46670fb";

type Page = "home" | "section";
type AdminPage = "dashboard" | "materials" | "sections" | "notifications";
type Role = "none" | "student" | "admin";

interface Section {
  id: number;
  slug: string;
  label: string;
  icon: string;
  color: string;
  sort_order: number;
}

interface Material {
  id: number;
  title: string;
  desc: string;
  tag: string;
  color: string;
  icon: string;
  section: string;
  date: string;
}

interface Notif {
  id: number;
  text: string;
  type: string;
  time: string;
}

const tagColors: Record<string, string> = {
  "Срочно": "bg-rose-100 text-rose-700",
  "Сдано": "bg-green-100 text-green-700",
  "Проверено": "bg-violet-100 text-violet-700",
  "Алгебра": "bg-violet-100 text-violet-700",
  "Геометрия": "bg-cyan-100 text-cyan-700",
  "Анализ": "bg-pink-100 text-pink-700",
  "Средний": "bg-amber-100 text-amber-700",
  "Сложный": "bg-red-100 text-red-700",
  "Контроль": "bg-green-100 text-green-700",
  "Видео": "bg-cyan-100 text-cyan-700",
  "Новый": "bg-blue-100 text-blue-700",
};

const COLOR_OPTIONS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-cyan-500 to-teal-500",
  "from-pink-500 to-fuchsia-600",
  "from-rose-500 to-pink-500",
  "from-indigo-500 to-blue-600",
  "from-amber-500 to-orange-500",
];
const COLOR_HEX: Record<string, string> = {
  "from-violet-500 to-purple-600": "#7c3aed",
  "from-cyan-500 to-blue-500": "#06b6d4",
  "from-pink-500 to-rose-500": "#ec4899",
  "from-orange-500 to-amber-500": "#f97316",
  "from-green-500 to-emerald-500": "#22c55e",
  "from-cyan-500 to-teal-500": "#14b8a6",
  "from-pink-500 to-fuchsia-600": "#d946ef",
  "from-rose-500 to-pink-500": "#f43f5e",
  "from-indigo-500 to-blue-600": "#6366f1",
  "from-amber-500 to-orange-500": "#f59e0b",
};

const ICON_OPTIONS = ["BookOpen","Video","ClipboardList","PenLine","FolderOpen","Star","Music","Globe","FileText","Zap","Award","Layers","Code","Calculator","Microscope","FlaskConical"];

// ── API helpers ────────────────────────────────────────────────

async function apiFetch(resource: string, params: Record<string,string> = {}, opts: RequestInit = {}) {
  const qs = new URLSearchParams({ resource, ...params }).toString();
  const res = await fetch(`${API}?${qs}`, opts);
  return res.json();
}

function adminFetch(resource: string, params: Record<string,string> = {}, opts: RequestInit = {}) {
  return apiFetch(resource, params, {
    ...opts,
    headers: { "Content-Type": "application/json", "X-Admin-Token": "admin", ...((opts.headers as Record<string,string>) || {}) },
  });
}

// ── shared components ──────────────────────────────────────────

function Spinner() {
  return <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" /></div>;
}

function MaterialCard({ m, onDelete }: { m: Material; onDelete?: (id: number) => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border card-hover animate-fade-in">
      <div className={`h-1.5 bg-gradient-to-r ${m.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0`}>
            <Icon name={m.icon} size={18} className="text-white" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[m.tag] || "bg-muted text-muted-foreground"}`}>{m.tag}</span>
            {onDelete && (
              <button onClick={() => onDelete(m.id)} className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors">
                <Icon name="Trash2" size={13} className="text-rose-500" />
              </button>
            )}
          </div>
        </div>
        <h3 className="font-heading font-bold text-foreground mb-1 text-base leading-tight">{m.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{m.desc}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="Calendar" size={12} />{m.date}
        </div>
      </div>
    </div>
  );
}

// ── student pages ──────────────────────────────────────────────

function HomePage({ sections, materials, setCurrentSection, setPage }: {
  sections: Section[];
  materials: Material[];
  setCurrentSection: (s: Section) => void;
  setPage: (p: Page) => void;
}) {
  const recent = materials.slice(0, 2);
  return (
    <div className="animate-fade-in">
      <div className="relative rounded-3xl overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 60%, #ec4899 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20"><span className="text-2xl">👨‍🎓</span></div>
            <div>
              <p className="text-white/70 text-xs">Добро пожаловать!</p>
              <h2 className="font-heading font-bold text-white text-base">Иван Петров</h2>
            </div>
          </div>
          <h1 className="font-heading font-black text-white text-2xl leading-tight mb-2">Учись умнее,<br />достигай большего</h1>
          <p className="text-white/70 text-sm">Все материалы и задания в одном месте</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Материалов", value: String(materials.length), icon: "BookOpen", color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Разделов", value: String(sections.length), icon: "LayoutGrid", color: "text-cyan-500", bg: "bg-cyan-50" },
          { label: "Срочных", value: String(materials.filter(m => m.tag === "Срочно").length), icon: "Bell", color: "text-rose-500", bg: "bg-rose-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-border shadow-sm">
            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon name={s.icon} size={16} className={s.color} />
            </div>
            <div className="font-heading font-black text-xl text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="font-heading font-bold text-lg text-foreground mb-3">Разделы</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {sections.map(s => (
          <button key={s.slug} onClick={() => { setCurrentSection(s); setPage("section"); }}
            className="bg-white rounded-2xl p-4 text-left border border-border shadow-sm card-hover">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <Icon name={s.icon} size={18} className="text-white" />
            </div>
            <div className="font-heading font-bold text-foreground text-sm">{s.label}</div>
            <div className="text-xs font-semibold text-violet-600 mt-2">{materials.filter(m => m.section === s.slug).length} материалов →</div>
          </button>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <h2 className="font-heading font-bold text-lg text-foreground mb-3">Последние материалы</h2>
          <div className="space-y-3">{recent.map(m => <MaterialCard key={m.id} m={m} />)}</div>
        </>
      )}
    </div>
  );
}

function SectionPage({ section, materials }: { section: Section; materials: Material[] }) {
  const items = materials.filter(m => m.section === section.slug);
  return (
    <div className="animate-fade-in">
      <div className={`rounded-2xl p-6 bg-gradient-to-r ${section.color} text-white mb-6`}>
        <h1 className="font-heading font-bold text-2xl mb-1">{section.label}</h1>
        <p className="text-white/80 text-sm">{items.length} материалов</p>
      </div>
      {items.length === 0
        ? <div className="text-center py-16 text-muted-foreground text-sm">Материалов пока нет</div>
        : <div className="space-y-3">{items.map(m => <MaterialCard key={m.id} m={m} />)}</div>
      }
    </div>
  );
}

function ProfilePage({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="animate-fade-in">
      <div className="relative rounded-3xl overflow-hidden mb-6" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}>
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-3 text-4xl border-2 border-white/30">👨‍🎓</div>
          <h2 className="font-heading font-bold text-white text-xl">Иван Петров</h2>
          <p className="text-white/50 text-sm mt-0.5">ivan@example.com</p>
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/70 text-xs px-3 py-1.5 rounded-full mt-3">
            <Icon name="GraduationCap" size={12} />Ученик с октября 2024
          </div>
        </div>
      </div>
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-semibold text-sm py-3.5 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors">
        <Icon name="LogOut" size={16} />Выйти из аккаунта
      </button>
    </div>
  );
}

function NotificationsPanel({ notifications, onClose, onMarkAll }: { notifications: Notif[]; onClose: () => void; onMarkAll: () => void }) {
  const typeColors: Record<string, string> = { task: "from-rose-500 to-pink-500", theory: "from-violet-500 to-purple-600", lecture: "from-cyan-500 to-blue-500", practice: "from-orange-500 to-amber-500" };
  const typeIcons: Record<string, string> = { task: "ClipboardList", theory: "BookOpen", lecture: "Video", practice: "PenLine" };
  return (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 animate-scale-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-heading font-bold text-foreground text-sm">Уведомления</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center"><Icon name="X" size={14} className="text-muted-foreground" /></button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0
          ? <div className="text-center py-8 text-sm text-muted-foreground">Нет уведомлений</div>
          : notifications.map(n => (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${typeColors[n.type] || "from-violet-500 to-purple-600"} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon name={typeIcons[n.type] || "Bell"} size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-tight">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
            </div>
          ))
        }
      </div>
      <div className="p-3">
        <button onClick={onMarkAll} className="w-full text-center text-sm text-violet-600 font-semibold py-2 hover:bg-violet-50 rounded-xl transition-colors">Отметить все как прочитанные</button>
      </div>
    </div>
  );
}

// ── admin forms ────────────────────────────────────────────────

function AddMaterialForm({ sections, onAdd }: { sections: Section[]; onAdd: (m: Material) => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("");
  const [sectionSlug, setSectionSlug] = useState(sections[0]?.slug || "");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [icon, setIcon] = useState("BookOpen");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (sections.length && !sectionSlug) setSectionSlug(sections[0].slug); }, [sections]);

  async function handleSubmit() {
    if (!title.trim() || !sectionSlug) return;
    setLoading(true);
    const sec = sections.find(s => s.slug === sectionSlug);
    const data = await adminFetch("materials", {}, {
      method: "POST",
      body: JSON.stringify({ title: title.trim(), desc: desc.trim(), tag: tag.trim() || sec?.label || "", color, icon, section: sectionSlug }),
    });
    setLoading(false);
    if (data.id) { onAdd(data); setTitle(""); setDesc(""); setTag(""); }
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 animate-fade-in">
      <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center"><Icon name="Plus" size={14} className="text-white" /></div>
        Добавить материал
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Раздел</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {sections.map(s => (
              <button key={s.slug} onClick={() => setSectionSlug(s.slug)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${sectionSlug === s.slug ? "border-violet-400 bg-violet-50 text-violet-700" : "border-border bg-background text-foreground hover:border-violet-200"}`}>
                <Icon name={s.icon} size={14} />{s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Название *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Лекция №9"
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Описание</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Краткое описание..." rows={2}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Метка</label>
            <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Например: Видео"
              className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Цвет</label>
            <div className="flex gap-1.5 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-lg transition-all ${color === c ? "ring-2 ring-offset-1 ring-violet-500 scale-110" : "hover:scale-105"}`}
                  style={{ background: COLOR_HEX[c] }} />
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Иконка</label>
          <div className="flex gap-2 flex-wrap">
            {ICON_OPTIONS.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${icon === ic ? "gradient-brand" : "bg-muted hover:bg-muted-foreground/20"}`}>
                <Icon name={ic} size={15} className={icon === ic ? "text-white" : "text-muted-foreground"} />
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSubmit} disabled={!title.trim() || loading}
          className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon name="Plus" size={15} />}
          Добавить материал
        </button>
      </div>
    </div>
  );
}

function AddSectionForm({ onAdd }: { onAdd: (s: Section) => void }) {
  const [label, setLabel] = useState("");
  const [icon, setIcon] = useState("FolderOpen");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!label.trim()) return;
    setLoading(true);
    const data = await adminFetch("sections", {}, { method: "POST", body: JSON.stringify({ label: label.trim(), icon, color }) });
    setLoading(false);
    if (data.id) { onAdd(data); setLabel(""); }
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 animate-fade-in">
      <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center"><Icon name="FolderPlus" size={14} className="text-white" /></div>
        Новый раздел
      </h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Название раздела *</label>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Например: Тесты ЕГЭ"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Иконка</label>
          <div className="flex gap-2 flex-wrap">
            {ICON_OPTIONS.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${icon === ic ? "gradient-brand" : "bg-muted hover:bg-muted-foreground/20"}`}>
                <Icon name={ic} size={15} className={icon === ic ? "text-white" : "text-muted-foreground"} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Цвет</label>
          <div className="flex gap-1.5 flex-wrap">
            {COLOR_OPTIONS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-lg transition-all ${color === c ? "ring-2 ring-offset-1 ring-violet-500 scale-110" : "hover:scale-105"}`}
                style={{ background: COLOR_HEX[c] }} />
            ))}
          </div>
        </div>
        <div className={`h-12 rounded-xl bg-gradient-to-r ${color} flex items-center gap-3 px-4`}>
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><Icon name={icon} size={16} className="text-white" /></div>
          <span className="text-white font-semibold text-sm">{label || "Предпросмотр раздела"}</span>
        </div>
        <button onClick={handleSubmit} disabled={!label.trim() || loading}
          className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon name="FolderPlus" size={15} />}
          Создать раздел
        </button>
      </div>
    </div>
  );
}

// ── admin pages ────────────────────────────────────────────────

function AdminDashboard({ sections, materials, notifications }: { sections: Section[]; materials: Material[]; notifications: Notif[] }) {
  return (
    <div className="animate-fade-in space-y-5">
      <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #1e1b4b, #4c1d95)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">👩‍🏫</div>
          <div><p className="text-white/60 text-xs">Панель управления</p><h2 className="font-heading font-bold text-white">Репетитор</h2></div>
        </div>
        <p className="text-white/60 text-sm">Управляйте материалами, разделами и уведомлениями</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Материалов", value: materials.length, icon: "BookOpen", color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Разделов", value: sections.length, icon: "FolderOpen", color: "text-cyan-500", bg: "bg-cyan-50" },
          { label: "Уведомлений", value: notifications.length, icon: "Bell", color: "text-rose-500", bg: "bg-rose-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-border shadow-sm">
            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}><Icon name={s.icon} size={16} className={s.color} /></div>
            <div className="font-heading font-black text-xl text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border"><h3 className="font-heading font-bold text-foreground text-sm">Материалы по разделам</h3></div>
        {sections.map(s => {
          const cnt = materials.filter(m => m.section === s.slug).length;
          const pct = materials.length > 0 ? (cnt / materials.length) * 100 : 0;
          return (
            <div key={s.slug} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}><Icon name={s.icon} size={14} className="text-white" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <span className="text-xs font-bold text-violet-600">{cnt}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all`} style={{ width: `${Math.max(pct, 2)}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminMaterials({ sections, materials, onAdd, onDelete }: {
  sections: Section[]; materials: Material[];
  onAdd: (m: Material) => void;
  onDelete: (id: number) => void;
}) {
  const [activeSlug, setActiveSlug] = useState(sections[0]?.slug || "");
  useEffect(() => { if (sections.length && !activeSlug) setActiveSlug(sections[0].slug); }, [sections]);
  const filtered = materials.filter(m => m.section === activeSlug);
  return (
    <div className="animate-fade-in space-y-4">
      <AddMaterialForm sections={sections} onAdd={onAdd} />
      <div>
        <h3 className="font-heading font-bold text-foreground mb-3">Все материалы</h3>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {sections.map(s => (
            <button key={s.slug} onClick={() => setActiveSlug(s.slug)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${activeSlug === s.slug ? "gradient-brand text-white" : "bg-white border border-border text-muted-foreground hover:border-violet-300"}`}>
              {s.label} ({materials.filter(m => m.section === s.slug).length})
            </button>
          ))}
        </div>
        {filtered.length === 0
          ? <div className="text-center py-10 text-muted-foreground text-sm">В этом разделе пока нет материалов</div>
          : <div className="space-y-3">{filtered.map(m => <MaterialCard key={m.id} m={m} onDelete={onDelete} />)}</div>
        }
      </div>
    </div>
  );
}

function AdminSections({ sections, onAdd, onDelete }: {
  sections: Section[];
  onAdd: (s: Section) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="animate-fade-in space-y-4">
      <AddSectionForm onAdd={onAdd} />
      <div>
        <h3 className="font-heading font-bold text-foreground mb-3">Все разделы ({sections.length})</h3>
        <div className="space-y-3">
          {sections.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden animate-fade-in">
              <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />
              <div className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={s.icon} size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-bold text-foreground text-sm">{s.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">{s.slug}</div>
                </div>
                <button onClick={() => onDelete(s.id)}
                  className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon name="Trash2" size={14} className="text-rose-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminNotifications({ notifications, onSend }: {
  notifications: Notif[];
  onSend: (text: string, type: string) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [type, setType] = useState("task");
  const [loading, setLoading] = useState(false);
  const typeOpts = [
    { value: "task", label: "Задание", icon: "ClipboardList" },
    { value: "theory", label: "Теория", icon: "BookOpen" },
    { value: "lecture", label: "Лекция", icon: "Video" },
    { value: "practice", label: "Практика", icon: "PenLine" },
  ];
  const typeColors: Record<string, string> = { task: "from-rose-500 to-pink-500", theory: "from-violet-500 to-purple-600", lecture: "from-cyan-500 to-blue-500", practice: "from-orange-500 to-amber-500" };

  async function handleSend() {
    if (!text.trim()) return;
    setLoading(true);
    await onSend(text.trim(), type);
    setLoading(false);
    setText("");
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
        <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center"><Icon name="Bell" size={14} className="text-white" /></div>
          Отправить уведомление
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Тип</label>
            <div className="grid grid-cols-2 gap-2">
              {typeOpts.map(t => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${type === t.value ? "border-violet-400 bg-violet-50 text-violet-700" : "border-border text-foreground hover:border-violet-200"}`}>
                  <Icon name={t.icon} size={14} />{t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Текст *</label>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Например: Добавлена новая лекция" rows={2}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all resize-none" />
          </div>
          <button onClick={handleSend} disabled={!text.trim() || loading}
            className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon name="Send" size={15} />}
            Отправить ученикам
          </button>
        </div>
      </div>
      <div>
        <h3 className="font-heading font-bold text-foreground mb-3">История ({notifications.length})</h3>
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="bg-white rounded-2xl border border-border p-4 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${typeColors[n.type] || "from-violet-500 to-purple-600"} flex items-center justify-center flex-shrink-0`}>
                <Icon name={{ task:"ClipboardList", theory:"BookOpen", lecture:"Video", practice:"PenLine" }[n.type] || "Bell"} size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-tight">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── admin shell ────────────────────────────────────────────────

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [adminPage, setAdminPage] = useState<AdminPage>("dashboard");
  const [sections, setSections] = useState<Section[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, m, n] = await Promise.all([apiFetch("sections"), apiFetch("materials"), apiFetch("notifications")]);
    setSections(Array.isArray(s) ? s : []);
    setMaterials(Array.isArray(m) ? m : []);
    setNotifications(Array.isArray(n) ? n : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleDeleteMaterial(id: number) {
    await adminFetch("materials", { id: String(id) }, { method: "DELETE" });
    setMaterials(prev => prev.filter(m => m.id !== id));
  }

  async function handleDeleteSection(id: number) {
    const slug = sections.find(s => s.id === id)?.slug;
    await adminFetch("sections", { id: String(id) }, { method: "DELETE" });
    setSections(prev => prev.filter(s => s.id !== id));
    if (slug) setMaterials(prev => prev.filter(m => m.section !== slug));
  }

  async function handleSendNotification(text: string, type: string) {
    const data = await adminFetch("notifications", {}, { method: "POST", body: JSON.stringify({ text, type }) });
    if (data.id) setNotifications(prev => [data, ...prev]);
  }

  const adminNav = [
    { id: "dashboard" as AdminPage, label: "Обзор", icon: "LayoutDashboard" },
    { id: "materials" as AdminPage, label: "Материалы", icon: "BookOpen" },
    { id: "sections" as AdminPage, label: "Разделы", icon: "FolderOpen" },
    { id: "notifications" as AdminPage, label: "Рассылка", icon: "Bell" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border px-4 h-14 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg, #1e1b4b, #2e1065)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-sm">🎓</div>
          <span className="font-heading font-bold text-white text-sm hidden sm:block">EduSpace</span>
          <span className="text-white/30 text-sm hidden sm:block">/</span>
          <span className="font-semibold text-white/80 text-sm">{{ dashboard:"Обзор", materials:"Материалы", sections:"Разделы", notifications:"Рассылка" }[adminPage]}</span>
          <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">РЕПЕТИТОР</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors">
          <Icon name="LogOut" size={14} />Выйти
        </button>
      </header>

      <main className="pb-24 px-4 pt-5 max-w-lg mx-auto">
        {loading ? <Spinner /> : (
          <>
            {adminPage === "dashboard" && <AdminDashboard sections={sections} materials={materials} notifications={notifications} />}
            {adminPage === "materials" && <AdminMaterials sections={sections} materials={materials} onAdd={m => setMaterials(prev => [m, ...prev])} onDelete={handleDeleteMaterial} />}
            {adminPage === "sections" && <AdminSections sections={sections} onAdd={s => setSections(prev => [...prev, s])} onDelete={handleDeleteSection} />}
            {adminPage === "notifications" && <AdminNotifications notifications={notifications} onSend={handleSendNotification} />}
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border"
        style={{ background: "rgba(30,27,75,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="flex max-w-lg mx-auto">
          {adminNav.map(item => {
            const active = adminPage === item.id;
            return (
              <button key={item.id} onClick={() => setAdminPage(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative">
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-brand" />}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? "gradient-brand" : "hover:bg-white/10"}`}>
                  <Icon name={item.icon} size={16} className={active ? "text-white" : "text-white/50"} />
                </div>
                <span className={`text-[10px] font-semibold ${active ? "text-white" : "text-white/40"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ── login ──────────────────────────────────────────────────────

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
            style={{ width: `${120 + i * 100}px`, height: `${120 + i * 100}px`, background: `radial-gradient(circle, ${["rgba(124,58,237,0.15)","rgba(6,182,212,0.12)","rgba(236,72,153,0.10)","rgba(245,158,11,0.10)","rgba(16,185,129,0.10)"][i]}, transparent)`, left: `${[15,70,35,80,10][i]}%`, top: `${[25,15,65,55,75][i]}%`, transform: "translate(-50%,-50%)", filter: "blur(20px)" }} />
        ))}
      </div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-3xl gradient-brand flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30"><span className="text-3xl">🎓</span></div>
          <h1 className="font-heading font-black text-white text-3xl mb-1">EduSpace</h1>
          <p className="text-white/40 text-sm">Платформа для учеников репетитора</p>
        </div>
        <div className="rounded-3xl p-6" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <h2 className="font-heading font-bold text-white text-lg mb-1">Вход в систему</h2>
          <p className="text-white/40 text-sm mb-5">Введите пароль, выданный репетитором</p>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Введите пароль"
            className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm mb-3 focus:outline-none focus:ring-2 transition-all ${error ? "border border-rose-400 bg-rose-500/10 focus:ring-rose-400" : "bg-white/10 border border-white/20 focus:ring-violet-400"}`} />
          {error && <p className="text-rose-400 text-xs mb-3 flex items-center gap-1.5"><Icon name="AlertCircle" size={13} />Неверный пароль</p>}
          <button onClick={handleLogin} className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg">Войти</button>
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

// ── student shell ──────────────────────────────────────────────

function StudentApp({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<Page>("home");
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiFetch("sections"), apiFetch("materials"), apiFetch("notifications")]).then(([s, m, n]) => {
      setSections(Array.isArray(s) ? s : []);
      setMaterials(Array.isArray(m) ? m : []);
      setNotifications(Array.isArray(n) ? n : []);
      setLoading(false);
    });
  }, []);

  const navSections = sections.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-sm">🎓</div>
          <span className="font-heading font-bold text-foreground text-sm">
            {showProfile ? "Профиль" : page === "section" && currentSection ? currentSection.label : "EduSpace"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
              <Icon name="Bell" size={18} className="text-foreground" />
              {notifications.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifications.length}</span>}
            </button>
            {showNotifications && <NotificationsPanel notifications={notifications} onClose={() => setShowNotifications(false)} onMarkAll={() => setNotifications([])} />}
          </div>
          <button onClick={() => { setShowProfile(!showProfile); setPage("home"); }}
            className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-sm">👨‍🎓</button>
        </div>
      </header>

      <main className="pb-24 px-4 pt-5 max-w-lg mx-auto">
        {loading ? <Spinner /> :
          showProfile ? <ProfilePage onLogout={onLogout} /> :
          page === "home" ? <HomePage sections={sections} materials={materials} setCurrentSection={setCurrentSection} setPage={setPage} /> :
          page === "section" && currentSection ? <SectionPage section={currentSection} materials={materials} /> : null
        }
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-border">
        <div className="flex max-w-lg mx-auto">
          <button onClick={() => { setPage("home"); setShowProfile(false); }}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative">
            {page === "home" && !showProfile && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-brand" />}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${page === "home" && !showProfile ? "gradient-brand" : "hover:bg-muted"}`}>
              <Icon name="Home" size={16} className={page === "home" && !showProfile ? "text-white" : "text-muted-foreground"} />
            </div>
            <span className={`text-[10px] font-semibold ${page === "home" && !showProfile ? "text-violet-600" : "text-muted-foreground"}`}>Главная</span>
          </button>
          {navSections.map(s => {
            const active = page === "section" && currentSection?.slug === s.slug && !showProfile;
            return (
              <button key={s.slug} onClick={() => { setCurrentSection(s); setPage("section"); setShowProfile(false); }}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative">
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-brand" />}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? "gradient-brand" : "hover:bg-muted"}`}>
                  <Icon name={s.icon} size={16} className={active ? "text-white" : "text-muted-foreground"} />
                </div>
                <span className={`text-[10px] font-semibold truncate max-w-[50px] ${active ? "text-violet-600" : "text-muted-foreground"}`}>{s.label}</span>
              </button>
            );
          })}
          <button onClick={() => setShowProfile(true)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative">
            {showProfile && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-brand" />}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showProfile ? "gradient-brand" : "hover:bg-muted"}`}>
              <Icon name="User" size={16} className={showProfile ? "text-white" : "text-muted-foreground"} />
            </div>
            <span className={`text-[10px] font-semibold ${showProfile ? "text-violet-600" : "text-muted-foreground"}`}>Профиль</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// ── root ───────────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState<Role>("none");
  if (role === "none") return <LoginScreen onLogin={setRole} />;
  if (role === "admin") return <AdminPanel onLogout={() => setRole("none")} />;
  return <StudentApp onLogout={() => setRole("none")} />;
}
