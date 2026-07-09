import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { UserPlus, Mail, Lock, Loader2, Shield, User, BriefcaseMedical, Building2, Heart, FileCheck, CreditCard } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import { toast } from "../components/ui/use-toast";
import { authService } from "../lib/dataService";
import Navbar from "../components/layout/Navbar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("patient");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [adminId, setAdminId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const roles = [
    { value: "patient", label: "مريض", icon: Heart, description: "تصفح وشراء الأدوية", credentialLabel: null },
    { value: "pharmacist", label: "صيدلي", icon: BriefcaseMedical, description: "إدارة الطلبات والوصفات الطبية", credentialLabel: "رقم الترخيص/الشهادة" },
    { value: "manager", label: "مدير المخزن", icon: Building2, description: "إدارة الأدوية والموردين", credentialLabel: "رقم الشهادة" },
    { value: "admin", label: "مدير عام", icon: Shield, description: "إدارة النظام والمستخدمين", credentialLabel: "رقم الهوية" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    // Validate role-specific credentials
    const selectedRole = roles.find(r => r.value === role);
    if (selectedRole?.credentialLabel) {
      if (role === "pharmacist" && !licenseNumber.trim()) {
        setError("الرجاء إدخال رقم الترخيص/الشهادة");
        return;
      }
      if (role === "manager" && !certificateNumber.trim()) {
        setError("الرجاء إدخال رقم الشهادة");
        return;
      }
      if (role === "admin" && !adminId.trim()) {
        setError("الرجاء إدخال رقم الهوية");
        return;
      }
    }

    setLoading(true);
    try {
      const userData = {
        email,
        password,
        name,
        role,
        ...(role === "pharmacist" && { license_number: licenseNumber }),
        ...(role === "manager" && { certificate_number: certificateNumber }),
        ...(role === "admin" && { admin_id: adminId }),
      };
      await authService.register(userData);
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      await authService.verifyOtp(email, otpCode);
      toast({
        title: "تم التسجيل بنجاح",
        description: "يمكنك الآن تسجيل الدخول",
      });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await authService.resendOtp(email);
      toast({
        title: "تم إرسال الرمز",
        description: "تحقق من بريدك الإلكتروني للحصول على الرمز الجديد",
      });
    } catch (err) {
      setError(err.message || "فشل إعادة إرسال الرمز");
    }
  };

  if (showOtp) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar cartCount={0} />
        <AuthLayout
          icon={Mail}
          title="تحقق من بريدك الإلكتروني"
          subtitle={`أرسلنا رمزاً إلى ${email}`}
        >
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-center mb-6">
            <InputOTP
              maxLength={6}
              value={otpCode}
              onChange={setOtpCode}
              autoFocus
              autoComplete="one-time-code"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            className="w-full h-12 font-medium"
            onClick={handleVerify}
            disabled={loading || otpCode.length < 6}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري التحقق...
              </>
            ) : (
              "تحقق"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            لم تستلم الرمز؟{" "}
            <button onClick={handleResend} className="text-primary font-medium hover:underline">
              إعادة الإرسال
            </button>
          </p>
        </AuthLayout>
      </div>
    );
  }

  const selectedRole = roles.find(r => r.value === role);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={0} />
      <AuthLayout
        icon={UserPlus}
        title="إنشاء حساب جديد"
        subtitle="سجل للبدء في استخدام النظام"
        footer={
          <>
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              سجل دخول
            </Link>
          </>
        }
      >
        <Button
          variant="outline"
          className="w-full h-12 text-sm font-medium mb-6"
          type="button"
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          المتابعة مع Google
        </Button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">أو</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="name"
                type="text"
                autoComplete="name"
                autoFocus
                placeholder="أدخل اسمك الكامل"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">الدور</Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      role === r.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs font-medium ${role === r.value ? "text-primary" : "text-muted-foreground"}`}>
                      {r.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{selectedRole?.description}</p>
          </div>

          {/* Role-specific credential fields */}
          {role === "pharmacist" && (
            <div className="space-y-2">
              <Label htmlFor="license">رقم الترخيص/الشهادة المهنية *</Label>
              <div className="relative">
                <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="license"
                  type="text"
                  placeholder="أدخل رقم ترخيص الصيدلة"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">سيتم التحقق من الترخيص قبل تفعيل الحساب</p>
            </div>
          )}

          {role === "manager" && (
            <div className="space-y-2">
              <Label htmlFor="certificate">رقم الشهادة المهنية *</Label>
              <div className="relative">
                <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="certificate"
                  type="text"
                  placeholder="أدخل رقم شهادة إدارة المخازن"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">سيتم التحقق من الشهادة قبل تفعيل الحساب</p>
            </div>
          )}

          {role === "admin" && (
            <div className="space-y-2">
              <Label htmlFor="adminIdInput">رقم الهوية الإدارية *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="adminIdInput"
                  type="text"
                  placeholder="أدخل رقم الهوية الإدارية"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">للمدراء فقط - سيتم التحقق من الصلاحيات</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">تأكيد كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري إنشاء الحساب...
              </>
            ) : (
              "إنشاء حساب"
            )}
          </Button>
        </form>
      </AuthLayout>
    </div>
  );
}
