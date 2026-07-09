import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import DataTable from "../../components/shared/DataTable";

export default function ExpiryAlerts() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        const data = await medicineService.getAll();
        setMedicines(data);
      } catch (error) {
        console.error("Failed to load medicines", error);
      } finally {
        setLoading(false);
      }
    };
    loadMedicines();
  }, []);

  const now = new Date();
  const sorted = [...medicines].sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date));

  const getStatus = (date) => {
    const d = new Date(date);
    const diffDays = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { label: "منتهي", color: "bg-red-500 text-white" };
    if (diffDays <= 30) return { label: "خلال شهر", color: "bg-red-100 text-red-700" };
    if (diffDays <= 90) return { label: "خلال 3 أشهر", color: "bg-amber-100 text-amber-700" };
    return { label: "آمن", color: "bg-green-100 text-green-700" };
  };

  const columns = [
    { key: "name_ar", label: "الدواء" },
    { key: "name_en", label: "الاسم الإنجليزي" },
    { key: "category", label: "التصنيف" },
    { key: "quantity", label: "المخزون" },
    {
      key: "expiration_date", label: "تاريخ الانتهاء",
      render: (row) => new Date(row.expiration_date).toLocaleDateString("ar-SA"),
    },
    {
      key: "status", label: "الحالة",
      render: (row) => {
        const s = getStatus(row.expiration_date);
        return <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>;
      },
    },
  ];

  return (
    <div dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-amber-500" />
        <h1 className="text-2xl font-bold text-foreground">تنبيهات انتهاء الصلاحية</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={sorted} emptyMessage="لا توجد أدوية بتاريخ صلاحية محدد" />
      )}
    </div>
  );
}