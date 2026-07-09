import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import StatCard from "../../components/shared/StatCard";
import { DollarSign, TrendingUp, Package, ShoppingCart } from "lucide-react";
import { orderService, medicineService } from "../../lib/dataService";

export default function Reports() {
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
        console.error("Failed to load report data", error);
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

  const completedOrders = orders.filter(o => o.status === "مكتمل");
  const totalRevenue = completedOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const avgOrder = completedOrders.length ? totalRevenue / completedOrders.length : 0;

  // Top selling medicines
  const medSales = {};
  completedOrders.forEach(o => {
    (o.items || []).forEach(item => {
      medSales[item.medicine_name] = (medSales[item.medicine_name] || 0) + (item.quantity || 1);
    });
  });
  const topMeds = Object.entries(medSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, qty]) => ({ name: name.length > 15 ? name.slice(0, 15) + "..." : name, qty }));

  // Low stock
  const lowStockMeds = medicines
    .filter(m => m.quantity <= 10)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 8)
    .map(m => ({ name: m.name_ar?.length > 15 ? m.name_ar.slice(0, 15) + "..." : m.name_ar, stock: m.quantity }));

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-foreground mb-6">التقارير والإحصائيات</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="إجمالي الإيرادات" value={`${totalRevenue.toFixed(0)} ر.س`} color="bg-green-100 text-green-600" />
        <StatCard icon={ShoppingCart} label="إجمالي الطلبات" value={orders.length} color="bg-blue-100 text-blue-600" />
        <StatCard icon={TrendingUp} label="متوسط الطلب" value={`${avgOrder.toFixed(0)} ر.س`} color="bg-purple-100 text-purple-600" />
        <StatCard icon={Package} label="إجمالي الأدوية" value={medicines.length} color="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">الأدوية الأكثر مبيعاً</h3>
          {topMeds.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">لا توجد مبيعات بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topMeds} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="qty" fill="hsl(25, 85%, 55%)" radius={[0, 6, 6, 0]} name="الكمية المباعة" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4">أدوية بمخزون منخفض</h3>
          {lowStockMeds.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">جميع الأدوية متوفرة</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={lowStockMeds}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="stock" fill="#EF4444" radius={[6, 6, 0, 0]} name="المخزون" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}