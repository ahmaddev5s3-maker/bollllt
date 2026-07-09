import React, { useState, useEffect } from "react";
import { Package, AlertTriangle, Truck, Pill } from "lucide-react";
import StatCard from "../../components/shared/StatCard";
import { Link } from "react-router-dom";
import { medicineService, supplierService, purchaseOrderService } from "../../lib/dataService";

export default function ManagerDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [meds, sups, pos] = await Promise.all([
          medicineService.getAll(),
          supplierService.getAll(),
          purchaseOrderService.getAll()
        ]);
        setMedicines(meds);
        setSuppliers(sups);
        setPurchaseOrders(pos);
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

  const totalMeds = medicines.length;
  const lowStock = medicines.filter(m => m.quantity <= 10).length;
  const now = new Date();
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const expiringSoon = medicines.filter(m => m.expiration_date && new Date(m.expiration_date) <= thirtyDays).length;
  const pendingPO = purchaseOrders.filter(p => p.status === "جديد" || p.status === "مرسل").length;

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-foreground mb-6">لوحة تحكم المخزن</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Pill} label="إجمالي الأدوية" value={totalMeds} color="bg-blue-100 text-blue-600" />
        <StatCard icon={Package} label="مخزون منخفض" value={lowStock} color="bg-amber-100 text-amber-600" />
        <StatCard icon={AlertTriangle} label="قرب انتهاء الصلاحية" value={expiringSoon} color="bg-red-100 text-red-600" />
        <StatCard icon={Truck} label="أوامر شراء معلقة" value={pendingPO} color="bg-purple-100 text-purple-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">تنبيهات المخزون</h3>
            <Link to="/manager/medicines" className="text-xs text-primary hover:underline">عرض الكل</Link>
          </div>
          {medicines.filter(m => m.quantity <= 10).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">جميع الأدوية متوفرة بكميات كافية</p>
          ) : (
            <div className="space-y-2">
              {medicines.filter(m => m.quantity <= 10).slice(0, 5).map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-red-50">
                  <div>
                    <p className="text-sm font-medium">{m.name_ar}</p>
                    <p className="text-xs text-muted-foreground">{m.category}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">{m.quantity} وحدة</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiry Alerts */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">أدوية قرب الانتهاء</h3>
            <Link to="/manager/expiry" className="text-xs text-primary hover:underline">عرض الكل</Link>
          </div>
          {medicines.filter(m => m.expiration_date && new Date(m.expiration_date) <= thirtyDays).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">لا توجد أدوية قرب انتهاء الصلاحية</p>
          ) : (
            <div className="space-y-2">
              {medicines.filter(m => m.expiration_date && new Date(m.expiration_date) <= thirtyDays).slice(0, 5).map(m => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
                  <div>
                    <p className="text-sm font-medium">{m.name_ar}</p>
                    <p className="text-xs text-muted-foreground">{m.name_en}</p>
                  </div>
                  <span className="text-xs text-amber-700 font-medium">{new Date(m.expiration_date).toLocaleDateString("ar-SA")}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}