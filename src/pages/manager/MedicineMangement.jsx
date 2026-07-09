import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Pill } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
import { useToast } from "../../components/ui/use-toast";
import { Badge } from "../../components/ui/badge";
import { medicineService } from "../../lib/dataService";

const cats = ["مسكنات", "مضادات حيوية", "فيتامينات", "أدوية القلب", "أدوية السكري", "أدوية الضغط", "مستحضرات تجميل", "مستلزمات طبية", "أدوية الأطفال", "أخرى"];

const emptyMed = {
  name_ar: "", name_en: "", manufacturer: "", active_ingredient: "",
  price: "", quantity: "", existing_stock: "", category: "مسكنات",
  requires_prescription: false, expiration_date: "", barcode: "",
  description: "", storage_location: "", image_url: "",
};

export default function MedicineManagement() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("الكل");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyMed);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const { toast } = useToast();

  const load = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getAll();
      setMedicines(data);
    } catch (error) {
      toast({ title: "خطأ", description: "فشل تحميل البيانات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = medicines.filter(m => {
    const matchS = !search || m.name_ar?.includes(search) || m.name_en?.toLowerCase().includes(search.toLowerCase()) || m.barcode?.includes(search);
    const matchC = filterCat === "الكل" || m.category === filterCat;
    return matchS && matchC;
  });

  const openAdd = () => { setForm(emptyMed); setEditId(null); setImageFile(null); setDialogOpen(true); };
  const openEdit = (m) => {
    setForm({
      name_ar: m.name_ar || "", name_en: m.name_en || "", manufacturer: m.manufacturer || "",
      active_ingredient: m.active_ingredient || "", price: m.price || "", quantity: m.quantity || "",
      existing_stock: m.existing_stock || "", category: m.category || "أخرى",
      requires_prescription: m.requires_prescription || false, expiration_date: m.expiration_date || "",
      barcode: m.barcode || "", description: m.description || "", storage_location: m.storage_location || "",
      image_url: m.image_url || "",
    });
    setEditId(m.id);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name_ar || !form.name_en || !form.price || !form.category) {
      toast({ title: "خطأ", description: "الرجاء ملء الحقول المطلوبة", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = URL.createObjectURL(imageFile);
      }
      const data = {
        ...form,
        price: Number(form.price) || 0,
        quantity: Number(form.quantity) || 0,
        existing_stock: Number(form.existing_stock) || 0,
        image_url: imageUrl,
      };
      if (editId) {
        await medicineService.update(editId, data);
        toast({ title: "تم التحديث" });
      } else {
        await medicineService.create(data);
        toast({ title: "تمت الإضافة" });
      }
      setDialogOpen(false);
      load();
    } catch (e) {
      toast({ title: "خطأ", description: "حدث خطأ", variant: "destructive" });
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      await medicineService.delete(id);
      toast({ title: "تم الحذف" });
      load();
    } catch (e) {
      toast({ title: "خطأ", description: "فشل الحذف", variant: "destructive" });
    }
  };

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold text-foreground">إدارة الأدوية</h1>
        <Button className="rounded-xl" onClick={openAdd}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة دواء
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث بالاسم أو الباركود..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10 rounded-xl bg-white" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-40 rounded-xl bg-white"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="الكل">الكل</SelectItem>
            {cats.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Pill className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
          <p>لا توجد أدوية</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-muted/30 overflow-hidden shrink-0">
                <img src={m.image_url || "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?crop=entropy&cs=srgb&fm=jpg&q=85&w=100"} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm truncate">{m.name_ar}</h3>
                  {m.requires_prescription && <Badge className="bg-red-100 text-red-700 text-[9px] shrink-0">وصفة</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{m.name_en} • {m.category}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>السعر: {m.price} ر.س</span>
                  <span className={m.quantity <= 10 ? "text-red-600 font-medium" : ""}>المخزون: {m.quantity}</span>
                  {m.expiration_date && <span>الصلاحية: {m.expiration_date}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(m)}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(m.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent dir="rtl" className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">{editId ? "تعديل دواء" : "إضافة دواء جديد"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">الاسم بالعربية *</label>
              <Input value={form.name_ar} onChange={(e) => updateField("name_ar", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">الاسم بالإنجليزية *</label>
              <Input value={form.name_en} onChange={(e) => updateField("name_en", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">الشركة المصنعة</label>
              <Input value={form.manufacturer} onChange={(e) => updateField("manufacturer", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">المادة الفعالة</label>
              <Input value={form.active_ingredient} onChange={(e) => updateField("active_ingredient", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">السعر *</label>
              <Input type="number" value={form.price} onChange={(e) => updateField("price", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">الكمية</label>
              <Input type="number" value={form.quantity} onChange={(e) => updateField("quantity", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">المخزون/الدين الموجود</label>
              <Input type="number" value={form.existing_stock} onChange={(e) => updateField("existing_stock", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">التصنيف *</label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger className="rounded-lg text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{cats.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">تاريخ الانتهاء</label>
              <Input type="date" value={form.expiration_date} onChange={(e) => updateField("expiration_date", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">الباركود</label>
              <Input value={form.barcode} onChange={(e) => updateField("barcode", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">موقع التخزين</label>
              <Input value={form.storage_location} onChange={(e) => updateField("storage_location", e.target.value)} className="rounded-lg text-sm" />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <Switch checked={form.requires_prescription} onCheckedChange={(v) => updateField("requires_prescription", v)} />
              <label className="text-xs font-medium">يتطلب وصفة طبية</label>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block">صورة الدواء</label>
              <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="rounded-lg text-sm" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium mb-1 block">الوصف</label>
              <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} rows={2} className="rounded-lg text-sm" />
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