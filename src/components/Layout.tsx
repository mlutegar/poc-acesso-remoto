import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Outlet context={{ openMenu: () => setMenuOpen(true) }} />
      </div>
    </div>
  );
}
