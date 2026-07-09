import React, { useState, useEffect } from "react";
import { Users, ShoppingCart, Package, DollarSign, TrendingUp, Pill } from "lucide-react";
import StatCard from "../../components/shared/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#E8772E", "#F5A623", "#4CAF50", "#2196F3", "#9C27B0", "#FF5722"];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ordersData, medicinesData] = await Promise.all([
          orderService.getAll(),
          medicineService.getAll()
        ]);
        setOrders(ordersData);
        setMedicines(medicinesData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const totalRevenue = orders.filter(o => o.status === "مكتمل").reduce((s, o) => s + (o.total_amount || 0), 0);
  const completedOrders = orders.filter(o => o.status === "مكتمل").length;
  const pendingOrders = orders.filter(o => o.status === "جديد" || o.status === "قيد المراجعة" || o.status === "جاهز").length;
  const lowStock = medicines.filter(m => m.quantity <= 10).length;

  // Category distribution
  const catCounts = {};
  medicines.forEach(m => { catCounts[m.category] = (catCounts[m.category] || 0) + 1; });
  const categoryData = Object.entries(catCounts).map(([name, value]) => ({ name, value }));

  // Recent orders for chart (last 7 simulated)
  const ordersByStatus = [
    { name: "جديد", value: orders.filter(o => o.status === "جديد").length },
    { name: "قيد المراجعة", value: orders.filter(o => o.status === "قيد المراجعة").length },
    { name: "جاهز", value: orders.filter(o => o.status === "جاهز").length },
    { name: "مكتمل", value: orders.filter(o => o.status === "مكتمل").length },
    { name: "ملغي", value: orders.filter(o => o.status === "ملغي").length },
  ].filter(d => d.value > 0);

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-foreground mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="إجمالي الإيرادات" value={`${totalRevenue.toFixed(0)} ر.س`} color="bg-green-100 text-green-600" />
        <StatCard icon={ShoppingCart} label="طلبات مكتملة" value={completedOrders} color="bg-blue-100 text-blue-600" />
        <StatCard icon={Package} label="طلبات معلقة" value={pendingOrders} color="bg-amber-100 text-amber-600" />
        <StatCard icon={Pill} label="مخزون منخفض" value={lowStock} color="bg-red-100 text-red-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">حالة الطلبات</h3>
          {ordersByStatus.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">لا توجد طلبات بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(25, 85%, 55%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">توزيع الأدوية حسب التصنيف</h3>
          {categoryData.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">لا توجد أدوية بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-border p-5 mt-6">
        <h3 className="font-semibold text-foreground mb-4">آخر الطلبات</h3>
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">لا توجد طلبات بعد</p>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{order.items?.length || 0} عنصر</p>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">{order.total_amount?.toFixed(2)} ر.س</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    order.status === "مكتمل" ? "bg-green-100 text-green-700" :
                    order.status === "ملغي" ? "bg-red-100 text-red-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}