import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, FileText,
  ClipboardList, Truck, LogOut, Menu, X, Pill, ChevronLeft,
  Home, Search, ShoppingBag, Upload, History, Bell, Settings
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

const roleMenus = {
  admin: [
    { label: "لوحة التحكم", path: "/admin", icon: LayoutDashboard },
    { label: "إدارة المستخدمين", path: "/admin/users", icon: Users },
    { label: "سجل العمليات", path: "/admin/audit", icon: FileText },
    { label: "التقارير", path: "/admin/reports", icon: ClipboardList },
  ],
  manager: [
    { label: "لوحة التحكم", path: "/manager", icon: LayoutDashboard },
    { label: "إدارة الأدوية", path: "/manager/medicines", icon: Pill },
    { label: "تنبيهات الصلاحية", path: "/manager/expiry", icon: Bell },
    { label: "الموردين", path: "/manager/suppliers", icon: Truck },
    { label: "أوامر الشراء", path: "/manager/purchase-orders", icon: Package },
  ],
  pharmacist: [
    { label: "نقطة البيع", path: "/pharmacist", icon: ShoppingCart },
    { label: "الطلبات", path: "/pharmacist/orders", icon: ClipboardList },
    { label: "مراجعة الوصفات", path: "/pharmacist/prescriptions", icon: Upload },
  ],
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const role = location.pathname.startsWith("/admin") ? "admin"
    : location.pathname.startsWith("/manager") ? "manager"
    : "pharmacist";

  const menuItems = roleMenus[role] || [];
  const roleTitle = role === "admin" ? "المدير العام" : role === "manager" ? "مدير المخزن" : "الصيدلي";

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-white border-l border-border transform transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"} flex flex-col`}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base text-foreground">صيدليتي</h1>
                <span className="text-[11px] text-muted-foreground">{roleTitle}</span>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary text-white font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Home className="w-[18px] h-[18px]" />
            الصفحة الرئيسية
          </Link>
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-14 border-b border-border bg-white flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{roleTitle}</Badge>
          </div>
        </header>
        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}