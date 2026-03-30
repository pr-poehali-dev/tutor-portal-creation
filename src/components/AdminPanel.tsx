import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { MaterialCard, Spinner } from "@/components/shared";
import {
  apiFetch, adminFetch,
  COLOR_OPTIONS, COLOR_HEX, ICON_OPTIONS,
  type AdminPage, type Section, type Material, type Notif,
} from "@/types";

// ── AddMaterialForm ────────────────────────────────────────────

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

// ── AddSectionForm ─────────────────────────────────────────────

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

// ── AdminDashboard ─────────────────────────────────────────────

function AdminDashboard({ sections, materials, notifications }: {
  sections: Section[]; materials: Material[]; notifications: Notif[];
}) {
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
            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <Icon name={s.icon} size={16} className={s.color} />
            </div>
            <div className="font-heading font-black text-xl text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border">
          <h3 className="font-heading font-bold text-foreground text-sm">Материалы по разделам</h3>
        </div>
        {sections.map(s => {
          const cnt = materials.filter(m => m.section === s.slug).length;
          const pct = materials.length > 0 ? (cnt / materials.length) * 100 : 0;
          return (
            <div key={s.slug} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={s.icon} size={14} className="text-white" />
              </div>
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

// ── AdminMaterials ─────────────────────────────────────────────

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

// ── AdminSections ──────────────────────────────────────────────

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

// ── AdminNotifications ─────────────────────────────────────────

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
  const typeColors: Record<string, string> = {
    task: "from-rose-500 to-pink-500",
    theory: "from-violet-500 to-purple-600",
    lecture: "from-cyan-500 to-blue-500",
    practice: "from-orange-500 to-amber-500",
  };

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

// ── AdminPanel shell ───────────────────────────────────────────

export default function AdminPanel({ onLogout }: { onLogout: () => void }) {
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

  const pageTitles: Record<AdminPage, string> = {
    dashboard: "Обзор",
    materials: "Материалы",
    sections: "Разделы",
    notifications: "Рассылка",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border px-4 h-14 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg, #1e1b4b, #2e1065)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-sm">🎓</div>
          <span className="font-heading font-bold text-white text-sm hidden sm:block">EduSpace</span>
          <span className="text-white/30 text-sm hidden sm:block">/</span>
          <span className="font-semibold text-white/80 text-sm">{pageTitles[adminPage]}</span>
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
