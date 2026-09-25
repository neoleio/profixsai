import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, ClipboardList, Users, Smartphone, Wrench,
  HardHat, CreditCard, ShieldCheck, BarChart3, UserCog, History, Settings, LogOut, Inbox, MessageSquare, Receipt
} from "lucide-react";
import { useAuth } from "../../lib/auth-context.jsx";
import { useNewRequestsCount } from "../../lib/useNewRequestsCount.js";
import { useNewMessagesCount } from "../../lib/useNewMessagesCount.js";
import Logotype from "../site/Logotype.jsx";

const ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, roles: ["admin", "staff", "technician"] },
  { to: "/admin/repair-requests", label: "Repair Requests", icon: Inbox, roles: ["admin", "staff"], notify: "requests" },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, roles: ["admin", "staff"], notify: "messages" },
  { to: "/admin/job-orders", label: "Job Orders", icon: ClipboardList, roles: ["admin", "staff", "technician"] },
  { to: "/admin/customers", label: "Customers", icon: Users, roles: ["admin", "staff"] },
  { to: "/admin/devices", label: "Devices", icon: Smartphone, roles: ["admin", "staff", "technician"] },
  { to: "/admin/services", label: "Services", icon: Wrench, roles: ["admin"] },
  { to: "/admin/order-slip", label: "Order Slip", icon: Receipt, roles: ["admin", "staff"] },
  { to: "/admin/reports", label: "Reports", icon: BarChart3, roles: ["admin", "staff"] },
  { to: "/admin/users", label: "Users", icon: UserCog, roles: ["admin"] },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: History, roles: ["admin"] },
  { to: "/admin/settings", label: "Settings", icon: Settings, roles: ["admin"] }
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const items = ITEMS.filter((i) => i.roles.includes(user?.role));
  const canSeeInboxes = ["admin", "staff"].includes(user?.role);
  const newRequestsCount = useNewRequestsCount(canSeeInboxes);
  const newMessagesCount = useNewMessagesCount(canSeeInboxes);
  const notifyCounts = { requests: newRequestsCount, messages: newMessagesCount };

  return (
    <div className="flex flex-col h-full bg-ink text-white/80">
      <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2.5">
        <img src="/assets/logo.png" alt="ProFixSAI logo" className="w-8 h-8 rounded-full object-cover" />
        <div>
          <Logotype size="base" className="leading-none" />
          <p className="text-xs text-white/40 mt-0.5">Repair Management</p>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
        {items.map(({ to, label, icon: Icon, end, notify }) => {
          const count = notify ? notifyCounts[notify] : 0;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-white/10 text-white" : "hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {count > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-red text-white text-[11px] font-bold grid place-items-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-xs text-white/40">Signed in as</p>
        <p className="text-sm font-medium text-white">{user?.name}</p>
        <p className="text-xs text-white/40 capitalize">{user?.role}</p>
        <button onClick={logout} className="mt-3 flex items-center gap-2 text-sm text-white/70 hover:text-white">
          <LogOut size={15} /> Log out
        </button>
      </div>
    </div>
  );
}
