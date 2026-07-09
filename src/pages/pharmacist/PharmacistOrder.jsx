import React, { useState, useEffect } from "react";
import { Search, Check, X as XIcon, Eye, Clock } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../components/ui/use-toast";
import { Badge } from "../../components/ui/badge";

export default function PharmacistOrders() {
  const [orders, setOrders] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const [ordersData, medicinesData] = await Promise.all([
        orderService.getAll(),
        medicineService.getAll()
      ]);
      setOrders(ordersData);
      setMedicines(medicinesData);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o => {
    const matchS = !search || o.customer_name?.includes(search) || o.customer_phone?.includes(search);
    const matchF = filterStatus === "الكل" || o.status === filterStatus;
    return matchS && matchF;
  });

  const statusColor = (s) => {
    if (s === "مكتمل") return "bg-green-100 text-green-700";
    if (s === "ملغي") return "bg-red-100 text-red-700";
    if (s === "جاهز") return "bg-blue-100 text-blue-700";
    if (s === "قيد المراجعة") return "bg-purple-100 text-purple-700";
    return "bg-amber-100 text-amber-700";
  };

  const completeOrder = async (order) => {
    setSubmitting(true);
    try {
      await orderService.updateStatus(order.id, "مكتمل");
      if (order.items) {
        for (const item of order.items) {
          const med = medicines.find(m => m.id === item.medicine_id);
          if (med) {
            await medicineService.updateStock(med.id, med.existing_stock - item.quantity);
          }
        }
      }
      toast({ title: "تم صرف الطلب بنجاح" });
      setSelectedOrder(null);
      load();
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const cancelOrder = async (orderId) => {
    try {
      await orderService.updateStatus(orderId, "ملغي");
      toast({ title: "تم إلغاء الطلب" });
      setSelectedOrder(null);
      load();
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    }
  };

  const markReady = async (orderId) => {
    try {
      await orderService.updateStatus(orderId, "جاهز");
      toast({ title: "تم تجهيز الطلب" });
      load();
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    }
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-foreground mb-6">الطلبات</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث باسم العميل أو رقم الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 rounded-xl bg-white" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 rounded-xl bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="الكل">الكل</SelectItem>
            <SelectItem value="جديد">جديد</SelectItem>
            <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
            <SelectItem value="جاهز">جاهز</SelectItem>
            <SelectItem value="مكتمل">مكتمل</SelectItem>
            <SelectItem value="ملغي">ملغي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p>لا توجد طلبات</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{order.customer_name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(order.status)}`}>{order.status}</span>
                  {order.prescription_status !== "لا يوجد" && (
                    <Badge variant="outline" className="text-[9px]">وصفة: {order.prescription_status}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.items?.length || 0} عنصر • {(order.total_amount || 0).toFixed(2)} ر.س • {order.delivery_method}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(order.created_date).toLocaleString("ar-SA")}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="rounded-lg text-xs" onClick={() => setSelectedOrder(order)}>
                  <Eye className="w-3.5 h-3.5 ml-1" />
                  عرض
                </Button>
                {(order.status === "جديد" || order.status === "قيد المراجعة") && (
                  <Button size="sm" className="rounded-lg text-xs" onClick={() => markReady(order.id)}>
                    جاهز
                  </Button>
                )}
                {order.status === "جاهز" && (
                  <Button size="sm" className="rounded-lg text-xs bg-green-600 hover:bg-green-700" onClick={() => completeOrder(order)}>
                    <Check className="w-3.5 h-3.5 ml-1" />
                    صرف
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(v) => { if (!v) setSelectedOrder(null); }}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader><DialogTitle className="text-right">تفاصيل الطلب</DialogTitle></DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">العميل</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الهاتف</p>
                  <p className="font-medium">{selectedOrder.customer_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الحالة</p>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الاستلام</p>
                  <p className="font-medium text-xs">{selectedOrder.delivery_method}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium mb-2">العناصر</p>
                <div className="space-y-1.5">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-muted/30 rounded-lg text-sm">
                      <span>{item.medicine_name}</span>
                      <span className="text-xs text-muted-foreground">{item.quantity} × {item.price} = {(item.quantity * item.price).toFixed(2)} ر.س</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-bold">الإجمالي</span>
                <span className="text-lg font-bold text-primary">{(selectedOrder.total_amount || 0).toFixed(2)} ر.س</span>
              </div>

              {selectedOrder.prescription_url && (
                <div>
                  <p className="text-xs font-medium mb-1">الوصفة الطبية</p>
                  <img src={selectedOrder.prescription_url} alt="وصفة" className="rounded-lg border max-h-48 object-contain" />
                </div>
              )}

              {selectedOrder.notes && (
                <div>
                  <p className="text-xs font-medium mb-1">ملاحظات</p>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              {selectedOrder.status !== "مكتمل" && selectedOrder.status !== "ملغي" && (
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-lg bg-green-600 hover:bg-green-700" onClick={() => completeOrder(selectedOrder)} disabled={submitting}>
                    <Check className="w-4 h-4 ml-1" />
                    {submitting ? "جاري الصرف..." : "صرف الطلب"}
                  </Button>
                  <Button variant="outline" className="rounded-lg text-destructive" onClick={() => cancelOrder(selectedOrder.id)}>
                    <XIcon className="w-4 h-4 ml-1" />
                    إلغاء
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}