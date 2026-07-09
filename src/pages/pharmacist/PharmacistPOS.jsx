import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Check, Pill } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { medicineService, orderService } from "../../lib/dataService";

export default function PharmacistPOS() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Implement custom API call to fetch medicines
    setMedicines([]);
    setLoading(false);
  }, []);

  const filtered = medicines.filter(m =>
    search && (m.name_ar?.includes(search) || m.name_en?.toLowerCase().includes(search.toLowerCase()) || m.barcode?.includes(search) || m.active_ingredient?.includes(search) || m.category?.includes(search))
  );

  const addToCart = (med) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === med.id);
      if (ex) return prev.map(c => c.id === med.id ? { ...c, qty: Math.min(c.qty + 1, med.quantity) } : c);
      return [...prev, { ...med, qty: 1 }];
    });
  };

  const updateQty = (id, d) => setCart(prev => prev.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + d) } : c));
  const remove = (id) => setCart(prev => prev.filter(c => c.id !== id));
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const completeSale = async () => {
    if (!customerName.trim()) {
      toast({ title: "أدخل اسم العميل", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await orderService.create({
        customer_name: customerName,
        customer_phone: "",
        delivery_method: "استلام من الصيدلية",
        notes: "",
        total_amount: total,
        items: cart.map((c) => ({
          medicine_id: c.id,
          medicine_name: c.name_ar,
          quantity: c.qty,
          price: c.price,
        })),
        prescription_url: "",
        prescription_status: "لا يوجد",
        expires_at: new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
      });
      for (const item of cart) {
        await medicineService.updateStock(item.id, item.existing_stock - item.qty);
      }
      toast({ title: "تمت العملية بنجاح" });
      setCart([]);
      setCustomerName("");
      setCheckoutOpen(false);
      const data = await medicineService.getAll();
      setMedicines(data);
    } catch (e) {
      toast({ title: "خطأ", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div dir="rtl">
      <h1 className="text-2xl font-bold text-foreground mb-6">نقطة البيع</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Search Panel */}
        <div className="lg:col-span-2">
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم أو الباركود أو المادة الفعالة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 rounded-xl bg-white h-12 text-base"
              autoFocus
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          ) : !search ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>ابدأ البحث عن دواء</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Pill className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p>لا توجد نتائج</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(m => (
                <div key={m.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{m.name_ar}</h3>
                      {m.requires_prescription && <Badge className="bg-red-100 text-red-700 text-[9px]">وصفة</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.name_en} • {m.category} • {m.active_ingredient}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{m.price} ر.س</span>
                      <span className={m.quantity <= 5 ? "text-red-600" : ""}>المخزون: {m.quantity}</span>
                      {m.barcode && <span>باركود: {m.barcode}</span>}
                    </div>
                  </div>
                  <Button size="sm" className="rounded-lg shrink-0" disabled={m.quantity === 0} onClick={() => addToCart(m)}>
                    <Plus className="w-4 h-4 ml-1" />
                    أضف
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Panel */}
        <div className="bg-white rounded-xl border border-border p-4 h-fit sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">السلة</h3>
            <Badge variant="secondary" className="mr-auto text-xs">{cart.length}</Badge>
          </div>

          {cart.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">لا توجد عناصر</p>
          ) : (
            <>
              <div className="space-y-2 max-h-[40vh] overflow-y-auto mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name_ar}</p>
                      <p className="text-[11px] text-muted-foreground">{item.price} × {item.qty} = {(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-white border flex items-center justify-center">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-5 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-white border flex items-center justify-center">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => remove(item.id)} className="text-destructive mr-1"><X className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-sm">الإجمالي</span>
                  <span className="text-lg font-bold text-primary">{total.toFixed(2)} ر.س</span>
                </div>
                <Button className="w-full rounded-xl h-11" onClick={() => setCheckoutOpen(true)}>
                  إتمام البيع
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent dir="rtl" className="max-w-sm">
          <DialogHeader><DialogTitle className="text-right">إتمام عملية البيع</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">اسم العميل</label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="اسم العميل" className="rounded-lg" />
            </div>
            <div className="flex justify-between text-sm">
              <span>عدد العناصر</span>
              <span className="font-medium">{cart.reduce((s, c) => s + c.qty, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">الإجمالي</span>
              <span className="text-xl font-bold text-primary">{total.toFixed(2)} ر.س</span>
            </div>
            <Button className="w-full rounded-xl h-11" onClick={completeSale} disabled={submitting}>
              {submitting ? "جاري الإتمام..." : "تأكيد البيع"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}