import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function SiteLayout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-site-gradient">
      {/* Repeating logo watermark — noticeably present but never competes with content */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.09] pointer-events-none"
        style={{
          backgroundImage: "url(/assets/logo.png)",
          backgroundSize: "110px 110px",
          backgroundRepeat: "repeat",
          backgroundAttachment: "fixed"
        }}
        aria-hidden="true"
      />
      <Navbar />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
