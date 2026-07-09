import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Truck, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../components/ui/use-toast";
import DataTable from "../../components/shared/DataTable";
import { supplierService } from "../../lib/dataService";

const emptySupplier = { name: "", contact_person: "", phone: "", email: "", address: "", status: "نشط" };

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptySupplier);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = suppliers.filter(s => !search || s.name?.includes(search) || s.contact_person?.includes(search));

  const openAdd = () => { setForm(emptySupplier); setEditId(null); setDialogOpen(true); };
  const openEdit = (s) => {
    setForm({ name: s.name || "", contact_person: s.contact_person || "", phone: s.phone || "", email: s.email || "", address: s.address || "", status: s.status || "نشط" });
    setEditId(s.id);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.phone) {
      toast({ title: "خطأ", description: "الرجاء ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        await supplierService.update(editId, form);
      } else {
        await supplierService.create(form);
      }
      setDialogOpen(false);
      load();
      toast({ title: editId ? "تم التحديث" : "تمت الإضافة" });
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await supplierService.delete(id);
      toast({ title: "تم الحذف" });
      load();
    } catch (e) {
      toast({ title: "خطأ", description: "فشل الحذف", variant: "destructive" });
    }
  };

  const columns = [
    { key: "name", label: "الاسم" },
    { key: "contact_person", label: "الشخص المسؤول" },
    { key: "phone", label: "الهاتف" },
    { key: "email", label: "البريد" },
    {
      key: "status", label: "الحالة",
      render: (row) => (
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${row.status === "نشط" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: "actions", label: "الإجراءات",
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); openEdit(row); }}>
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">الموردين</h1>
        <Button className="rounded-xl" onClick={openAdd}><Plus className="w-4 h-4 ml-2" />إضافة مورد</Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="بحث..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 rounded-xl bg-white" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="لا يوجد موردين" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle className="text-right">{editId ? "تعديل مورد" : "إضافة مورد"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">اسم المورد *</label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">الشخص المسؤول</label>
              <Input value={form.contact_person} onChange={(e) => setForm(p => ({ ...p, contact_person: e.target.value }))} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">رقم الهاتف *</label>
              <Input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">البريد الإلكتروني</label>
              <Input value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">العنوان</label>
              <Input value={form.address} onChange={(e) => setForm(p => ({ ...p, address: e.target.value }))} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">الحالة</label>
              <Select value={form.status} onValueChange={(v) => setForm(p => ({ ...p, status: v }))}>
                <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="نشط">نشط</SelectItem>
                  <SelectItem value="غير نشط">غير نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={submitting} className="rounded-lg">
              {submitting ? "جاري الحفظ..." : editId ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}