import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Pill, Truck, Clock, Shield, ChevronLeft, Plus, Minus, X, Upload, Check, Phone, Mail } from "lucide-react";
import { Button } from "./../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { useToast } from "../components/ui/use-toast";
import { medicineService, orderService } from "../lib/dataService";
import Navbar from "../components/layout/Navbar";

const categories = ["الكل", "مسكنات", "مضادات حيوية", "فيتامينات", "أدوية القلب", "أدوية السكري", "أدوية الضغط", "مستحضرات تجميل", "مستلزمات طبية", "أدوية الأطفال", "أخرى"];

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-orange-50 via-amber-50 to-white py-16 lg:py-24">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Badge className="bg-primary/10 text-primary border-0 mb-4 text-sm px-3 py-1">صيدليتك الرقمية</Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
              أدويتك توصلك<br />
              <span className="text-primary">بسرعة وأمان</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
              تصفّح آلاف الأدوية والمكملات، وأضفها إلى سلتك لاستلامها من الصيدلية أو تسليمها إلى بابك.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog">
                <Button size="lg" className="rounded-xl text-base px-8 h-12">ابدأ التسوق</Button>
              </a>
              <Link to="/admin">
                <Button variant="outline" size="lg" className="rounded-xl text-base px-8 h-12">دخول الفريق</Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1587854692152-cbe660dbde88?crop=entropy&cs=srgb&fm=jpg&q=85&w=600"
              alt="صيدلية"
              className="rounded-2xl shadow-xl w-full object-cover max-h-[400px]"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
          {[
            { icon: Shield, label: "أدوية أصلية", value: "100%" },
            { icon: Truck, label: "توصيل سريع", value: "< 2 س" },
            { icon: Clock, label: "خدمة", value: "24/7" },
          ].map((s) => (
            <div key={s.label} className="bg-white/80 backdrop-blur rounded-xl p-3 text-center border border-border/50">
              <s.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MedicineCard({ med, onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative h-40 bg-muted/30">
        <img
          src={med.image_url || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?crop=entropy&cs=srgb&fm=jpg&q=85&w=400"}
          alt={med.name_ar}
          className="w-full h-full object-cover"
        />
        {med.requires_prescription && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white text-[10px]">وصفة طبية</Badge>
        )}
        {med.quantity <= 5 && med.quantity > 0 && (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-[10px]">كمية محدودة</Badge>
        )}
        {med.quantity === 0 && (
          <Badge className="absolute top-2 left-2 bg-gray-500 text-white text-[10px]">غير متوفر</Badge>
        )}
      </div>
      <div className="p-4">
        <p className="text-[11px] text-primary font-medium mb-1">{med.category}</p>
        <h3 className="font-semibold text-foreground text-sm mb-0.5">{med.name_ar}</h3>
        <p className="text-[11px] text-muted-foreground mb-3">{med.manufacturer || med.name_en}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">{med.price} ر.س</span>
          <Button
            size="sm"
            className="rounded-lg h-8 text-xs"
            disabled={med.quantity === 0}
            onClick={() => onAdd(med)}
          >
            <Plus className="w-3.5 h-3.5 ml-1" />
            أضف
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("الكل");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("استلام من الصيدلية");
  const [notes, setNotes] = useState("");
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        setLoading(true);
        const data = await medicineService.getAll();
        setMedicines(data);
      } catch (error) {
        toast({ title: "خطأ", description: "فشل تحميل الأدوية", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadMedicines();
  }, []);

  const filtered = medicines.filter((m) => {
    const matchSearch = !search || m.name_ar?.includes(search) || m.name_en?.toLowerCase().includes(search.toLowerCase()) || m.active_ingredient?.includes(search) || m.barcode?.includes(search);
    const matchCat = selectedCat === "الكل" || m.category === selectedCat;
    return matchSearch && matchCat;
  });

  const addToCart = (med) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === med.id);
      if (existing) {
        return prev.map((c) => c.id === med.id ? { ...c, qty: Math.min(c.qty + 1, med.quantity) } : c);
      }
      return [...prev, { ...med, qty: 1 }];
    });
    toast({ title: "تمت الإضافة", description: `${med.name_ar} أضيف إلى السلة` });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const needsPrescription = cart.some((c) => c.requires_prescription);

  const handleCheckout = async () => {
    if (!customerName.trim()) {
      toast({ title: "خطأ", description: "الرجاء إدخال الاسم", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let prescriptionUrl = "";
      if (prescriptionFile) {
        prescriptionUrl = URL.createObjectURL(prescriptionFile);
      }
      const expiresAt = new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString();
      await orderService.create({
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_method: deliveryMethod,
        notes,
        total_amount: cartTotal,
        items: cart.map((c) => ({
          medicine_id: c.id,
          medicine_name: c.name_ar,
          quantity: c.qty,
          price: c.price,
        })),
        prescription_url: prescriptionUrl,
        prescription_status: prescriptionUrl ? "قيد المراجعة" : "لا يوجد",
        expires_at: expiresAt,
      });
      setOrderSuccess(true);
      setCart([]);
    } catch (e) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء تأكيد الطلب", variant: "destructive" });
    }
    setSubmitting(false);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <Navbar cartCount={cart.length} />
      <HeroSection />

      {/* Catalog */}
      <section id="catalog" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">الكتالوج الطبي</h2>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="ابحث بالاسم أو المادة الفعالة أو الباركود..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 rounded-xl h-11 bg-white"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCat === cat
                  ? "bg-primary text-white"
                  : "bg-white text-muted-foreground border border-border hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Pill className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p>لا توجد أدوية مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((m) => (
              <MedicineCard key={m.id} med={m} onAdd={addToCart} />
            ))}
          </div>
        )}
      </section>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {cart.reduce((s, c) => s + c.qty, 0)}
          </span>
        </button>
      )}

      {/* Cart Dialog */}
      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">سلة المشتريات</DialogTitle>
          </DialogHeader>
          {cart.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">السلة فارغة</p>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name_ar}</p>
                    <p className="text-xs text-muted-foreground">{item.price} ر.س</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-md bg-white border flex items-center justify-center">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-md bg-white border flex items-center justify-center">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="text-destructive mr-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && (
            <div className="border-t border-border pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">الإجمالي</span>
                <span className="text-xl font-bold text-primary">{cartTotal.toFixed(2)} ر.س</span>
              </div>
              {needsPrescription && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 mb-3">
                  ⚠️ بعض الأدوية تتطلب وصفة طبية. يرجى إرفاقها عند تأكيد الطلب.
                </p>
              )}
              <Button className="w-full rounded-xl h-11" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                تأكيد الطلب
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={(v) => { setCheckoutOpen(v); if (!v) setOrderSuccess(false); }}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">{orderSuccess ? "تم تأكيد الطلب" : "إتمام الطلب"}</DialogTitle>
          </DialogHeader>
          {orderSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">تم تأكيد طلبك بنجاح!</h3>
              <p className="text-muted-foreground text-sm">
                سيتم إلغاء الطلب خلال 42 ساعة إذا لم يتم استلامه. يرجى التوجه إلى الصيدلية لإتمام الشراء.
              </p>
              <Button className="mt-6 rounded-xl" onClick={() => { setCheckoutOpen(false); setOrderSuccess(false); }}>
                حسناً
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">الاسم الكامل *</label>
                <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="أدخل اسمك" className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">رقم الهاتف</label>
                <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="05xxxxxxxx" className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">طريقة الاستلام</label>
                <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <SelectTrigger className="rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="استلام من الصيدلية">استلام من الصيدلية</SelectItem>
                    <SelectItem value="توصيل منزلي">توصيل منزلي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {needsPrescription && (
                <div>
                  <label className="text-sm font-medium mb-1 block">إرفاق الوصفة الطبية *</label>
                  <Input type="file" accept="image/*" onChange={(e) => setPrescriptionFile(e.target.files[0])} className="rounded-lg" />
                </div>
              )}
              <div>
                <label className="text-sm font-medium mb-1 block">ملاحظات</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية..." className="rounded-lg" rows={2} />
              </div>
              <div className="flex justify-between items-center py-2 border-t border-border">
                <span className="font-bold">الإجمالي</span>
                <span className="text-xl font-bold text-primary">{cartTotal.toFixed(2)} ر.س</span>
              </div>
              <Button className="w-full rounded-xl h-11" onClick={handleCheckout} disabled={submitting}>
                {submitting ? "جاري التأكيد..." : "تأكيد الطلب"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* About Section */}
      <section id="about" className="bg-gradient-to-bl from-orange-50 via-amber-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">عن صيدليتي</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نحن نقدم خدمات صيدلية متكاملة مع التزام تام بالجودة والسلامة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">أدوية أصلية 100%</h3>
              <p className="text-sm text-muted-foreground">
                جميع منتجاتنا مصدقة من الجهات الرسمية ومضمونة الجودة
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">توصيل سريع</h3>
              <p className="text-sm text-muted-foreground">
                خدمة توصيل سريعة وموثوقة إلى باب منزلك في أقل من ساعتين
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">خدمة 24/7</h3>
              <p className="text-sm text-muted-foreground">
                فريقنا متاح على مدار الساعة لخدمتكم وتلبية احتياجاتكم
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-border/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">رؤيتنا</h3>
                <p className="text-muted-foreground mb-4">
                  نسعى لتكون صيدليتي الوجهة الأولى لجميع احتياجاتك الصحية، من خلال تقديم خدمات متميزة ومنتجات عالية الجودة مع تجربة عميل استثنائية.
                </p>
                <h3 className="text-xl font-bold text-foreground mb-3">قيمنا</h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• الجودة والسلامة في كل منتج</li>
                  <li>• الاحترام والتعامل الإنساني</li>
                  <li>• الشفافية في الأسعار والخدمات</li>
                  <li>• الالتزام بالمعايير المهنية</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-amber-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">+10</div>
                <p className="text-sm text-muted-foreground mb-4">سنوات من الخبرة</p>
                <div className="text-4xl font-bold text-primary mb-2">+50K</div>
                <p className="text-sm text-muted-foreground mb-4">عميل سعيد</p>
                <div className="text-4xl font-bold text-primary mb-2">+1000</div>
                <p className="text-sm text-muted-foreground">منتج طبي</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">اتصل بنا</h2>
            <p className="text-muted-foreground">نحن هنا لمساعدتك على مدار الساعة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-border/50 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">الهاتف</h3>
              <p className="text-sm text-muted-foreground">050-1234567</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border/50 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">البريد الإلكتروني</h3>
              <p className="text-sm text-muted-foreground">info@pharmacy.com</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border/50 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">ساعات العمل</h3>
              <p className="text-sm text-muted-foreground">24 ساعة / 7 أيام</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">صيدليتي</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 صيدليتي - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}