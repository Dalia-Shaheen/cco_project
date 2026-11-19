"use client";

import FlairHover from "@/components/ui/FlairHover";
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

  // Double Slider State:
  // When isRightPanelActive is true -> Register form is visible on the right, overlay on the left
  // When isRightPanelActive is false -> Login form is visible on the left, overlay on the right
  const [isRightPanelActive, setIsRightPanelActive] = useState<boolean>(
    initialMode === "register"
  );

  // Register Form State
  const [registerForm, setRegisterForm] = useState({
    parentName: "",
    email: "",
    password: "",
    childName: "",
    ageGroup: t.ageGroups[0] as string,
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

  // Form submission & feedback states
  const [registerSubmitted, setRegisterSubmitted] = useState(false);
  const [loginSubmitted, setLoginSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      // Simulate/trigger NextAuth credentials sign-in
      setLoginSubmitted(true);
    } catch {
      setLoginSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] w-full bg-[#FAF8FF] px-4 py-12 sm:py-16 flex items-center justify-center">
      {/* ===================== INLINE DOUBLE SLIDER STYLES ===================== */}
      <style jsx>{`
        .double-slider-box {
          background-color: #ffffff;
          border-radius: 28px;
          box-shadow: 0 20px 50px -15px rgba(100, 65, 164, 0.25), 0 10px 20px -8px rgba(48, 33, 79, 0.12);
          position: relative;
          overflow: hidden;
          width: 960px;
          max-width: 95vw;
          min-height: 515px;
          border: 1px solid rgba(255, 255, 255, 0.95);
        }

        .ds-form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s cubic-bezier(0.77, 0, 0.175, 1);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .ds-sign-in-container {
          left: 0;
          width: 50%;
          z-index: 2;
          opacity: 1;
        }

        .double-slider-box.right-panel-active .ds-sign-in-container {
          transform: translateX(100%);
          opacity: 0;
          pointer-events: none;
        }

        .double-slider-box:not(.right-panel-active) .ds-sign-in-container {
          pointer-events: auto;
        }

        .ds-sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
          pointer-events: none;
        }

        .double-slider-box.right-panel-active .ds-sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: dsShow 0.6s cubic-bezier(0.77, 0, 0.175, 1);
          pointer-events: auto;
        }

        @keyframes dsShow {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }

        .ds-overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
          z-index: 100;
        }

        .double-slider-box.right-panel-active .ds-overlay-container {
          transform: translateX(-100%);
        }

        .ds-overlay {
          background-image: url('/explorer-kidz/register-bg.jpg');
          background-repeat: no-repeat;
          background-size: cover;
          background-position: center;
          color: #ffffff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
        }

        .double-slider-box.right-panel-active .ds-overlay {
          transform: translateX(50%);
        }

        .ds-overlay-shade {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(48, 33, 79, 0.72) 0%, rgba(100, 65, 164, 0.55) 50%, rgba(48, 33, 79, 0.78) 100%);
          pointer-events: none;
        }

        .ds-overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 36px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transform: translateX(0);
          transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
          z-index: 10;
        }

        .ds-overlay-left {
          transform: translateX(-20%);
        }

        .double-slider-box.right-panel-active .ds-overlay-left {
          transform: translateX(0);
        }

        .ds-overlay-right {
          right: 0;
          transform: translateX(0);
        }

        .double-slider-box.right-panel-active .ds-overlay-right {
          transform: translateX(20%);
        }

        .ds-ghost-btn {
          border-radius: 9999px;
          border: 2px solid #ffffff;
          background-color: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          padding: 10px 32px;
          letter-spacing: 0.05em;
          transition: all 0.25s ease-in-out;
          cursor: pointer;
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .ds-ghost-btn:hover {
          background-color: #ffffff;
          color: #563396;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        .ds-ghost-btn:active {
          transform: translateY(0);
        }
      `}</style>

      {/* ===================== DESKTOP DOUBLE SLIDER (SCREEN >= 768px) ===================== */}
      <div className="hidden md:flex justify-center w-full">
        <div
          dir="ltr"
          className={`double-slider-box ${
            isRightPanelActive ? "right-panel-active" : ""
          }`}
          id="doubleSliderContainer"
        >
          {/* Top Brand Stripe */}
          <div className="absolute top-0 inset-x-0 h-1.5 w-full bg-gradient-to-r from-[#6441A4] via-[#8F70C4] to-[#F4A6A0] z-50" />

          {/* ==================== FORM 1: SIGN UP (REGISTER) ==================== */}
          <div className="ds-form-container ds-sign-up-container px-8 lg:px-10 py-5">
            <div dir={isRtl ? "rtl" : "ltr"} className="w-full">
              {registerSubmitted ? (
                <div className="text-center py-5">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEE8F8] text-[#6441A4] font-extrabold text-lg border border-[#6441A4]/20 shadow-sm">
                    100%
                  </div>
                  <h2 className="mt-3 text-lg font-extrabold text-[#30214F]">
                    {t.successTitle}
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#625575]">
                    {t.successDesc}
                  </p>
                  <div className="mt-4 rounded-2xl bg-[#FAF8FF] p-3.5 text-start border border-[#6441A4]/15">
                    <p className="text-[11px] font-extrabold text-[#8F70C4] border-b border-[#EEE8F8] pb-1">
                      {isRtl ? "ملخص بيانات الحساب" : "Account Summary"}
                    </p>
                    <div className="mt-2 space-y-1 text-xs text-[#30214F]">
                      <p>
                        <span className="font-bold">{t.parentName}:</span>{" "}
                        {registerForm.parentName || (isRtl ? "ولي الأمر" : "Parent")}
                      </p>
                      <p>
                        <span className="font-bold">{t.email}:</span>{" "}
                        {registerForm.email}
                      </p>
                      <p>
                        <span className="font-bold">{t.childName}:</span>{" "}
                        {registerForm.childName}
                      </p>
                      <p>
                        <span className="font-bold">{isRtl ? "حالة المستكشف:" : "Profile:"}</span>{" "}
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
                  <div className="mt-5 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsRightPanelActive(false)}
                      className="rounded-xl bg-[#6441A4] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#563396] cursor-pointer"
                    >
                      {t.goToLogin}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8F70C4]">
                      {isRtl ? "حساب جديد" : "NEW ACCOUNT"}
                    </span>
                    <h2 className="text-lg font-extrabold text-[#30214F]">
                      {isRtl ? "إنشاء حساب مستكشف" : "Create Account"}
                    </h2>
                    <p className="text-[10.5px] text-[#625575]">
                      {isRtl
                        ? "ابدأ رحلة التعلم والمغامرة لطفلك"
                        : "Start your child's learning journey"}
                    </p>
                  </div>

                  {/* Row 1: Parent Name & Email */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor="ds-parentName"
                        className="block text-[10px] font-bold text-[#30214F]"
                      >
                        {t.parentName}
                      </label>
                      <input
                        id="ds-parentName"
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
                        className="mt-0.5 h-8.5 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-2.5 text-xs text-[#30214F] outline-none transition focus:border-[#6441A4] focus:bg-white focus:ring-2 focus:ring-[#6441A4]/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ds-reg-email"
                        className="block text-[10px] font-bold text-[#30214F]"
                      >
                        {t.email}
                      </label>
                      <input
                        id="ds-reg-email"
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
                        className="mt-0.5 h-8.5 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-2.5 text-xs text-[#30214F] outline-none transition focus:border-[#6441A4] focus:bg-white focus:ring-2 focus:ring-[#6441A4]/20"
                      />
                    </div>
                  </div>

                  {/* Row 2: Password & Child Name */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label
                        htmlFor="ds-reg-password"
                        className="block text-[10px] font-bold text-[#30214F]"
                      >
                        {t.password}
                      </label>
                      <input
                        id="ds-reg-password"
                        type="password"
                        required
                        placeholder={t.passwordPlaceholder}
                        value={registerForm.password}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            password: e.target.value,
                          })
                        }
                        className="mt-0.5 h-8.5 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-2.5 text-xs text-[#30214F] outline-none transition focus:border-[#6441A4] focus:bg-white focus:ring-2 focus:ring-[#6441A4]/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="ds-childName"
                        className="block text-[10px] font-bold text-[#30214F]"
                      >
                        {t.childName}
                      </label>
                      <input
                        id="ds-childName"
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
                        className="mt-0.5 h-8.5 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-2.5 text-xs text-[#30214F] outline-none transition focus:border-[#6441A4] focus:bg-white focus:ring-2 focus:ring-[#6441A4]/20"
                      />
                    </div>
                  </div>

                  {/* Child Condition (Normal vs Special Needs) */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#30214F]">
                      {isRtl ? "حالة الطفل" : "Child Condition"}
                    </label>
                    <div className="mt-0.5 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setRegisterForm({
                            ...registerForm,
                            childCondition: "normal",
                          })
                        }
                        className={`h-7.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          registerForm.childCondition === "normal"
                            ? "border-[#6441A4] bg-[#6441A4] text-white shadow-sm"
                            : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F] hover:border-[#6441A4]/50"
                        }`}
                      >
                        {isRtl ? "طبيعي (نورمال)" : "Normal / Typical"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRegisterForm({
                            ...registerForm,
                            childCondition: "special_needs",
                          })
                        }
                        className={`h-7.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                          registerForm.childCondition === "special_needs"
                            ? "border-[#6441A4] bg-[#6441A4] text-white shadow-sm"
                            : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F] hover:border-[#6441A4]/50"
                        }`}
                      >
                        {isRtl ? "ذوي احتياجات خاصة" : "Special Needs"}
                      </button>
                    </div>
                  </div>

                  {/* Row 5: Conditional Branching */}
                  {registerForm.childCondition === "normal" ? (
                    <div>
                      <label className="block text-[10px] font-bold text-[#30214F]">
                        {isRtl ? "الجنس" : "Gender"}
                      </label>
                      <div className="mt-0.5 grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setRegisterForm({ ...registerForm, gender: "boy" })
                          }
                          className={`h-7.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            registerForm.gender === "boy"
                              ? "border-[#6441A4] bg-[#6441A4] text-white shadow-sm"
                              : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F] hover:border-[#6441A4]/50"
                          }`}
                        >
                          {isRtl ? "ولد" : "Boy"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRegisterForm({ ...registerForm, gender: "girl" })
                          }
                          className={`h-7.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                            registerForm.gender === "girl"
                              ? "border-[#6441A4] bg-[#6441A4] text-white shadow-sm"
                              : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F] hover:border-[#6441A4]/50"
                          }`}
                        >
                          {isRtl ? "بنت" : "Girl"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="ds-disability"
                        className="block text-[10px] font-bold text-[#30214F]"
                      >
                        {isRtl ? "نوع الإعاقة أو الاحتياج" : "Disability / Need Type"}
                      </label>
                      <select
                        id="ds-disability"
                        value={registerForm.disabilityType}
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            disabilityType: e.target.value,
                          })
                        }
                        className="mt-0.5 h-8 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-2 text-xs text-[#30214F] outline-none transition focus:border-[#6441A4] focus:bg-white focus:ring-2 focus:ring-[#6441A4]/20 cursor-pointer"
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
                    <div className="rounded-xl border border-[#F4A6A0] bg-[#FFF5F5] p-2 text-center text-[10px] font-bold text-[#D32F2F]">
                      {errorMessage}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-1.5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative h-9.5 w-full cursor-pointer rounded-xl bg-[#6441A4] text-xs font-bold text-white shadow-md outline-offset-2 transition-all hover:bg-[#563396] focus-visible:outline-2 focus-visible:outline-[#6441A4] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <FlairHover color="#FFFFFF" />
                      <span className="relative transition-colors duration-75 motion-safe:group-hover:text-[#563396] motion-safe:group-hover:delay-100">
                        {isSubmitting
                          ? isRtl
                            ? "جاري إنشاء الحساب..."
                            : "Creating Account..."
                          : t.submit}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ==================== FORM 2: SIGN IN (LOGIN) ==================== */}
          <div className="ds-form-container ds-sign-in-container px-8 lg:px-10 py-6">
            <div dir={isRtl ? "rtl" : "ltr"} className="w-full">
              {loginSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#EEE8F8] text-[#6441A4] font-extrabold text-xl border border-[#6441A4]/20 shadow-sm">
                    100%
                  </div>
                  <h2 className="mt-4 text-xl font-extrabold text-[#30214F]">
                    {isRtl ? "أهلاً بك مجدداً!" : "Welcome back!"}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-[#625575]">
                    {isRtl
                      ? "تم تسجيل الدخول بنجاح. جاري نقلك إلى لوحة المتابعة..."
                      : "Successfully signed in. Redirecting to your dashboard..."}
                  </p>
                  <div className="mt-6 flex justify-center gap-2">
                    <Link
                      href={`/${locale}`}
                      className="rounded-xl bg-[#6441A4] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#563396]"
                    >
                      {isRtl ? "الصفحة الرئيسية" : "Home"}
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8F70C4]">
                      {isRtl ? "منطقة الأهالي" : "PARENT AREA"}
                    </span>
                    <h2 className="mt-0.5 text-2xl font-extrabold text-[#30214F]">
                      {isRtl ? "تسجيل الدخول" : "Sign In"}
                    </h2>
                    <p className="text-xs text-[#625575]">
                      {isRtl
                        ? "سجّل الدخول لمتابعة تقدم أبطالك الصغار"
                        : "Sign in to see your children and their progress"}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="ds-log-email"
                      className="block text-xs font-bold text-[#30214F]"
                    >
                      {t.email}
                    </label>
                    <input
                      id="ds-log-email"
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none transition focus:border-[#6441A4] focus:bg-white focus:ring-2 focus:ring-[#6441A4]/20"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="ds-log-password"
                      className="block text-xs font-bold text-[#30214F]"
                    >
                      {t.password}
                    </label>
                    <input
                      id="ds-log-password"
                      type="password"
                      required
                      placeholder={t.passwordPlaceholder}
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none transition focus:border-[#6441A4] focus:bg-white focus:ring-2 focus:ring-[#6441A4]/20"
                    />
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[#625575]">
                      <input
                        type="checkbox"
                        checked={loginForm.rememberMe}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            rememberMe: e.target.checked,
                          })
                        }
                        className="rounded border-[#6441A4]/30 text-[#6441A4] focus:ring-[#6441A4]"
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

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group relative h-11 w-full cursor-pointer rounded-xl bg-[#6441A4] text-xs font-bold text-white shadow-md outline-offset-2 transition-all hover:bg-[#563396] focus-visible:outline-2 focus-visible:outline-[#6441A4]"
                    >
                      <FlairHover color="#FFFFFF" />
                      <span className="relative transition-colors duration-75 motion-safe:group-hover:text-[#563396] motion-safe:group-hover:delay-100">
                        {isRtl ? "تسجيل الدخول" : "Sign In"}
                      </span>
                    </button>
                  </div>

                  {/* Platform Safety Note */}
                  <div className="rounded-xl bg-[#EEE8F8]/50 p-2.5 text-center">
                    <p className="text-[11px] font-medium text-[#563396]">
                      {isRtl
                        ? "منصة تعليمية آمنة 100% وخالية تماماً من الإعلانات"
                        : "100% safe educational platform with zero ads"}
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ==================== THE SLIDING OVERLAY CONTAINER ==================== */}
          <div className="ds-overlay-container">
            <div className="ds-overlay">
              <div className="ds-overlay-shade" />

              {/* OVERLAY PANEL LEFT (Visible when Register is active -> invites to Log In) */}
              <div className="ds-overlay-panel ds-overlay-left">
                <div dir={isRtl ? "rtl" : "ltr"} className="max-w-[280px]">
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-sm border border-white/30">
                    {isRtl ? "منصة المستكشف" : "EXPLORER PLATFORM"}
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold text-white leading-tight">
                    {isRtl ? "أهلاً بك مجدداً!" : "Welcome Back!"}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/90">
                    {isRtl
                      ? "إذا كان لديك حساب مسجل بالفعل، سجل دخولك الآن لمتابعة مسار طفلك التعليمي الممتع"
                      : "If you already have an account, sign in here to follow your little explorer's journey"}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsRightPanelActive(false)}
                      className="ds-ghost-btn"
                    >
                      {isRtl ? "تسجيل الدخول" : "Sign In"}
                    </button>
                  </div>
                </div>
              </div>

              {/* OVERLAY PANEL RIGHT (Visible when Login is active -> invites to Sign Up) */}
              <div className="ds-overlay-panel ds-overlay-right">
                <div dir={isRtl ? "rtl" : "ltr"} className="max-w-[280px]">
                  <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-sm border border-white/30">
                    {isRtl ? "مغامرة جديدة" : "NEW ADVENTURE"}
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold text-white leading-tight">
                    {isRtl ? "مستكشف جديد؟" : "Hello, Explorer!"}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/90">
                    {isRtl
                      ? "انضم إلينا اليوم وابدأ رحلة تعليمية تفاعلية شيقة بين جزر المعرفة الساحرة"
                      : "Enter your details and start a joyful learning journey across the cloud islands"}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsRightPanelActive(true)}
                      className="ds-ghost-btn"
                    >
                      {isRtl ? "إنشاء حساب" : "Sign Up"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== MOBILE AUTH CARD (SCREEN < 768px) ===================== */}
      <div className="block md:hidden w-full max-w-md mx-auto">
        <div className="overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-xl">
          {/* Mobile Image Banner */}
          <div className="relative h-40 w-full overflow-hidden select-none">
            <Image
              src="/explorer-kidz/register-bg.jpg"
              alt="Explorer Sky Islands"
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#30214F]/85 via-[#30214F]/40 to-transparent flex flex-col justify-end p-4">
              <span className="inline-block w-fit rounded-full bg-white/90 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-[#6441A4]">
                {t.heroBadge}
              </span>
              <h2 className="mt-1 text-lg font-extrabold text-white">
                {isRightPanelActive
                  ? isRtl
                    ? "إنشاء حساب مستكشف جديد"
                    : "Create Explorer Account"
                  : isRtl
                  ? "تسجيل دخول الأهالي"
                  : "Parent Login"}
              </h2>
            </div>
          </div>

          {/* Mobile Segmented Switcher */}
          <div className="p-4 pb-0">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-[#EEE8F8] p-1">
              <button
                type="button"
                onClick={() => setIsRightPanelActive(false)}
                className={`rounded-lg py-2 text-xs font-extrabold transition-all cursor-pointer ${
                  !isRightPanelActive
                    ? "bg-white text-[#6441A4] shadow-sm"
                    : "text-[#625575] hover:text-[#30214F]"
                }`}
              >
                {isRtl ? "تسجيل الدخول" : "Sign In"}
              </button>
              <button
                type="button"
                onClick={() => setIsRightPanelActive(true)}
                className={`rounded-lg py-2 text-xs font-extrabold transition-all cursor-pointer ${
                  isRightPanelActive
                    ? "bg-white text-[#6441A4] shadow-sm"
                    : "text-[#625575] hover:text-[#30214F]"
                }`}
              >
                {isRtl ? "إنشاء حساب" : "Sign Up"}
              </button>
            </div>
          </div>

          {/* Mobile Form Body */}
          <div className="p-5" dir={isRtl ? "rtl" : "ltr"}>
            {isRightPanelActive ? (
              /* Mobile Register */
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#30214F]">
                    {t.parentName}
                  </label>
                  <input
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
                    className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#30214F]">
                    {t.email}
                  </label>
                  <input
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
                    className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#30214F]">
                    {t.password}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder={t.passwordPlaceholder}
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#30214F]">
                    {t.childName}
                  </label>
                  <input
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
                    className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none"
                  />
                </div>

                {/* Mobile Child Condition */}
                <div>
                  <label className="block text-[11px] font-bold text-[#30214F]">
                    {isRtl ? "حالة الطفل" : "Child Condition"}
                  </label>
                  <div className="mt-1 grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setRegisterForm({
                          ...registerForm,
                          childCondition: "normal",
                        })
                      }
                      className={`h-8 rounded-xl border text-[10px] font-bold transition-all ${
                        registerForm.childCondition === "normal"
                          ? "border-[#6441A4] bg-[#6441A4] text-white"
                          : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F]"
                      }`}
                    >
                      {isRtl ? "طبيعي (نورمال)" : "Normal / Typical"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRegisterForm({
                          ...registerForm,
                          childCondition: "special_needs",
                        })
                      }
                      className={`h-8 rounded-xl border text-[10px] font-bold transition-all ${
                        registerForm.childCondition === "special_needs"
                          ? "border-[#6441A4] bg-[#6441A4] text-white"
                          : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F]"
                      }`}
                    >
                      {isRtl ? "ذوي احتياجات خاصة" : "Special Needs"}
                    </button>
                  </div>
                </div>

                {/* Mobile Conditional Field */}
                {registerForm.childCondition === "normal" ? (
                  <div>
                    <label className="block text-[11px] font-bold text-[#30214F]">
                      {isRtl ? "الجنس" : "Gender"}
                    </label>
                    <div className="mt-1 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setRegisterForm({ ...registerForm, gender: "boy" })
                        }
                        className={`h-8 rounded-xl border text-[10px] font-bold transition-all ${
                          registerForm.gender === "boy"
                            ? "border-[#6441A4] bg-[#6441A4] text-white"
                            : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F]"
                        }`}
                      >
                        {isRtl ? "ولد" : "Boy"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRegisterForm({ ...registerForm, gender: "girl" })
                        }
                        className={`h-8 rounded-xl border text-[10px] font-bold transition-all ${
                          registerForm.gender === "girl"
                            ? "border-[#6441A4] bg-[#6441A4] text-white"
                            : "border-[#6441A4]/20 bg-[#FAF8FF] text-[#30214F]"
                        }`}
                      >
                        {isRtl ? "بنت" : "Girl"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="ds-mob-disability"
                      className="block text-[11px] font-bold text-[#30214F]"
                    >
                      {isRtl ? "نوع الإعاقة أو الاحتياج" : "Disability / Need Type"}
                    </label>
                    <select
                      id="ds-mob-disability"
                      value={registerForm.disabilityType}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          disabilityType: e.target.value,
                        })
                      }
                      className="mt-1 h-9 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3 text-xs text-[#30214F] outline-none"
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

                {errorMessage && (
                  <div className="rounded-xl border border-[#F4A6A0] bg-[#FFF5F5] p-2 text-center text-[10px] font-bold text-[#D32F2F]">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 h-11 w-full rounded-xl bg-[#6441A4] text-xs font-bold text-white shadow-md hover:bg-[#563396] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting
                    ? isRtl
                      ? "جاري إنشاء الحساب..."
                      : "Creating Account..."
                    : t.submit}
                </button>
              </form>
            ) : (
              /* Mobile Login */
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#30214F]">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t.emailPlaceholder}
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#30214F]">
                    {t.password}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder={t.passwordPlaceholder}
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 h-10 w-full rounded-xl border border-[#6441A4]/20 bg-[#FAF8FF] px-3.5 text-xs text-[#30214F] outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 h-11 w-full rounded-xl bg-[#6441A4] text-xs font-bold text-white shadow-md hover:bg-[#563396]"
                >
                  {isRtl ? "تسجيل الدخول" : "Sign In"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
