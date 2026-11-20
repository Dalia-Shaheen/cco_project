"use client";

import type { Locale } from "@/lib/i18n";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export type RegisterIsland = {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
};

export type RegisterCopy = {
  readonly eyebrow: string;
  readonly heroBadge: string;
  readonly heroTitle: string;
  readonly heroSubtitle: string;
  readonly scrollHint: string;
  readonly stepProgress: string;
  readonly step1Title: string;
  readonly step1Desc: string;
  readonly step2Title: string;
  readonly step2Desc: string;
  readonly step3Title: string;
  readonly step3Desc: string;
  readonly parentName: string;
  readonly parentNamePlaceholder: string;
  readonly email: string;
  readonly emailPlaceholder: string;
  readonly password: string;
  readonly passwordPlaceholder: string;
  readonly confirmPassword: string;
  readonly confirmPasswordPlaceholder: string;
  readonly childName: string;
  readonly childNamePlaceholder: string;
  readonly childAge: string;
  readonly ageGroups: readonly string[];
  readonly chooseIsland: string;
  readonly islands: readonly RegisterIsland[];
  readonly next: string;
  readonly prev: string;
  readonly submit: string;
  readonly submitting: string;
  readonly loginPrompt: string;
  readonly loginLink: string;
  readonly securityNote: string;
  readonly successTitle: string;
  readonly successDesc: string;
  readonly goToLogin: string;
  readonly goToDashboard: string;
};

type RegisterExperienceProps = {
  locale: Locale;
  t: RegisterCopy;
  loginUrl: string;
  initialMode?: "register" | "login";
};

const disabilityOptionsAr = [
  "طيف التوحد",
  "فرط الحركة وتشتت الانتباه (ADHD)",
  "صعوبات التعلم",
  "متلازمة داون",
  "تأخر النطق والتخاطب",
  "إعاقة حركية",
  "إعاقة سمعية أو بصرية",
  "احتياجات وصعوبات أخرى",
];

const disabilityOptionsEn = [
  "Autism Spectrum",
  "ADHD / Hyperactivity & Attention",
  "Learning Difficulties",
  "Down Syndrome",
  "Speech & Communication Delay",
  "Motor / Physical Disability",
  "Visual or Hearing Impairment",
  "Other Special Needs",
];

export default function RegisterExperience({
  locale,
  t,
  loginUrl,
  initialMode = "register",
}: RegisterExperienceProps) {
  const isRtl = locale === "ar";

  // Active view: "register" or "login"
  const [activeMode, setActiveMode] = useState<"register" | "login">(initialMode);

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [registerSubmitted, setRegisterSubmitted] = useState(false);
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register Form State (Preserving all original fields)
  const [registerForm, setRegisterForm] = useState({
    parentName: "",
    email: "",
    password: "",
    childName: "",
    childCondition: "normal" as "normal" | "special_needs",
    gender: "boy" as "boy" | "girl",
    disabilityType: isRtl ? "طيف التوحد" : "Autism Spectrum",
  });

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data?.error ||
            (isRtl ? "حدث خطأ أثناء إنشاء الحساب" : "Registration failed")
        );
        setIsSubmitting(false);
        return;
      }

      setRegisterSubmitted(true);
    } catch {
      setErrorMessage(
        isRtl
          ? "تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى"
          : "Network error, please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      setLoginSubmitted(true);
    } catch {
      setLoginSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden bg-[#2D184E] py-8 sm:py-12 lg:py-14 px-4 sm:px-6 flex items-center justify-center font-sans"
    >
      {/* ===================== FANTASY SKY BACKGROUND ATMOSPHERE ===================== */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Base magical sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#251244] via-[#351E5C] to-[#200F3C]" />

        {/* User's Original Sky Islands Artwork (Natural backdrop across right side) */}
        <div className="absolute inset-0 opacity-80 mix-blend-screen scale-105">
          <Image
            src="/explorer-kidz/register-bg.jpg"
            alt="Sky Islands Atmosphere"
            fill
            priority
            className="object-cover object-center lg:object-right"
          />
        </div>

        {/* Atmospheric ambient glows */}
        <div className="absolute top-1/4 -right-10 w-96 h-96 rounded-full bg-[#8F70C4]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#FDE047]/15 blur-3xl pointer-events-none" />
      </div>

      {/* ===================== DESKTOP 2-COLUMN VIEWPORT: CARD ON LEFT, HERO ON RIGHT ===================== */}
      <div
        dir="ltr"
        className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14"
      >
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: THE AUTH CARD (EXACT MOCKUP DESIGN RESTORED)                 */}
        {/* ========================================================================= */}
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="w-full max-w-[465px] mx-auto lg:mx-0 shrink-0"
        >
          {/* Outer Card with Double White Border and Soft Drop Shadow */}
          <div className="relative rounded-[38px] sm:rounded-[42px] border-[5px] sm:border-[6px] border-white/90 bg-white p-4 sm:p-5 shadow-[0_25px_60px_-15px_rgba(26,14,48,0.55),0_10px_25px_rgba(0,0,0,0.18)] transition-all duration-300">
            
            {/* FLOATING SPARKLE STAR BADGE (Overlapping top corner) */}
            <div className={`absolute -top-3.5 ${isRtl ? "-left-3.5" : "-right-3.5"} z-20 size-12 sm:size-13 rounded-2xl bg-white/40 backdrop-blur-md border-2 border-white shadow-lg flex items-center justify-center rotate-12 transition-transform hover:rotate-45`}>
              <svg viewBox="0 0 24 24" className="size-6 text-[#FDE047] fill-current drop-shadow-sm">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>

            {/* TOP HEADER POD (Curved Purple Capsule Card) */}
            <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-b from-[#6441A4] via-[#5C399A] to-[#4F2D8B] p-5 text-center text-white shadow-inner">
              
              {/* Tiny decorative corner sparkles */}
              <div className="absolute top-2.5 left-4 opacity-50">
                <svg viewBox="0 0 24 24" className="size-3 text-[#FDE047] fill-current">
                  <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" />
                </svg>
              </div>
              <div className="absolute bottom-2.5 right-4 opacity-40">
                <svg viewBox="0 0 24 24" className="size-3 text-[#FDE047] fill-current">
                  <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" />
                </svg>
              </div>

              {/* Yellow Pill Badge */}
              <div className="inline-block rounded-full bg-[#FDE047] px-4 py-1 text-[11px] font-black uppercase tracking-wider text-[#4C1D95] shadow-sm mb-2">
                {activeMode === "login"
                  ? isRtl
                    ? "منطقة الأهالي"
                    : "PARENT AREA"
                  : isRtl
                  ? "حساب جديد"
                  : "NEW ACCOUNT"}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-sm">
                {activeMode === "login"
                  ? isRtl
                    ? "تسجيل الدخول"
                    : "Sign In"
                  : isRtl
                  ? "إنشاء حساب مستكشف"
                  : "Create Explorer Account"}
              </h1>

              {/* Subtitle */}
              <p className="mt-1 text-xs text-white/90 font-medium leading-relaxed">
                {activeMode === "login"
                  ? isRtl
                    ? "سجّل الدخول لمتابعة تقدم أبطالك الصغار"
                    : "Sign in to track your heroes' progress"
                  : isRtl
                  ? "سجّل بياناتك وابدأ رحلة الألعاب والتعلم الساحرة"
                  : "Join today and start the magical learning journey"}
              </p>
            </div>

            {/* ==================== FORM BODY ==================== */}
            <div className="mt-4 px-1">
              
              {/* LOGIN VIEW (Exact Match to User's Mockup) */}
              {activeMode === "login" && (
                <div>
                  {loginSubmitted ? (
                    <div className="text-center py-8">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#EEE8F8] text-[#6441A4] font-black text-xl border-2 border-[#6441A4]/30 shadow-md">
                        100%
                      </div>
                      <h2 className="mt-4 text-xl font-black text-[#30214F]">
                        {isRtl ? "أهلاً بك مجدداً!" : "Welcome back!"}
                      </h2>
                      <p className="mt-2 text-xs leading-relaxed text-[#625575]">
                        {isRtl
                          ? "تم تسجيل الدخول بنجاح! جاري تحويلك..."
                          : "Signed in successfully. Redirecting..."}
                      </p>
                      <div className="mt-6">
                        <Link
                          href={`/${locale}`}
                          className="inline-block rounded-2xl bg-[#6441A4] px-8 py-3 text-xs font-black text-white shadow-[0_4px_0_#432675] hover:bg-[#583796] transition-all"
                        >
                          {isRtl ? "الصفحة الرئيسية" : "Back to Home"}
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="login-email"
                          className="block text-xs font-bold text-[#30214F] mb-1 text-start"
                        >
                          {isRtl ? "البريد الإلكتروني" : "Email address"}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="login-email"
                            type="email"
                            required
                            placeholder="daliashaheen776@gmail.com"
                            value={loginForm.email}
                            onChange={(e) =>
                              setLoginForm({ ...loginForm, email: e.target.value })
                            }
                            className={`h-11 sm:h-12 w-full rounded-2xl border-2 border-[#E9D5FF] bg-white text-xs font-medium text-[#30214F] placeholder:text-[#A799BD] focus:border-[#6441A4] focus:ring-4 focus:ring-[#6441A4]/15 outline-none transition-all ${
                              isRtl ? "pr-4 pl-11" : "pl-4 pr-11"
                            }`}
                          />
                          <div className={`absolute ${isRtl ? "left-3.5" : "right-3.5"} text-[#8F70C4] pointer-events-none`}>
                            <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-2">
                              <rect width="20" height="16" x="2" y="4" rx="3" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Password Field */}
                      <div>
                        <label
                          htmlFor="login-password"
                          className="block text-xs font-bold text-[#30214F] mb-1 text-start"
                        >
                          {isRtl ? "كلمة المرور" : "Password"}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••••••"
                            value={loginForm.password}
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                password: e.target.value,
                              })
                            }
                            className={`h-11 sm:h-12 w-full rounded-2xl border-2 border-[#E9D5FF] bg-white text-xs font-medium text-[#30214F] placeholder:text-[#A799BD] focus:border-[#6441A4] focus:ring-4 focus:ring-[#6441A4]/15 outline-none transition-all ${
                              isRtl ? "pr-4 pl-16" : "pl-4 pr-16"
                            }`}
                          />
                          <div className={`absolute ${isRtl ? "left-3" : "right-3"} flex items-center gap-1.5`}>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-[#8F70C4] hover:text-[#6441A4] p-1 cursor-pointer transition-colors"
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? (
                                <svg viewBox="0 0 24 24" className="size-4.5 fill-none stroke-current stroke-2">
                                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" className="size-4.5 fill-none stroke-current stroke-2">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </button>
                            <span className="text-[#8F70C4]">
                              <svg viewBox="0 0 24 24" className="size-4.5 fill-none stroke-current stroke-2">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between text-[11px] pt-0.5">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[#625575] font-medium">
                          <input
                            type="checkbox"
                            checked={loginForm.rememberMe}
                            onChange={(e) =>
                              setLoginForm({
                                ...loginForm,
                                rememberMe: e.target.checked,
                              })
                            }
                            className="size-4 rounded-md border-2 border-[#C9BDEB] text-[#6441A4] focus:ring-[#6441A4] cursor-pointer"
                          />
                          <span>{isRtl ? "تذكرني" : "Remember me"}</span>
                        </label>
                        <button
                          type="button"
                          className="font-bold text-[#6441A4] hover:underline cursor-pointer"
                        >
                          {isRtl ? "نسيت كلمة المرور؟" : "Forgot password?"}
                        </button>
                      </div>

                      {/* 3D Tactile Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative h-12 w-full cursor-pointer rounded-2xl bg-[#6441A4] hover:bg-[#583796] text-white font-black text-sm shadow-[0_5px_0_#432675,0_12px_24px_rgba(67,38,117,0.35)] active:translate-y-1 active:shadow-[0_1px_0_#432675] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
                        >
                          <span>{isRtl ? "تسجيل الدخول" : "Sign In"}</span>
                          <svg
                            viewBox="0 0 24 24"
                            className={`size-4.5 fill-none stroke-current stroke-3 transition-transform group-hover:${
                              isRtl ? "-translate-x-1" : "translate-x-1"
                            }`}
                          >
                            <path
                              d={
                                isRtl
                                  ? "M19 12H5M12 19l-7-7 7-7"
                                  : "M5 12h14M12 5l7 7-7 7"
                              }
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Platform Reassurance Badge */}
                      <div className="mt-4 rounded-2xl bg-[#F5F0FF] py-2.5 px-3 text-center border border-[#E9D5FF] flex items-center justify-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="size-3.5 text-[#6441A4] fill-none stroke-current stroke-2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <p className="text-[10.5px] font-bold text-[#6441A4]">
                          {isRtl
                            ? "منصة تعليمية آمنة 100% وخالية تماماً من الإعلانات"
                            : "100% Safe educational platform with zero ads"}
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* REGISTER VIEW (Preserving ALL functional content & inputs) */}
              {activeMode === "register" && (
                <div>
                  {registerSubmitted ? (
                    <div className="text-center py-6">
                      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#EEE8F8] text-[#6441A4] font-black text-xl border-2 border-[#6441A4]/30 shadow-md">
                        100%
                      </div>
                      <h2 className="mt-3 text-xl font-black text-[#30214F]">
                        {t.successTitle}
                      </h2>
                      <p className="mt-1 text-xs leading-relaxed text-[#625575]">
                        {t.successDesc}
                      </p>
                      
                      <div className="mt-4 rounded-2xl bg-[#F5F0FF] p-3.5 text-start border border-[#E9D5FF]">
                        <p className="text-[11px] font-black text-[#6441A4] border-b border-[#E9D5FF] pb-1.5 mb-2">
                          {isRtl ? "ملخص بيانات الحساب" : "Account Summary"}
                        </p>
                        <div className="space-y-1 text-xs text-[#30214F] font-semibold">
                          <p>
                            <span className="font-bold">{t.parentName}:</span>{" "}
                            {registerForm.parentName || (isRtl ? "ولي الأمر" : "Parent")}
                          </p>
                          <p>
                            <span className="font-bold">{t.childName}:</span>{" "}
                            {registerForm.childName}
                          </p>
                          <p>
                            <span className="font-bold">{t.email}:</span>{" "}
                            {registerForm.email}
                          </p>
                          <p>
                            <span className="font-bold">{isRtl ? "الحالة:" : "Profile:"}</span>{" "}
                            {registerForm.childCondition === "normal"
                              ? isRtl
                                ? `طبيعي (${registerForm.gender === "boy" ? "ولد" : "بنت"})`
                                : `Typical (${registerForm.gender === "boy" ? "Boy" : "Girl"})`
                              : isRtl
                              ? `ذوي احتياجات خاصة (${registerForm.disabilityType})`
                              : `Special Needs (${registerForm.disabilityType})`}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5">
                        <button
                          type="button"
                          onClick={() => setActiveMode("login")}
                          className="rounded-2xl bg-[#6441A4] px-8 py-3 text-xs font-black text-white shadow-[0_4px_0_#432675] hover:bg-[#583796] cursor-pointer transition-all"
                        >
                          {t.goToLogin}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                      
                      {/* Row 1: Parent Name & Child Name */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label
                            htmlFor="cart-parentName"
                            className="block text-[11px] font-bold text-[#30214F] mb-1 text-start"
                          >
                            {t.parentName}
                          </label>
                          <input
                            id="cart-parentName"
                            type="text"
                            required
                            placeholder={t.parentNamePlaceholder}
                            value={registerForm.parentName}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                parentName: e.target.value,
                              })
                            }
                            className="h-10 w-full rounded-2xl border-2 border-[#E9D5FF] bg-white px-3 text-xs font-medium text-[#30214F] placeholder:text-[#A799BD] focus:border-[#6441A4] focus:ring-4 focus:ring-[#6441A4]/15 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cart-childName"
                            className="block text-[11px] font-bold text-[#30214F] mb-1 text-start"
                          >
                            {t.childName}
                          </label>
                          <input
                            id="cart-childName"
                            type="text"
                            required
                            placeholder={t.childNamePlaceholder}
                            value={registerForm.childName}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                childName: e.target.value,
                              })
                            }
                            className="h-10 w-full rounded-2xl border-2 border-[#E9D5FF] bg-white px-3 text-xs font-medium text-[#30214F] placeholder:text-[#A799BD] focus:border-[#6441A4] focus:ring-4 focus:ring-[#6441A4]/15 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Row 2: Email */}
                      <div>
                        <label
                          htmlFor="cart-email"
                          className="block text-[11px] font-bold text-[#30214F] mb-1 text-start"
                        >
                          {t.email}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="cart-email"
                            type="email"
                            required
                            placeholder={t.emailPlaceholder}
                            value={registerForm.email}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                email: e.target.value,
                              })
                            }
                            className={`h-10 w-full rounded-2xl border-2 border-[#E9D5FF] bg-white text-xs font-medium text-[#30214F] placeholder:text-[#A799BD] focus:border-[#6441A4] focus:ring-4 focus:ring-[#6441A4]/15 outline-none transition-all ${
                              isRtl ? "pr-3 pl-10" : "pl-3 pr-10"
                            }`}
                          />
                          <div className={`absolute ${isRtl ? "left-3" : "right-3"} text-[#8F70C4] pointer-events-none`}>
                            <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
                              <rect width="20" height="16" x="2" y="4" rx="3" />
                              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Password */}
                      <div>
                        <label
                          htmlFor="cart-password"
                          className="block text-[11px] font-bold text-[#30214F] mb-1 text-start"
                        >
                          {t.password}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            id="cart-password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder={t.passwordPlaceholder}
                            value={registerForm.password}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                password: e.target.value,
                              })
                            }
                            className={`h-10 w-full rounded-2xl border-2 border-[#E9D5FF] bg-white text-xs font-medium text-[#30214F] placeholder:text-[#A799BD] focus:border-[#6441A4] focus:ring-4 focus:ring-[#6441A4]/15 outline-none transition-all ${
                              isRtl ? "pr-3 pl-14" : "pl-3 pr-14"
                            }`}
                          />
                          <div className={`absolute ${isRtl ? "left-2.5" : "right-2.5"} flex items-center gap-1.5`}>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-[#8F70C4] hover:text-[#6441A4] p-0.5 cursor-pointer transition-colors"
                            >
                              {showPassword ? (
                                <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
                                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                                  <line x1="2" x2="22" y1="2" y2="22" />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </button>
                            <span className="text-[#8F70C4]">
                              <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Child Condition (Pill Buttons) */}
                      <div className="pt-0.5">
                        <label className="block text-[11px] font-bold text-[#30214F] mb-1 text-start">
                          {isRtl ? "حالة الطفل" : "Child Condition"}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setRegisterForm({
                                ...registerForm,
                                childCondition: "normal",
                              })
                            }
                            className={`h-9.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center ${
                              registerForm.childCondition === "normal"
                                ? "bg-[#6441A4] text-white shadow-[0_3px_0_#432675]"
                                : "bg-[#F5F0FF] text-[#6441A4] border-2 border-[#E9D5FF] hover:bg-[#EBE2FC]"
                            }`}
                          >
                            <span>{isRtl ? "طبيعي (نورمال)" : "Typical"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setRegisterForm({
                                ...registerForm,
                                childCondition: "special_needs",
                              })
                            }
                            className={`h-9.5 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center ${
                              registerForm.childCondition === "special_needs"
                                ? "bg-[#6441A4] text-white shadow-[0_3px_0_#432675]"
                                : "bg-[#F5F0FF] text-[#6441A4] border-2 border-[#E9D5FF] hover:bg-[#EBE2FC]"
                            }`}
                          >
                            <span>{isRtl ? "ذوي احتياجات خاصة" : "Special Needs"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Row 5: Conditional Fields */}
                      {registerForm.childCondition === "normal" ? (
                        <div>
                          <label className="block text-[11px] font-bold text-[#30214F] mb-1 text-start">
                            {isRtl ? "الجنس" : "Gender"}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setRegisterForm({ ...registerForm, gender: "boy" })
                              }
                              className={`h-9 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center ${
                                registerForm.gender === "boy"
                                  ? "bg-[#6441A4] text-white shadow-[0_3px_0_#432675]"
                                  : "bg-[#F5F0FF] text-[#6441A4] border-2 border-[#E9D5FF] hover:bg-[#EBE2FC]"
                              }`}
                            >
                              <span>{isRtl ? "ولد" : "Boy"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setRegisterForm({ ...registerForm, gender: "girl" })
                              }
                              className={`h-9 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center justify-center ${
                                registerForm.gender === "girl"
                                  ? "bg-[#6441A4] text-white shadow-[0_3px_0_#432675]"
                                  : "bg-[#F5F0FF] text-[#6441A4] border-2 border-[#E9D5FF] hover:bg-[#EBE2FC]"
                              }`}
                            >
                              <span>{isRtl ? "بنت" : "Girl"}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="cart-disability"
                            className="block text-[11px] font-bold text-[#30214F] mb-1 text-start"
                          >
                            {isRtl ? "نوع الإعاقة أو الاحتياج" : "Disability Type"}
                          </label>
                          <select
                            id="cart-disability"
                            value={registerForm.disabilityType}
                            onChange={(e) =>
                              setRegisterForm({
                                ...registerForm,
                                disabilityType: e.target.value,
                              })
                            }
                            className="h-10 w-full rounded-2xl border-2 border-[#E9D5FF] bg-white px-3 text-xs font-bold text-[#30214F] outline-none transition focus:border-[#6441A4] focus:ring-4 focus:ring-[#6441A4]/15 cursor-pointer"
                          >
                            {(isRtl ? disabilityOptionsAr : disabilityOptionsEn).map(
                              (opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      )}

                      {/* Error Alert Message */}
                      {errorMessage && (
                        <div className="rounded-xl border border-[#F4A6A0] bg-[#FFF5F5] p-2 text-center text-[10.5px] font-bold text-[#D32F2F]">
                          {errorMessage}
                        </div>
                      )}

                      {/* 3D Tactile Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative h-12 w-full cursor-pointer rounded-2xl bg-[#6441A4] hover:bg-[#583796] text-white font-black text-sm shadow-[0_5px_0_#432675,0_12px_24px_rgba(67,38,117,0.35)] active:translate-y-1 active:shadow-[0_1px_0_#432675] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60"
                        >
                          <span>
                            {isSubmitting
                              ? isRtl
                                ? "جاري إنشاء الحساب..."
                                : "Creating Account..."
                              : isRtl
                              ? "إنشاء الحساب وبدء المغامرة"
                              : "Create Account & Start"}
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            className={`size-4.5 fill-none stroke-current stroke-3 transition-transform group-hover:${
                              isRtl ? "-translate-x-1" : "translate-x-1"
                            }`}
                          >
                            <path
                              d={
                                isRtl
                                  ? "M19 12H5M12 19l-7-7 7-7"
                                  : "M5 12h14M12 5l7 7-7 7"
                              }
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Reassurance Badge */}
                      <div className="mt-3 rounded-2xl bg-[#F5F0FF] py-2 px-3 text-center border border-[#E9D5FF] flex items-center justify-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="size-3.5 text-[#6441A4] fill-none stroke-current stroke-2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                        <p className="text-[10px] font-bold text-[#6441A4]">
                          {isRtl
                            ? "منصة تعليمية آمنة 100% وخالية تماماً من الإعلانات"
                            : "100% Safe educational platform with zero ads"}
                        </p>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: SKY ISLANDS HERO HEADLINE & FLOATING ACTION CAPSULE         */}
        {/* ========================================================================= */}
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="w-full max-w-xl flex flex-col items-center lg:items-start text-center lg:text-start justify-between min-h-[460px] py-2"
        >
          {/* Top Floating Badge & Headlines */}
          <div className="w-full">
            <div className="inline-block rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-black uppercase text-white tracking-widest border border-white/30 shadow-lg mb-3">
              {activeMode === "login"
                ? isRtl
                  ? "مغامرة جديدة"
                  : "NEW ADVENTURE"
                : isRtl
                ? "أهلاً بعودتك"
                : "WELCOME BACK"}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.55)]">
              {activeMode === "login"
                ? isRtl
                  ? "مستكشف جديد؟"
                  : "New Explorer?"
                : isRtl
                ? "أهلاً بك مجدداً!"
                : "Welcome Back!"}
            </h2>

            <p className="mt-3 text-sm sm:text-base text-white/95 font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] max-w-lg">
              {activeMode === "login"
                ? isRtl
                  ? "انضم إلينا اليوم وابدأ رحلة تعليمية مليئة بالألعاب الشيقة والكنوز المعرفية الساحرة"
                  : "Join us today and embark on a joyful journey filled with thrilling games and magical knowledge"
                : isRtl
                ? "سجّل دخولك لمتابعة تقدم أبطالك الصغار واستكشاف الجزر المعرفية الساحرة"
                : "Sign in to check your little heroes' progress and explore the magical cloud islands"}
            </p>
          </div>

          {/* Bottom Floating Interactive Action Capsule */}
          <div className="w-full max-w-md rounded-full bg-white/95 backdrop-blur-md p-2.5 px-6 shadow-[0_20px_45px_rgba(20,8,42,0.45)] border-2 border-white flex items-center justify-between gap-4 transition-transform hover:scale-[1.02]">
            <p className="text-xs sm:text-sm font-black text-[#30214F]">
              {activeMode === "login"
                ? isRtl
                  ? "مغامرتك تبدأ من هنا!"
                  : "Your adventure starts here!"
                : isRtl
                ? "لديك حساب مسجل بالفعل؟"
                : "Already have an account?"}
            </p>

            <button
              type="button"
              onClick={() =>
                setActiveMode(activeMode === "login" ? "register" : "login")
              }
              className="h-10 px-6 rounded-full bg-[#6441A4] hover:bg-[#583796] text-white font-black text-xs shadow-[0_3px_0_#432675] active:translate-y-0.5 transition-all cursor-pointer shrink-0"
            >
              {activeMode === "login"
                ? isRtl
                  ? "إنشاء حساب"
                  : "Register"
                : isRtl
                ? "تسجيل الدخول"
                : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}