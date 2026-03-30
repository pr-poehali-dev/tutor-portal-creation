import Icon from "@/components/ui/icon";
import { tagColors, type Material, type Notif } from "@/types";

export function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
    </div>
  );
}

export function MaterialCard({ m, onDelete }: { m: Material; onDelete?: (id: number) => void }) {
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

export function NotificationsPanel({ notifications, onClose, onMarkAll }: {
  notifications: Notif[];
  onClose: () => void;
  onMarkAll: () => void;
}) {
  const typeColors: Record<string, string> = {
    task: "from-rose-500 to-pink-500",
    theory: "from-violet-500 to-purple-600",
    lecture: "from-cyan-500 to-blue-500",
    practice: "from-orange-500 to-amber-500",
  };
  const typeIcons: Record<string, string> = {
    task: "ClipboardList",
    theory: "BookOpen",
    lecture: "Video",
    practice: "PenLine",
  };

  return (
    <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-border z-50 animate-scale-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-heading font-bold text-foreground text-sm">Уведомления</h3>
        <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center">
          <Icon name="X" size={14} className="text-muted-foreground" />
        </button>
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
        <button onClick={onMarkAll} className="w-full text-center text-sm text-violet-600 font-semibold py-2 hover:bg-violet-50 rounded-xl transition-colors">
          Отметить все как прочитанные
        </button>
      </div>
    </div>
  );
}
