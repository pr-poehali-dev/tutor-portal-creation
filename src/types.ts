export const API = "https://functions.poehali.dev/0fbe2e51-ab9d-4a51-a987-ac6fe46670fb";

export type Page = "home" | "section";
export type AdminPage = "dashboard" | "materials" | "sections" | "notifications";
export type Role = "none" | "student" | "admin";

export interface Section {
  id: number;
  slug: string;
  label: string;
  icon: string;
  color: string;
  sort_order: number;
}

export interface Material {
  id: number;
  title: string;
  desc: string;
  tag: string;
  color: string;
  icon: string;
  section: string;
  date: string;
}

export interface Notif {
  id: number;
  text: string;
  type: string;
  time: string;
}

export const tagColors: Record<string, string> = {
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

export const COLOR_OPTIONS = [
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

export const COLOR_HEX: Record<string, string> = {
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

export const ICON_OPTIONS = ["BookOpen","Video","ClipboardList","PenLine","FolderOpen","Star","Music","Globe","FileText","Zap","Award","Layers","Code","Calculator","Microscope","FlaskConical"];

export async function apiFetch(resource: string, params: Record<string,string> = {}, opts: RequestInit = {}) {
  const qs = new URLSearchParams({ resource, ...params }).toString();
  const res = await fetch(`${API}?${qs}`, opts);
  return res.json();
}

export function adminFetch(resource: string, params: Record<string,string> = {}, opts: RequestInit = {}) {
  return apiFetch(resource, params, {
    ...opts,
    headers: { "Content-Type": "application/json", "X-Admin-Token": "admin", ...((opts.headers as Record<string,string>) || {}) },
  });
}
