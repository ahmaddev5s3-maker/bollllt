import React, { useState, useEffect } from "react";
import { FileText, Check, X as XIcon, Eye } from "lucide-react";
import { Button } from "./../../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useToast } from "./../../components/ui/use-toast";
import { orderService } from "../../lib/dataService";

export default function PrescriptionReview() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data.filter(o => o.prescription_status === "قيد المراجعة"));
    } catch (error) {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const updatePrescription = async (orderId, status) => {
    try {
      await orderService.update(orderId, { prescription_status: status });
      toast({ title: status === "معتمدة" ? "تم اعتماد الوصفة" : "تم رفض الوصفة" });
      load();
    } catch (error) {
      toast({ title: "خطأ", description: "فشل التحديث", variant: "destructive" });
    }
  };

  const statusColor = (s) => {
    if (s === "معتمدة") return "bg-green-100 text-green-700";
    if (s === "مرفوضة") return "bg-red-100 text-red-700";
    return "bg-amber-100 text-amber-700";
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-foreground mb-6">مراجعة الوصفات الطبية</h1>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
          <p>لا توجد وصفات طبية للمراجعة</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="h-48 bg-muted/30 relative cursor-pointer" onClick={() => setViewImage(order.prescription_url)}>
                <img src={order.prescription_url} alt="وصفة" className="w-full h-full object-contain" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{order.customer_name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(order.prescription_status)}`}>
                    {order.prescription_status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {order.items?.map(i => i.medicine_name).join("، ")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(order.created_date).toLocaleString("ar-SA")}
                </p>
                {order.prescription_status === "قيد المراجعة" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 rounded-lg text-xs bg-green-600 hover:bg-green-700" onClick={() => updatePrescription(order.id, "معتمدة")}>
                      <Check className="w-3.5 h-3.5 ml-1" />
                      اعتماد
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 rounded-lg text-xs text-destructive" onClick={() => updatePrescription(order.id, "مرفوضة")}>
                      <XIcon className="w-3.5 h-3.5 ml-1" />
                      رفض
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!viewImage} onOpenChange={(v) => { if (!v) setViewImage(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="text-right">الوصفة الطبية</DialogTitle></DialogHeader>
          {viewImage && <img src={viewImage} alt="وصفة" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </div>
  );
}