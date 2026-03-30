import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "theory" | "practice" | "lectures" | "tasks" | "profile";
type AdminPage = "dashboard" | "materials" | "notifications" | "students";
type Role = "none" | "student" | "admin";

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
  type: "task" | "theory" | "lecture" | "practice";
}

interface Material {
  id: number;
  title: string;
  desc: string;
  date: string;
  tag: string;
  color: string;
  icon: string;
  section: "theory" | "practice" | "lectures" | "tasks";
}

const TODAY = "30 марта";

const INIT_NOTIFICATIONS: Notification[] = [
  { id: 1, text: "Новое задание: Квадратные уравнения", time: "2 мин назад", read: false, type: "task" },
  { id: 2, text: "Добавлена лекция по тригонометрии", time: "1 час назад", read: false, type: "lecture" },
  { id: 3, text: "Новая теория: Производные", time: "Вчера", read: true, type: "theory" },
  { id: 4, text: "Практическое задание обновлено", time: "2 дня назад", read: true, type: "practice" },
];

const INIT_MATERIALS: Material[] = [
  { id: 1, title: "Производные функций", desc: "Основные правила дифференцирования, формулы производных", date: "28 марта", tag: "Алгебра", color: "from-violet-500 to-purple-600", icon: "BookOpen", section: "theory" },
  { id: 2, title: "Тригонометрия", desc: "Тригонометрические функции, формулы приведения", date: "25 марта", tag: "Геометрия", color: "from-cyan-500 to-blue-500", icon: "BookOpen", section: "theory" },
  { id: 3, title: "Интегралы", desc: "Неопределённый и определённый интеграл, методы интегрирования", date: "20 марта", tag: "Анализ", color: "from-pink-500 to-rose-500", icon: "BookOpen", section: "theory" },
  { id: 4, title: "Практика: Производные", desc: "10 задач на нахождение производной", date: "29 марта", tag: "Средний", color: "from-orange-500 to-amber-500", icon: "PenLine", section: "practice" },
  { id: 5, title: "Практика: Тригонометрия", desc: "Решение тригонометрических уравнений", date: "26 марта", tag: "Сложный", color: "from-violet-500 to-indigo-600", icon: "PenLine", section: "practice" },
  { id: 6, title: "Контрольная работа №3", desc: "Тема: Предел функции и непрерывность", date: "18 марта", tag: "Контроль", color: "from-green-500 to-emerald-500", icon: "PenLine", section: "practice" },
  { id: 7, title: "Лекция №8: Тригонометрия", desc: "Видеозапись урока, 1:24:00", date: "28 марта", tag: "Видео", color: "from-cyan-500 to-teal-500", icon: "Video", section: "lectures" },
  { id: 8, title: "Лекция №7: Производные", desc: "Видеозапись урока, 1:15:00", date: "21 марта", tag: "Видео", color: "from-pink-500 to-fuchsia-600", icon: "Video", section: "lectures" },
  { id: 9, title: "Лекция №6: Пределы", desc: "Видеозапись урока, 1:32:00", date: "14 марта", tag: "Видео", color: "from-amber-500 to-orange-500", icon: "Video", section: "lectures" },
  { id: 10, title: "ДЗ: Квадратные уравнения", desc: "Решить задачи 1–15, срок до 2 апреля", date: "30 марта", tag: "Срочно", color: "from-rose-500 to-pink-500", icon: "ClipboardList", section: "tasks" },
  { id: 11, title: "ДЗ: Производные", desc: "Задачи из учебника §12, №1–10", date: "25 марта", tag: "Сдано", color: "from-green-500 to-emerald-500", icon: "ClipboardList", section: "tasks" },
  { id: 12, title: "ДЗ: Тригонометрия", desc: "Формулы сложения, задачи на применение", date: "18 марта", tag: "Проверено", color: "from-violet-500 to-purple-600", icon: "ClipboardList", section: "tasks" },
];

const navItems = [
  { id: "home" as Page, label: "Главная", icon: "Home" },
  { id: "theory" as Page, label: "Теория", icon: "BookOpen" },
  { id: "practice" as Page, label: "Практика", icon: "PenLine" },
  { id: "lectures" as Page, label: "Лекции", icon: "Video" },
  { id: "tasks" as Page, label: "Задания", icon: "ClipboardList" },
  { id: "profile" as Page, label: "Профиль", icon: "User" },
];

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
};

const sectionMeta = {
  theory:   { label: "Теория",   icon: "BookOpen",     color: "from-violet-500 to-purple-600" },
  practice: { label: "Практика", icon: "PenLine",      color: "from-cyan-500 to-blue-500" },
  lectures: { label: "Лекции",   icon: "Video",        color: "from-pink-500 to-rose-500" },
  tasks:    { label: "Задания",  icon: "ClipboardList", color: "from-orange-500 to-amber-500" },
};

// ───── shared components ─────────────────────────────────────

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
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[m.tag] || "bg-muted text-muted-foreground"}`}>
              {m.tag}
            </span>
            {onDelete && (
              <button onClick={() => onDelete(m.id)}
                className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors">
                <Icon name="Trash2" size={13} className="text-rose-500" />
              </button>
            )}
          </div>
        </div>
        <h3 className="font-heading font-bold text-foreground mb-1 text-base leading-tight">{m.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{m.desc}</p>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="Calendar" size={12} />
          {m.date}
        </div>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, gradient }: { title: string; subtitle: string; gradient: string }) {
  return (
    <div className={`rounded-2xl p-6 bg-gradient-to-r ${gradient} text-white mb-6`}>
      <h1 className="font-heading font-bold text-2xl mb-1">{title}</h1>
      <p className="text-white/80 text-sm">{subtitle}</p>
    </div>
  );
}

// ───── student pages ─────────────────────────────────────────

function HomePage({ setPage, materials }: { setPage: (p: Page) => void; materials: Material[] }) {
  const sections = [
    { page: "theory" as Page,   ...sectionMeta.theory,   count: materials.filter(m => m.section === "theory").length },
    { page: "practice" as Page, ...sectionMeta.practice, count: materials.filter(m => m.section === "practice").length },
    { page: "lectures" as Page, ...sectionMeta.lectures, count: materials.filter(m => m.section === "lectures").length },
    { page: "tasks" as Page,    ...sectionMeta.tasks,    count: materials.filter(m => m.section === "tasks").length },
  ];
  const recent = materials.slice(-2).reverse();

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
          <h1 className="font-heading font-black text-white text-2xl leading-tight mb-2">
            Учись умнее,<br />достигай большего
          </h1>
          <p className="text-white/70 text-sm mb-5">Все материалы и задания в одном месте</p>
          <div className="flex gap-3">
            <button onClick={() => setPage("tasks")}
              className="bg-white text-violet-700 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors">
              Мои задания
            </button>
            <button onClick={() => setPage("lectures")}
              className="bg-white/20 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
              Лекции
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Материалов", value: String(materials.length), icon: "BookOpen", color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Заданий", value: String(sections[3].count), icon: "ClipboardList", color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Лекций", value: String(sections[2].count), icon: "Video", color: "text-cyan-500", bg: "bg-cyan-50" },
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
          <button key={s.page} onClick={() => setPage(s.page)}
            className="bg-white rounded-2xl p-4 text-left border border-border shadow-sm card-hover">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <Icon name={s.icon} size={18} className="text-white" />
            </div>
            <div className="font-heading font-bold text-foreground text-sm">{s.label}</div>
            <div className="text-xs font-semibold text-violet-600 mt-2">{s.count} материалов →</div>
          </button>
        ))}
      </div>

      <h2 className="font-heading font-bold text-lg text-foreground mb-3">Последние материалы</h2>
      <div className="space-y-3">
        {recent.map(m => <MaterialCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function ListPage({ title, subtitle, gradient, materials }: {
  title: string; subtitle: string; gradient: string; materials: Material[];
}) {
  return (
    <div className="animate-fade-in">
      <PageHeader title={title} subtitle={subtitle} gradient={gradient} />
      {materials.length === 0
        ? <div className="text-center py-16 text-muted-foreground text-sm">Материалов пока нет</div>
        : <div className="space-y-3">{materials.map(m => <MaterialCard key={m.id} m={m} />)}</div>
      }
    </div>
  );
}

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
            <Icon name="GraduationCap" size={12} />
            Ученик с октября 2024
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[{ label: "Занятий", value: "24" }, { label: "Сдано ДЗ", value: "18" }, { label: "Изучено", value: "31" }].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-border shadow-sm">
            <div className="font-heading font-black text-2xl gradient-text">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
        <div className="px-4 py-3.5 border-b border-border">
          <h3 className="font-heading font-bold text-foreground text-sm">Настройки аккаунта</h3>
        </div>
        {[{ icon: "User", label: "Редактировать профиль" }, { icon: "Bell", label: "Уведомления" }, { icon: "Lock", label: "Сменить пароль" }, { icon: "HelpCircle", label: "Помощь" }].map(item => (
          <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Icon name={item.icon} size={15} className="text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground flex-1 text-left">{item.label}</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-semibold text-sm py-3.5 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors">
        <Icon name="LogOut" size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
}

function NotificationsPanel({ notifications, onClose, onMarkAll }: {
  notifications: Notification[];
  onClose: () => void;
  onMarkAll: () => void;
}) {
  const typeIcons: Record<string, string> = { task: "ClipboardList", theory: "BookOpen", lecture: "Video", practice: "PenLine" };
  const typeColors: Record<string, string> = { task: "from-rose-500 to-pink-500", theory: "from-violet-500 to-purple-600", lecture: "from-cyan-500 to-blue-500", practice: "from-orange-500 to-amber-500" };
  return (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 animate-scale-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-heading font-bold text-foreground text-sm">Уведомления</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <Icon name="X" size={14} className="text-muted-foreground" />
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0
          ? <div className="text-center py-8 text-sm text-muted-foreground">Нет уведомлений</div>
          : notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 ${!n.read ? "bg-violet-50/60" : ""}`}>
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${typeColors[n.type]} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon name={typeIcons[n.type]} size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-tight">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />}
            </div>
          ))
        }
      </div>
      <div className="p-3">
        <button onClick={onMarkAll} className="w-full text-center text-sm text-violet-600 font-semibold py-2 hover:bg-violet-50 rounded-xl transition-colors">
          Отметить все как прочитанные
        </button>
      </div>
    </div>
  );
}

// ───── admin panel ────────────────────────────────────────────

const SECTION_OPTIONS = [
  { value: "theory", label: "Теория", icon: "BookOpen" },
  { value: "practice", label: "Практика", icon: "PenLine" },
  { value: "lectures", label: "Лекции", icon: "Video" },
  { value: "tasks", label: "Задания", icon: "ClipboardList" },
] as const;

const COLOR_OPTIONS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-orange-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-cyan-500 to-teal-500",
  "from-pink-500 to-fuchsia-600",
  "from-rose-500 to-pink-500",
];

const COLOR_PREVIEWS: Record<string, string> = {
  "from-violet-500 to-purple-600": "#7c3aed",
  "from-cyan-500 to-blue-500":     "#06b6d4",
  "from-pink-500 to-rose-500":     "#ec4899",
  "from-orange-500 to-amber-500":  "#f97316",
  "from-green-500 to-emerald-500": "#22c55e",
  "from-cyan-500 to-teal-500":     "#14b8a6",
  "from-pink-500 to-fuchsia-600":  "#d946ef",
  "from-rose-500 to-pink-500":     "#f43f5e",
};

function AddMaterialForm({ onAdd }: { onAdd: (m: Omit<Material, "id">) => void }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("");
  const [section, setSection] = useState<Material["section"]>("theory");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [notify, setNotify] = useState(true);

  const sectionIconMap: Record<Material["section"], string> = { theory: "BookOpen", practice: "PenLine", lectures: "Video", tasks: "ClipboardList" };

  function handleSubmit() {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), desc: desc.trim(), tag: tag.trim() || sectionMeta[section].label, date: TODAY, color, icon: sectionIconMap[section], section, });
    setTitle(""); setDesc(""); setTag("");
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm p-5 animate-fade-in">
      <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
          <Icon name="Plus" size={14} className="text-white" />
        </div>
        Добавить материал
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Раздел</label>
          <div className="grid grid-cols-2 gap-2">
            {SECTION_OPTIONS.map(s => (
              <button key={s.value} onClick={() => setSection(s.value)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${section === s.value ? "border-violet-400 bg-violet-50 text-violet-700" : "border-border bg-background text-foreground hover:border-violet-200"}`}>
                <Icon name={s.icon} size={14} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Название *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Лекция №9: Комплексные числа"
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Описание</label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Краткое описание содержания..." rows={2}
            className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Метка</label>
            <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Например: Видео"
              className="w-full bg-muted/50 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Цвет карточки</label>
            <div className="flex gap-1.5 flex-wrap">
              {COLOR_OPTIONS.map(c => (
                <button key={c} onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-lg transition-all ${color === c ? "ring-2 ring-offset-1 ring-violet-500 scale-110" : "hover:scale-105"}`}
                  style={{ background: COLOR_PREVIEWS[c] }} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
          <button onClick={() => setNotify(!notify)}
            className={`w-10 h-6 rounded-full transition-all flex items-center ${notify ? "bg-violet-500" : "bg-muted-foreground/30"}`}>
            <span className={`w-5 h-5 bg-white rounded-full shadow transition-all ${notify ? "ml-[18px]" : "ml-0.5"}`} />
          </button>
          <div>
            <p className="text-sm font-semibold text-foreground">Уведомить учеников</p>
            <p className="text-xs text-muted-foreground">Отправить пуш всем ученикам</p>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!title.trim()}
          className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
          Добавить материал
        </button>
      </div>
    </div>
  );
}

function AdminDashboard({ materials, notifications }: { materials: Material[]; notifications: Notification[] }) {
  const stats = [
    { label: "Материалов", value: materials.length, icon: "BookOpen", color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Уведомлений", value: notifications.length, icon: "Bell", color: "text-rose-500", bg: "bg-rose-50" },
    { label: "Разделов", value: 4, icon: "LayoutGrid", color: "text-cyan-500", bg: "bg-cyan-50" },
  ];
  return (
    <div className="animate-fade-in space-y-5">
      <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #1e1b4b, #4c1d95)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">👩‍🏫</div>
          <div>
            <p className="text-white/60 text-xs">Панель управления</p>
            <h2 className="font-heading font-bold text-white">Репетитор</h2>
          </div>
        </div>
        <p className="text-white/60 text-sm">Управляйте материалами, заданиями и уведомлениями для учеников</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
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
        {SECTION_OPTIONS.map(s => {
          const cnt = materials.filter(m => m.section === s.value).length;
          const pct = materials.length > 0 ? (cnt / materials.length) * 100 : 0;
          return (
            <div key={s.value} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${sectionMeta[s.value].color} flex items-center justify-center flex-shrink-0`}>
                <Icon name={s.icon} size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <span className="text-xs font-bold text-violet-600">{cnt}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${sectionMeta[s.value].color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminMaterials({ materials, onAdd, onDelete }: {
  materials: Material[];
  onAdd: (m: Omit<Material, "id">) => void;
  onDelete: (id: number) => void;
}) {
  const [activeSection, setActiveSection] = useState<Material["section"]>("theory");
  const filtered = materials.filter(m => m.section === activeSection);
  return (
    <div className="animate-fade-in space-y-4">
      <AddMaterialForm onAdd={onAdd} />
      <div>
        <h3 className="font-heading font-bold text-foreground mb-3">Все материалы</h3>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {SECTION_OPTIONS.map(s => (
            <button key={s.value} onClick={() => setActiveSection(s.value)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${activeSection === s.value ? "gradient-brand text-white" : "bg-white border border-border text-muted-foreground hover:border-violet-300"}`}>
              {s.label} ({materials.filter(m => m.section === s.value).length})
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

function AdminNotifications({ notifications, onSend }: {
  notifications: Notification[];
  onSend: (text: string, type: Notification["type"]) => void;
}) {
  const [text, setText] = useState("");
  const [type, setType] = useState<Notification["type"]>("task");
  const typeOptions: { value: Notification["type"]; label: string; icon: string }[] = [
    { value: "task", label: "Задание", icon: "ClipboardList" },
    { value: "theory", label: "Теория", icon: "BookOpen" },
    { value: "lecture", label: "Лекция", icon: "Video" },
    { value: "practice", label: "Практика", icon: "PenLine" },
  ];
  const typeColors: Record<string, string> = { task: "from-rose-500 to-pink-500", theory: "from-violet-500 to-purple-600", lecture: "from-cyan-500 to-blue-500", practice: "from-orange-500 to-amber-500" };

  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
        <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
            <Icon name="Bell" size={14} className="text-white" />
          </div>
          Отправить уведомление
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Тип</label>
            <div className="grid grid-cols-2 gap-2">
              {typeOptions.map(t => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${type === t.value ? "border-violet-400 bg-violet-50 text-violet-700" : "border-border bg-background text-foreground hover:border-violet-200"}`}>
                  <Icon name={t.icon} size={14} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Текст уведомления *</label>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Например: Добавлена новая лекция по алгебре" rows={2}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all resize-none" />
          </div>
          <button onClick={() => { if (text.trim()) { onSend(text.trim(), type); setText(""); } }}
            disabled={!text.trim()}
            className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Icon name="Send" size={15} />
            Отправить ученикам
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-foreground mb-3">История уведомлений</h3>
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className="bg-white rounded-2xl border border-border p-4 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${typeColors[n.type]} flex items-center justify-center flex-shrink-0`}>
                <Icon name={{ task: "ClipboardList", theory: "BookOpen", lecture: "Video", practice: "PenLine" }[n.type]} size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-tight">{n.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
              </div>
              {!n.read && <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full flex-shrink-0">Новое</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onLogout, materials, notifications, onAddMaterial, onDeleteMaterial, onSendNotification }: {
  onLogout: () => void;
  materials: Material[];
  notifications: Notification[];
  onAddMaterial: (m: Omit<Material, "id">) => void;
  onDeleteMaterial: (id: number) => void;
  onSendNotification: (text: string, type: Notification["type"]) => void;
}) {
  const [adminPage, setAdminPage] = useState<AdminPage>("dashboard");
  const adminNav: { id: AdminPage; label: string; icon: string }[] = [
    { id: "dashboard", label: "Обзор", icon: "LayoutDashboard" },
    { id: "materials", label: "Материалы", icon: "FolderOpen" },
    { id: "notifications", label: "Уведомления", icon: "Bell" },
  ];
  const pageTitles: Record<AdminPage, string> = { dashboard: "Обзор", materials: "Материалы", notifications: "Уведомления", students: "Ученики" };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border px-4 h-14 flex items-center justify-between"
        style={{ background: "linear-gradient(90deg, #1e1b4b, #2e1065)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-sm">🎓</div>
          <span className="font-heading font-bold text-white text-sm">EduSpace</span>
          <span className="text-white/30 text-sm">/</span>
          <span className="font-semibold text-white/80 text-sm">{pageTitles[adminPage]}</span>
          <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full ml-1">РЕПЕТИТОР</span>
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors">
          <Icon name="LogOut" size={14} />
          Выйти
        </button>
      </header>

      <main className="pb-24 px-4 pt-5 max-w-lg mx-auto">
        {adminPage === "dashboard" && <AdminDashboard materials={materials} notifications={notifications} />}
        {adminPage === "materials" && <AdminMaterials materials={materials} onAdd={onAddMaterial} onDelete={onDeleteMaterial} />}
        {adminPage === "notifications" && <AdminNotifications notifications={notifications} onSend={onSendNotification} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border"
        style={{ background: "rgba(30,27,75,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="flex max-w-lg mx-auto">
          {adminNav.map(item => {
            const active = adminPage === item.id;
            return (
              <button key={item.id} onClick={() => setAdminPage(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all relative">
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-brand" />}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? "gradient-brand" : "hover:bg-white/10"}`}>
                  <Icon name={item.icon} size={16} className={active ? "text-white" : "text-white/50"} />
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${active ? "text-white" : "text-white/40"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// ───── login screen ───────────────────────────────────────────

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
            style={{ width: `${120 + i * 100}px`, height: `${120 + i * 100}px`, background: `radial-gradient(circle, ${["rgba(124,58,237,0.15)", "rgba(6,182,212,0.12)", "rgba(236,72,153,0.10)", "rgba(245,158,11,0.10)", "rgba(16,185,129,0.10)"][i]}, transparent)`, left: `${[15, 70, 35, 80, 10][i]}%`, top: `${[25, 15, 65, 55, 75][i]}%`, transform: "translate(-50%, -50%)", filter: "blur(20px)" }} />
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
          <input type="password" value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Введите пароль"
            className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm mb-3 focus:outline-none focus:ring-2 transition-all ${error ? "border border-rose-400 bg-rose-500/10 focus:ring-rose-400" : "bg-white/10 border border-white/20 focus:ring-violet-400"}`} />
          {error && (
            <p className="text-rose-400 text-xs mb-3 flex items-center gap-1.5">
              <Icon name="AlertCircle" size={13} />
              Неверный пароль. Попробуйте ещё раз
            </p>
          )}
          <button onClick={handleLogin}
            className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/30">
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

// ───── root ───────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState<Role>("none");
  const [page, setPage] = useState<Page>("home");
  const [showNotifications, setShowNotifications] = useState(false);
  const [materials, setMaterials] = useState<Material[]>(INIT_MATERIALS);
  const [notifications, setNotifications] = useState<Notification[]>(INIT_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  function handleLogin(r: Role) { setRole(r); }
  function handleLogout() { setRole("none"); setPage("home"); }

  function addMaterial(m: Omit<Material, "id">) {
    const newM: Material = { ...m, id: Date.now() };
    setMaterials(prev => [newM, ...prev]);
  }

  function deleteMaterial(id: number) {
    setMaterials(prev => prev.filter(m => m.id !== id));
  }

  function sendNotification(text: string, type: Notification["type"]) {
    const n: Notification = { id: Date.now(), text, time: "Только что", read: false, type };
    setNotifications(prev => [n, ...prev]);
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  if (role === "none") return <LoginScreen onLogin={handleLogin} />;

  if (role === "admin") {
    return (
      <AdminPanel
        onLogout={handleLogout}
        materials={materials}
        notifications={notifications}
        onAddMaterial={addMaterial}
        onDeleteMaterial={deleteMaterial}
        onSendNotification={sendNotification}
      />
    );
  }

  // student view
  const bySection = (s: Material["section"]) => materials.filter(m => m.section === s);
  const pageContent: Record<Page, React.ReactNode> = {
    home: <HomePage setPage={setPage} materials={materials} />,
    theory: <ListPage title="Теория" subtitle="Конспекты и учебные материалы" gradient="from-violet-500 to-purple-600" materials={bySection("theory")} />,
    practice: <ListPage title="Практика" subtitle="Задачи и упражнения для отработки" gradient="from-cyan-500 to-blue-500" materials={bySection("practice")} />,
    lectures: <ListPage title="Лекции" subtitle="Записи занятий и видеоматериалы" gradient="from-pink-500 to-rose-500" materials={bySection("lectures")} />,
    tasks: <ListPage title="Задания" subtitle="Домашние задания и контрольные работы" gradient="from-orange-500 to-amber-500" materials={bySection("tasks")} />,
    profile: <ProfilePage onLogout={handleLogout} />,
  };
  const pageTitles: Record<Page, string> = { home: "Главная", theory: "Теория", practice: "Практика", lectures: "Лекции", tasks: "Задания", profile: "Профиль" };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center text-sm">🎓</div>
          <span className="font-heading font-bold text-foreground text-sm hidden sm:block">EduSpace</span>
          <span className="text-muted-foreground text-sm hidden sm:block">/</span>
          <span className="font-semibold text-foreground text-sm">{pageTitles[page]}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)}
              className="relative w-9 h-9 rounded-xl hover:bg-muted flex items-center justify-center transition-colors">
              <Icon name="Bell" size={18} className="text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </button>
            {showNotifications && (
              <NotificationsPanel notifications={notifications} onClose={() => setShowNotifications(false)} onMarkAll={markAllRead} />
            )}
          </div>
          <button onClick={() => setPage("profile")} className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-sm">👨‍🎓</button>
        </div>
      </header>

      <main className="pb-24 px-4 pt-5 max-w-lg mx-auto">{pageContent[page]}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-border">
        <div className="flex max-w-lg mx-auto">
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all relative">
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-brand" />}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? "gradient-brand" : "hover:bg-muted"}`}>
                  <Icon name={item.icon} size={16} className={active ? "text-white" : "text-muted-foreground"} />
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${active ? "text-violet-600" : "text-muted-foreground"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
