import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { MaterialCard, NotificationsPanel, Spinner } from "@/components/shared";
import { apiFetch, type Section, type Material, type Notif, type Page } from "@/types";

// ── HomePage ───────────────────────────────────────────────────

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
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/20">
              <span className="text-2xl">👨‍🎓</span>
            </div>
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

// ── SectionPage ────────────────────────────────────────────────

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

// ── ProfilePage ────────────────────────────────────────────────

function ProfilePage({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="animate-fade-in">
      <div className="relative rounded-3xl overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}>
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

// ── StudentApp shell ───────────────────────────────────────────

export default function StudentApp({ onLogout }: { onLogout: () => void }) {
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
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationsPanel
                notifications={notifications}
                onClose={() => setShowNotifications(false)}
                onMarkAll={() => setNotifications([])}
              />
            )}
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
