import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Pill, Truck, Clock, Shield, ChevronLeft, Plus, Minus, X, Upload, Check, Phone, Mail, MapPin, Navigation, Star, Sparkles, HeartPulse, Activity } from "lucide-react";
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
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-green-100/40 rounded-full blur-2xl animate-float" />

        {/* Floating pills animation */}
        <div className="absolute top-20 right-1/4 animate-float animation-delay-1000">
          <Pill className="w-8 h-8 text-primary/20" />
        </div>
        <div className="absolute bottom-32 left-1/3 animate-float animation-delay-3000">
          <HeartPulse className="w-10 h-10 text-red-300/30" />
        </div>
        <div className="absolute top-40 left-20 animate-float animation-delay-2000">
          <Activity className="w-6 h-6 text-green-400/30" />
        </div>
        <div className="absolute bottom-20 right-1/3 animate-float animation-delay-4000">
          <Sparkles className="w-8 h-8 text-amber-400/20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in-up">
            <Badge className="bg-primary/10 text-primary border-0 mb-4 text-sm px-3 py-1 animate-bounce-subtle">
              <Sparkles className="w-3 h-3 ml-1" />
              صيدليتك الرقمية
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
              أدويتك توصلك<br />
              <span className="text-primary animate-gradient bg-gradient-to-r from-primary via-amber-600 to-primary bg-clip-text">بسرعة وأمان</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-md">
              تصفّح آلاف الأدوية والمكملات، وأضفها إلى سلتك لاستلامها من الصيدلية أو تسليمها إلى بابك.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog">
                <Button size="lg" className="rounded-xl text-base px-8 h-12 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  ابدأ التسوق
                </Button>
              </a>
              <Link to="/admin">
                <Button variant="outline" size="lg" className="rounded-xl text-base px-8 h-12 hover:bg-primary/5 transition-all duration-300">
                  دخول الفريق
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative animate-fade-in-up animation-delay-500">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-amber-200/20 rounded-3xl blur-2xl animate-pulse-slow" />
              <img
                src="https://images.unsplash.com/photo-1576602976047-174e57a678db?crop=entropy&cs=srgb&fm=jpg&q=85&w=600"
                alt="صيدلية حديثة"
                className="rounded-2xl shadow-2xl w-full object-cover max-h-[400px] relative z-10 hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-3 z-20 animate-slide-up animation-delay-1000">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">طلب ناجح</p>
                    <p className="font-bold text-sm">+50,000</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-3 z-20 animate-slide-down animation-delay-1500">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">تقييم 4.9/5</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg animate-fade-in-up animation-delay-1000">
          {[
            { icon: Shield, label: "أدوية أصلية", value: "100%" },
            { icon: Truck, label: "توصيل سريع", value: "< 2 س" },
            { icon: Clock, label: "خدمة", value: "24/7" },
          ].map((s, idx) => (
            <div
              key={s.label}
              className="bg-white/80 backdrop-blur rounded-xl p-3 text-center border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${idx * 200}ms` }}
            >
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

function LocationSection() {
  const pharmacyLocation = {
    lat: 24.7136,
    lng: 46.6753,
    name: "صيدليتي - فرع الرياض",
    address: "شارع العليا، حي الملقا، الرياض",
    phone: "050-1234567",
    workingHours: "24 ساعة"
  };

  return (
    <section id="location" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-0 mb-3 px-3 py-1">موقعنا</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-3">زورونا في صيدليتنا</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لخدمتكم على مدار الساعة
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-2xl shadow-lg border border-border/50 overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b border-border/50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{pharmacyLocation.name}</h3>
                  <p className="text-muted-foreground text-sm">{pharmacyLocation.address}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">الهاتف</p>
                  <p className="font-medium text-foreground">{pharmacyLocation.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">ساعات العمل</p>
                  <p className="font-medium text-foreground">{pharmacyLocation.workingHours}</p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${pharmacyLocation.lat},${pharmacyLocation.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full mt-4"
              >
                <Button variant="outline" className="w-full rounded-xl h-11">
                  <Navigation className="w-4 h-4 ml-2" />
                  الحصول على الاتجاهات
                </Button>
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-border/50 h-[400px] animate-fade-in-up animation-delay-500">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.8!2d${pharmacyLocation.lng}!3d${pharmacyLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sar!2ssa!4v1`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع الصيدلية"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function MedicineCard({ med, onAdd }) {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-40 bg-muted/30 overflow-hidden">
        <img
          src={med.image_url || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?crop=entropy&cs=srgb&fm=jpg&q=85&w=400"}
          alt={med.name_ar}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {med.requires_prescription && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white text-[10px] animate-pulse">وصفة طبية</Badge>
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
            className="rounded-lg h-8 text-xs hover:scale-105 active:scale-95 transition-transform duration-150"
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
      <LocationSection />

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
      <section id="about" className="bg-gradient-to-bl from-orange-50 via-amber-50 to-white py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground mb-3">عن صيدليتي</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نحن نقدم خدمات صيدلية متكاملة مع التزام تام بالجودة والسلامة
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "أدوية أصلية 100%", desc: "جميع منتجاتنا مصدقة من الجهات الرسمية ومضمونة الجودة" },
              { icon: Truck, title: "توصيل سريع", desc: "خدمة توصيل سريعة وموثوقة إلى باب منزلك في أقل من ساعتين" },
              { icon: Clock, title: "خدمة 24/7", desc: "فريقنا متاح على مدار الساعة لخدمتكم وتلبية احتياجاتكم" },
            ].map((item, idx) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-border/50 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${idx * 200}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-7 h-7 text-primary animate-pulse" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-border/50 animate-fade-in-up animation-delay-1000">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">رؤيتنا</h3>
                <p className="text-muted-foreground mb-4">
                  نسعى لتكون صيدليتي الوجهة الأولى لجميع احتياجاتك الصحية، من خلال تقديم خدمات متميزة ومنتجات عالية الجودة مع تجربة عميل استثنائية.
                </p>
                <h3 className="text-xl font-bold text-foreground mb-3">قيمنا</h3>
                <ul className="text-muted-foreground space-y-2">
                  {["الجودة والسلامة في كل منتج", "الاحترام والتعامل الإنساني", "الشفافية في الأسعار والخدمات", "الالتزام بالمعايير المهنية"].map((val, i) => (
                    <li key={i} className="flex items-center gap-2 hover:translate-x-1 transition-transform">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {val}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-amber-50 rounded-xl p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-primary mb-2 animate-bounce-subtle">+10</div>
                  <p className="text-sm text-muted-foreground mb-4">سنوات من الخبرة</p>
                  <div className="text-4xl font-bold text-primary mb-2 animate-bounce-subtle animation-delay-500">+50K</div>
                  <p className="text-sm text-muted-foreground mb-4">عميل سعيد</p>
                  <div className="text-4xl font-bold text-primary mb-2 animate-bounce-subtle animation-delay-1000">+1000</div>
                  <p className="text-sm text-muted-foreground">منتج طبي</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground mb-3">اتصل بنا</h2>
            <p className="text-muted-foreground">نحن هنا لمساعدتك على مدار الساعة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Phone, title: "الهاتف", value: "050-1234567", href: "tel:0501234567" },
              { icon: Mail, title: "البريد الإلكتروني", value: "info@pharmacy.com", href: "mailto:info@pharmacy.com" },
              { icon: Clock, title: "ساعات العمل", value: "24 ساعة / 7 أيام", href: null },
            ].map((item, idx) => (
              <a
                key={item.title}
                href={item.href || "#"}
                className="bg-white rounded-xl p-6 border border-border/50 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up group"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                  <item.icon className="w-6 h-6 text-primary group-hover:animate-bounce-subtle" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{item.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center animate-pulse-slow">
              <Pill className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">صيدليتي</span>
          </div>
          <p className="text-sm text-muted-foreground animate-fade-in animation-delay-500">© 2026 صيدليتي - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}