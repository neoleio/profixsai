import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Bell, MessageSquare } from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import Logotype from "../site/Logotype.jsx";
import { useAuth } from "../../lib/auth-context.jsx";
import { useNewRequestsCount } from "../../lib/useNewRequestsCount.js";
import { useNewMessagesCount } from "../../lib/useNewMessagesCount.js";
import { PageFade } from "../motion/index.jsx";

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const canSeeInboxes = ["admin", "staff"].includes(user?.role);
  const newRequestsCount = useNewRequestsCount(canSeeInboxes);
  const newMessagesCount = useNewMessagesCount(canSeeInboxes);

  return (
    <div className="min-h-screen flex bg-fog-50">
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="fixed w-64 h-screen">
          <Sidebar />
        </div>
      </aside>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-64"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Sidebar onNavigate={() => setOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 min-w-0 relative">
        <div
          className="fixed inset-0 lg:left-64 -z-10 opacity-[0.04] grayscale pointer-events-none"
          style={{
            backgroundImage: "url(/assets/repair-macro-2.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
          aria-hidden="true"
        />
        <div className="fixed top-0 right-0 lg:right-0 w-80 h-80 -z-10 bg-brand-blue/[0.04] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="fixed bottom-0 left-1/3 w-96 h-96 -z-10 bg-brand-red/[0.03] rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="lg:hidden flex items-center justify-between px-4 h-14 bg-ink text-white">
          <span className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="ProFixSAI logo" className="w-7 h-7 rounded-full object-cover" />
            <Logotype size="base" />
          </span>
          <div className="flex items-center gap-4">
            {canSeeInboxes && (
              <>
                <Link to="/admin/messages" className="relative" aria-label="Messages">
                  <MessageSquare size={20} />
                  {newMessagesCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-red text-white text-[10px] font-bold grid place-items-center">
                      {newMessagesCount > 9 ? "9+" : newMessagesCount}
                    </span>
                  )}
                </Link>
                <Link to="/admin/repair-requests" className="relative" aria-label="Repair requests">
                  <Bell size={20} />
                  {newRequestsCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-brand-red text-white text-[10px] font-bold grid place-items-center">
                      {newRequestsCount > 9 ? "9+" : newRequestsCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button onClick={() => setOpen((v) => !v)}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>
        <main className="relative p-5 sm:p-8 max-w-6xl mx-auto">
          <PageFade pageKey={location.pathname}>
            <Outlet />
          </PageFade>
        </main>
      </div>
    </div>
  );
}
