import React, { useState, useEffect } from "react";
import { FileText, Search } from "lucide-react";
import { Input } from "../../components/ui/input";
import DataTable from "../../components/shared/DataTable";
import { auditLogService } from "../../lib/dataService";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setLoading(true);
        const data = await auditLogService.getAll();
        setLogs(data);
      } catch (error) {
        console.error("Failed to load audit logs", error);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, []);

  const filtered = logs.filter(l =>
    !search || l.action?.includes(search) || l.user_name?.includes(search) || l.details?.includes(search)
  );

  const columns = [
    { key: "action", label: "الإجراء" },
    { key: "entity_type", label: "النوع" },
    { key: "user_name", label: "المستخدم" },
    { key: "details", label: "التفاصيل", render: (row) => <span className="text-xs text-muted-foreground max-w-[200px] truncate block">{row.details}</span> },
    { key: "created_date", label: "التاريخ", render: (row) => new Date(row.created_date).toLocaleString("ar-SA") },
  ];

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-foreground mb-6">سجل العمليات</h1>
      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="بحث في السجل..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 rounded-xl bg-white" />
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="لا توجد سجلات بعد" />
      )}
    </div>
  );
}