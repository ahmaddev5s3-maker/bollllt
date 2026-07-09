import React, { useState, useEffect } from "react";
import { Users, Plus, Trash2, Edit2, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../components/ui/use-toast";
import DataTable from "../../components/shared/DataTable";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filtered = users.filter(u =>
    !search || u.full_name?.includes(search) || u.email?.includes(search)
  );

  const handleInvite = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await userService.create({ email, name: email.split('@')[0], role });
      toast({ title: "تم الإرسال", description: `تم إرسال دعوة إلى ${email}` });
      setInviteOpen(false);
      setEmail("");
      loadUsers();
    } catch (e) {
      toast({ title: "خطأ", description: "فشل إرسال الدعوة", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const roleLabel = (r) => {
    if (r === "admin") return "مدير";
    if (r === "manager") return "مدير مخزن";
    if (r === "pharmacist") return "صيدلي";
    return "عميل";
  };

  const roleBadgeColor = (r) => {
    if (r === "admin") return "bg-purple-100 text-purple-700";
    if (r === "manager") return "bg-blue-100 text-blue-700";
    if (r === "pharmacist") return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  const columns = [
    { key: "full_name", label: "الاسم" },
    { key: "email", label: "البريد الإلكتروني" },
    {
      key: "role", label: "الدور",
      render: (row) => (
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${roleBadgeColor(row.role)}`}>
          {roleLabel(row.role)}
        </span>
      ),
    },
    {
      key: "created_date", label: "تاريخ الانضمام",
      render: (row) => new Date(row.created_date).toLocaleDateString("ar-SA"),
    },
  ];

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">إدارة المستخدمين</h1>
        <Button className="rounded-xl" onClick={() => setInviteOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          دعوة مستخدم
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 rounded-xl bg-white" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="لا يوجد مستخدمون" />
      )}

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-right">دعوة مستخدم جديد</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">البريد الإلكتروني</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="rounded-lg" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">الدور</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">مدير</SelectItem>
                  <SelectItem value="manager">مدير مخزن</SelectItem>
                  <SelectItem value="pharmacist">صيدلي</SelectItem>
                  <SelectItem value="user">عميل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleInvite} disabled={submitting} className="rounded-lg">
              {submitting ? "جاري الإرسال..." : "إرسال الدعوة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}