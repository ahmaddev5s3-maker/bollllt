import React, { useState, useEffect } from "react";
import { Plus, Package, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../components/ui/use-toast";
import DataTable from "../../components/shared/DataTable";
import { purchaseOrderService, supplierService, medicineService } from "../../lib/dataService";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [qty, setQty] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [expectedDelivery, setExpectedDelivery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const [ordersData, suppliersData, medicinesData] = await Promise.all([
        purchaseOrderService.getAll(),
        supplierService.getAll(),
        medicineService.getAll()
      ]);
      setOrders(ordersData);
      setSuppliers(suppliersData);
      setMedicines(medicinesData);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const addItem = () => {
    if (!selectedMedicine || !qty) return;
    const med = medicines.find(m => m.id === selectedMedicine);
    setItems(prev => [...prev, {
      medicine_id: med.id, medicine_name: med.name_ar,
      quantity: Number(qty), unit_cost: Number(unitCost) || 0,
    }]);
    setSelectedMedicine(""); setQty(""); setUnitCost("");
  };

  const handleCreate = async () => {
    if (!selectedSupplier || items.length === 0) {
      toast({ title: "خطأ", description: "اختر المورد وأضف عنصر واحد على الأقل", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const supplier = suppliers.find(s => s.id === selectedSupplier);
      const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);
      await purchaseOrderService.create({
        supplier_id: selectedSupplier,
        supplier_name: supplier.name,
        items,
        total_cost: totalCost,
        notes,
        expected_delivery: expectedDelivery
      });
      setDialogOpen(false);
      setItems([]); setNotes(""); setExpectedDelivery("");
      load();
      toast({ title: "تم إنشاء أمر الشراء" });
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await purchaseOrderService.updateStatus(id, status);
      load();
      toast({ title: `تم تغيير الحالة إلى ${status}` });
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    }
  };

  const statusColor = (s) => {
    if (s === "مستلم") return "bg-green-100 text-green-700";
    if (s === "ملغي") return "bg-red-100 text-red-700";
    if (s === "مرسل") return "bg-blue-100 text-blue-700";
    return "bg-amber-100 text-amber-700";
  };

  const columns = [
    { key: "supplier_name", label: "المورد" },
    { key: "items", label: "العناصر", render: (row) => `${row.items?.length || 0} عنصر` },
    { key: "total_cost", label: "التكلفة", render: (row) => `${(row.total_cost || 0).toFixed(0)} ر.س` },
    {
      key: "status", label: "الحالة",
      render: (row) => (
        <Select value={row.status} onValueChange={(v) => updateStatus(row.id, v)}>
          <SelectTrigger className={`h-7 text-[11px] rounded-full w-24 border-0 font-medium ${statusColor(row.status)}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="جديد">جديد</SelectItem>
            <SelectItem value="مرسل">مرسل</SelectItem>
            <SelectItem value="مستلم">مستلم</SelectItem>
            <SelectItem value="ملغي">ملغي</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    { key: "created_date", label: "التاريخ", render: (row) => new Date(row.created_date).toLocaleDateString("ar-SA") },
  ];

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">أوامر الشراء</h1>
        <Button className="rounded-xl" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4 ml-2" />
          أمر شراء جديد
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : (
        <DataTable columns={columns} data={orders} emptyMessage="لا توجد أوامر شراء" />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="text-right">أمر شراء جديد</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium mb-1 block">المورد *</label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="rounded-lg text-sm"><SelectValue placeholder="اختر المورد" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-xs font-medium mb-2">إضافة عنصر</p>
              <div className="grid grid-cols-3 gap-2">
                <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                  <SelectTrigger className="rounded-lg text-xs"><SelectValue placeholder="الدواء" /></SelectTrigger>
                  <SelectContent>
                    {medicines.map(m => <SelectItem key={m.id} value={m.id}>{m.name_ar}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="الكمية" value={qty} onChange={(e) => setQty(e.target.value)} className="rounded-lg text-xs" />
                <Input type="number" placeholder="تكلفة الوحدة" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} className="rounded-lg text-xs" />
              </div>
              <Button variant="outline" size="sm" className="mt-2 rounded-lg text-xs" onClick={addItem}>إضافة</Button>
            </div>

            {items.length > 0 && (
              <div className="space-y-1">
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg border text-xs">
                    <span>{item.medicine_name}</span>
                    <span>{item.quantity} × {item.unit_cost} = {item.quantity * item.unit_cost} ر.س</span>
                  </div>
                ))}
                <p className="text-sm font-bold text-left">
                  الإجمالي: {items.reduce((s, i) => s + i.quantity * i.unit_cost, 0)} ر.س
                </p>
              </div>
            )}

            <div>
              <label className="text-xs font-medium mb-1 block">تاريخ التسليم المتوقع</label>
              <Input type="date" value={expectedDelivery} onChange={(e) => setExpectedDelivery(e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">ملاحظات</label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-lg text-sm" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreate} disabled={submitting} className="rounded-lg">
              {submitting ? "جاري الإنشاء..." : "إنشاء أمر الشراء"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}