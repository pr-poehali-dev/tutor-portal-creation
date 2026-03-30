import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "theory" | "practice" | "lectures" | "tasks" | "profile";

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
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, text: "Новое задание: Квадратные уравнения", time: "2 мин назад", read: false, type: "task" },
  { id: 2, text: "Добавлена лекция по тригонометрии", time: "1 час назад", read: false, type: "lecture" },
  { id: 3, text: "Новая теория: Производные", time: "Вчера", read: true, type: "theory" },
  { id: 4, text: "Практическое задание обновлено", time: "2 дня назад", read: true, type: "practice" },
];

const THEORY_MATERIALS: Material[] = [
  { id: 1, title: "Производные функций", desc: "Основные правила дифференцирования, формулы производных", date: "28 марта", tag: "Алгебра", color: "from-violet-500 to-purple-600", icon: "BookOpen" },
  { id: 2, title: "Тригонометрия", desc: "Тригонометрические функции, формулы приведения", date: "25 марта", tag: "Геометрия", color: "from-cyan-500 to-blue-500", icon: "BookOpen" },
  { id: 3, title: "Интегралы", desc: "Неопределённый и определённый интеграл, методы интегрирования", date: "20 марта", tag: "Анализ", color: "from-pink-500 to-rose-500", icon: "BookOpen" },
];

const PRACTICE_MATERIALS: Material[] = [
  { id: 1, title: "Практика: Производные", desc: "10 задач на нахождение производной", date: "29 марта", tag: "Средний", color: "from-orange-500 to-amber-500", icon: "PenLine" },
  { id: 2, title: "Практика: Тригонометрия", desc: "Решение тригонометрических уравнений", date: "26 марта", tag: "Сложный", color: "from-violet-500 to-indigo-600", icon: "PenLine" },
  { id: 3, title: "Контрольная работа №3", desc: "Тема: Предел функции и непрерывность", date: "18 марта", tag: "Контроль", color: "from-green-500 to-emerald-500", icon: "PenLine" },
];

const LECTURE_MATERIALS: Material[] = [
  { id: 1, title: "Лекция №8: Тригонометрия", desc: "Видеозапись урока, 1:24:00", date: "28 марта", tag: "Видео", color: "from-cyan-500 to-teal-500", icon: "Video" },
  { id: 2, title: "Лекция №7: Производные", desc: "Видеозапись урока, 1:15:00", date: "21 марта", tag: "Видео", color: "from-pink-500 to-fuchsia-600", icon: "Video" },
  { id: 3, title: "Лекция №6: Пределы", desc: "Видеозапись урока, 1:32:00", date: "14 марта", tag: "Видео", color: "from-amber-500 to-orange-500", icon: "Video" },
];

const TASKS: Material[] = [
  { id: 1, title: "ДЗ: Квадратные уравнения", desc: "Решить задачи 1–15, срок до 2 апреля", date: "30 марта", tag: "Срочно", color: "from-rose-500 to-pink-500", icon: "ClipboardList" },
  { id: 2, title: "ДЗ: Производные", desc: "Задачи из учебника §12, №1–10", date: "25 марта", tag: "Сдано", color: "from-green-500 to-emerald-500", icon: "ClipboardList" },
  { id: 3, title: "ДЗ: Тригонометрия", desc: "Формулы сложения, задачи на применение", date: "18 марта", tag: "Проверено", color: "from-violet-500 to-purple-600", icon: "ClipboardList" },
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

function MaterialCard({ m }: { m: Material }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border card-hover cursor-pointer animate-fade-in">
      <div className={`h-1.5 bg-gradient-to-r ${m.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center flex-shrink-0`}>
            <Icon name={m.icon} size={18} className="text-white" />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[m.tag] || "bg-muted text-muted-foreground"}`}>
            {m.tag}
          </span>
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

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const sections = [
    { page: "theory" as Page, label: "Теория", icon: "BookOpen", color: "from-violet-500 to-purple-600", count: 12, desc: "Конспекты и материалы" },
    { page: "practice" as Page, label: "Практика", icon: "PenLine", color: "from-cyan-500 to-blue-500", count: 8, desc: "Задачи для отработки" },
    { page: "lectures" as Page, label: "Лекции", icon: "Video", color: "from-pink-500 to-rose-500", count: 8, desc: "Записи занятий" },
    { page: "tasks" as Page, label: "Задания", icon: "ClipboardList", color: "from-orange-500 to-amber-500", count: 5, desc: "Домашние задания" },
  ];

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
          { label: "Материалов", value: "28", icon: "BookOpen", color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Заданий", value: "5", icon: "ClipboardList", color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Лекций", value: "8", icon: "Video", color: "text-cyan-500", bg: "bg-cyan-50" },
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
            <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
            <div className="text-xs font-semibold text-violet-600 mt-2">{s.count} материалов →</div>
          </button>
        ))}
      </div>

      <h2 className="font-heading font-bold text-lg text-foreground mb-3">Последние материалы</h2>
      <div className="space-y-3">
        {[THEORY_MATERIALS[0], TASKS[0]].map(m => (
          <MaterialCard key={m.id + m.title} m={m} />
        ))}
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
      <div className="space-y-3">
        {materials.map(m => <MaterialCard key={m.id} m={m} />)}
      </div>
    </div>
  );
}

function ProfilePage() {
  const stats = [
    { label: "Занятий", value: "24" },
    { label: "Сдано ДЗ", value: "18" },
    { label: "Изучено", value: "31" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="relative rounded-3xl overflow-hidden mb-6"
        style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)" }}>
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-3 text-4xl border-2 border-white/30">
            👨‍🎓
          </div>
          <h2 className="font-heading font-bold text-white text-xl">Иван Петров</h2>
          <p className="text-white/50 text-sm mt-0.5">ivan@example.com</p>
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white/70 text-xs px-3 py-1.5 rounded-full mt-3">
            <Icon name="GraduationCap" size={12} />
            Ученик с октября 2024
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(s => (
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
        {[
          { icon: "User", label: "Редактировать профиль" },
          { icon: "Bell", label: "Уведомления" },
          { icon: "Lock", label: "Сменить пароль" },
          { icon: "HelpCircle", label: "Помощь" },
        ].map(item => (
          <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Icon name={item.icon} size={15} className="text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground flex-1 text-left">{item.label}</span>
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          </button>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-semibold text-sm py-3.5 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors">
        <Icon name="LogOut" size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
}

function NotificationsPanel({ notifications, onClose }: {
  notifications: Notification[];
  onClose: () => void;
}) {
  const typeIcons: Record<string, string> = {
    task: "ClipboardList",
    theory: "BookOpen",
    lecture: "Video",
    practice: "PenLine",
  };
  const typeColors: Record<string, string> = {
    task: "from-rose-500 to-pink-500",
    theory: "from-violet-500 to-purple-600",
    lecture: "from-cyan-500 to-blue-500",
    practice: "from-orange-500 to-amber-500",
  };

  return (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 animate-scale-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-heading font-bold text-foreground text-sm">Уведомления</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
          <Icon name="X" size={14} className="text-muted-foreground" />
        </button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.map(n => (
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
        ))}
      </div>
      <div className="p-3">
        <button className="w-full text-center text-sm text-violet-600 font-semibold py-2 hover:bg-violet-50 rounded-xl transition-colors">
          Отметить все как прочитанные
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  function handleLogin() {
    if (loginPassword === "1234") {
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1e1048 40%, #0e2040 100%)" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: `${120 + i * 100}px`,
                height: `${120 + i * 100}px`,
                background: `radial-gradient(circle, ${["rgba(124,58,237,0.15)", "rgba(6,182,212,0.12)", "rgba(236,72,153,0.10)", "rgba(245,158,11,0.10)", "rgba(16,185,129,0.10)"][i]}, transparent)`,
                left: `${[15, 70, 35, 80, 10][i]}%`,
                top: `${[25, 15, 65, 55, 75][i]}%`,
                transform: "translate(-50%, -50%)",
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
          <div className="bg-white/8 backdrop-blur-xl border border-white/15 rounded-3xl p-6">
            <h2 className="font-heading font-bold text-white text-lg mb-1">Вход в систему</h2>
            <p className="text-white/40 text-sm mb-5">Введите пароль, выданный репетитором</p>
            <input
              type="password"
              value={loginPassword}
              onChange={e => { setLoginPassword(e.target.value); setLoginError(false); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Введите пароль"
              className={`w-full rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm mb-3 focus:outline-none focus:ring-2 transition-all ${loginError ? "border border-rose-400 bg-rose-500/10 focus:ring-rose-400" : "bg-white/10 border border-white/20 focus:ring-violet-400"}`}
            />
            {loginError && (
              <p className="text-rose-400 text-xs mb-3 flex items-center gap-1.5">
                <Icon name="AlertCircle" size={13} />
                Неверный пароль. Попробуйте ещё раз
              </p>
            )}
            <button onClick={handleLogin}
              className="w-full gradient-brand text-white font-semibold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/30">
              Войти
            </button>
            <p className="text-center text-white/25 text-xs mt-4">Пароль для демо: 1234</p>
          </div>
        </div>
      </div>
    );
  }

  const pageContent: Record<Page, React.ReactNode> = {
    home: <HomePage setPage={setPage} />,
    theory: <ListPage title="Теория" subtitle="Конспекты и учебные материалы" gradient="from-violet-500 to-purple-600" materials={THEORY_MATERIALS} />,
    practice: <ListPage title="Практика" subtitle="Задачи и упражнения для отработки" gradient="from-cyan-500 to-blue-500" materials={PRACTICE_MATERIALS} />,
    lectures: <ListPage title="Лекции" subtitle="Записи занятий и видеоматериалы" gradient="from-pink-500 to-rose-500" materials={LECTURE_MATERIALS} />,
    tasks: <ListPage title="Задания" subtitle="Домашние задания и контрольные работы" gradient="from-orange-500 to-amber-500" materials={TASKS} />,
    profile: <ProfilePage />,
  };

  const pageTitles: Record<Page, string> = {
    home: "Главная",
    theory: "Теория",
    practice: "Практика",
    lectures: "Лекции",
    tasks: "Задания",
    profile: "Профиль",
  };

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
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <NotificationsPanel
                notifications={NOTIFICATIONS}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>
          <button onClick={() => setPage("profile")}
            className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center text-sm">
            👨‍🎓
          </button>
        </div>
      </header>

      <main className="pb-24 px-4 pt-5 max-w-lg mx-auto">
        {pageContent[page]}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-border">
        <div className="flex max-w-lg mx-auto">
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)}
                className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all relative">
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full gradient-brand" />
                )}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? "gradient-brand" : "hover:bg-muted"}`}>
                  <Icon
                    name={item.icon}
                    size={16}
                    className={active ? "text-white" : "text-muted-foreground"}
                  />
                </div>
                <span className={`text-[10px] font-semibold transition-colors ${active ? "text-violet-600" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
