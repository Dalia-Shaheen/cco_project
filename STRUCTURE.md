# Lobly — خريطة الهيكل (Scaffold only)

كل الملفات دي **فاضية** وموجودة بس عشان تكتب أنت الكود جوّها. مفيش أي تنفيذ.

## الشجرة

```text
D:\CCO
├─ app/
│  ├─ [locale]/
│  │  ├─ layout.tsx                         ← Root layout (html/body, dir ltr|rtl) + metadata + JSON-LD. مفيش Navbar هنا.
│  │  ├─ opengraph-image.tsx                 ← OG image ديناميكي 1200×630 (EN/AR)
│  │  ├─ (site)/                            ← الصفحات العامة: هي اللي بتعرض Navbar
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx                        ← Home (EN / AR)
│  │  │  ├─ get-started/page.tsx
│  │  │  └─ login/page.tsx
│  │  ├─ (parent)/
│  │  │  ├─ layout.tsx                      ← Role guard: PARENT | ADMIN
│  │  │  └─ dashboard/
│  │  │     ├─ page.tsx                     ← قائمة الأطفال + لينك → /${locale}/map/${child.id}
│  │  │     └─ actions.ts                   ← addChild + (لاحقاً) checkout/refill
│  │  └─ (child)/
│  │     ├─ layout.tsx                      ← بدون navbar، bg #FAF8FF، Back → /${locale}/dashboard
│  │     ├─ map/[childId]/page.tsx          ← Ownership guard → SteppingStonesMap
│  │     └─ play/[childId]/
│  │        ├─ page.tsx                     ← Hub: sticky tokens/energy + Video/Story/Game
│  │        ├─ actions.ts                   ← markVideoWatched / completeStory / consumeEnergy / ...
│  │        └─ cooldown/page.tsx            ← شاشة الـ 24h cooldown
│  ├─ api/auth/[...nextauth]/route.ts       ← authOptions (Credentials) + route handlers
│  ├─ sitemap.ts                            ← sitemap.xml لكل اللغات مع hreflang
│  ├─ robots.ts                             ← robots.txt (يمنع dashboard/play/map/api)
│  └─ manifest.ts                           ← PWA manifest (ألوان البراند)
├─ components/
│  ├─ Navbar.tsx                            ← Client: الناف الوحيد (Menu-first + زرار المنيو)
│  ├─ Footer.tsx                            ← سطر الفوتر الوحيد (data-reveal + #help)
│  ├─ explorer-kidz/
│  │  ├─ HomeHero.tsx
│  │  ├─ AddChildForm.tsx                   ← Client: name + NORMAL/SPECIAL_NEEDS
│  │  ├─ SessionKickout.tsx                 ← Client: setTimeout → router.push(cooldown)
│  │  ├─ SteppingStonesMap.tsx              ← Client: GSAP (spring للأفاتار)، 3 stones + island
│  │  ├─ HubCard.tsx                        ← حالة: active | done | locked
│  │  └─ ParentCheckoutModal.tsx            ← Client: modal اللي هتعبي الـ energy
│  ├─ mfa/
│  │  └─ RollingLettersMenu.tsx             ← المنيو ملء الشاشة (MIT) + Context
│  ├─ animation/
│  │  └─ ScrollReveal.tsx                   ← GSAP scroll reveal لـ [data-reveal]
│  └─ seo/
│     └─ JsonLd.tsx                         ← structured data (EducationalOrganization + WebSite)
├─ lib/
│  ├─ prisma.ts                             ← PrismaClient singleton
│  ├─ password.ts                           ← crypto.scrypt + timingSafeEqual (مفيش bcrypt)
│  ├─ i18n.ts                               ← Locale + isLocale + locales + otherLocale
│  ├─ seo.ts                                ← إعداد SEO مركزي: metadata/OG/hreflang/structured data
│  ├─ session-logic.ts                      ← حد الـ 20 دقيقة + الـ 24 ساعة (UTC)
│  └─ content.ts                   ← كل النصوص EN/AR (dashboard / map / play / cooldown / checkout)
├─ prisma/schema.prisma
├─ types/next-auth.d.ts                     ← Session.user + JWT: id, role
├─ public/
│  ├─ favicon.svg                           ← أيقونة البراند (اتعملت)
│  └─ explorer-kidz/                        ← لازم تضيف الصور بنفسك (مش قادر أنشئ png):
│     └─ hero.png, island-adhd.png, island-autism.png, island-down.png
├─ styles/globals.css
├─ .env                                      ← الاسم الوحيد اللي Next و Prisma بيقرأوه (مش .env.dev)
├─ .env.example                              ← template بدون قيم (مسموح بالـ commit)
├─ next.config.ts
├─ eslint.config.mjs
├─ tsconfig.json
└─ .gitignore
```

## اللي تكتبه في كل ملف (توقيعات بس)

### `lib/`
| الملف | المطلوب |
|---|---|
| `prisma.ts` | يصدّر `prisma` كـ singleton من `PrismaClient`. |
| `password.ts` | `hashPassword(password: string): string` و `verifyPassword(password: string, stored: string): boolean`. الصيغة `salt:key` باستخدام `scrypt`. |
| `i18n.ts` | `type Locale = "en" \| "ar"` و `isLocale(value: string): value is Locale`. |
| `session-logic.ts` | `DAILY_PLAY_LIMIT_MS` = 20 دقيقة، `COOLDOWN_MS` = 24 ساعة، و `checkChildSession(childId: string)` ترجّع `{ canPlay, isNewSession, timeLeftMs }` بناءً على UTC. |
| `content.ts` | `explorerContent: Record<Locale, ExplorerContent>` — ثابت `dashboard` (منه `exploreIslands`)، `map`، `play` (منه `action`)، `cooldown`، **`checkout`**. |

### Auth / PRISMA
- `app/api/auth/[...nextauth]/route.ts` → `authOptions` (Credentials provider + JWT strategy) + export الـ handlers. لازم `session.user.id` و `session.user.role` يتخزنوا في الـ token.
- `types/next-auth.d.ts` → تمديد `Session["user"]` و `JWT` بـ `id: string` و `role: "PARENT" \| "ADMIN"`.
- `prisma/schema.prisma` →Enums: `Role` (ADMIN, PARENT)، `ChildPath` (NORMAL, SPECIAL_NEEDS). Models: `User`، `Child` (parentId, name, path, tokens, energy)، `IslandProgress` (childId, islandName, isVideoWatched, isStoryCompleted, isGameUnlocked + unique `[childId, islandName]`)، `PlaySession` (childId, startTime, endTime + index `[childId, startTime]`).

### `(parent)`
- `layout.tsx` → `getServerSession` + تحقق `PARENT`/`ADMIN` وإلا `redirect(/login)`.
- `dashboard/actions.ts` → `addChild({ name, path, locale })` مع تحقق الملكية + `revalidatePath`؛ ومكان محجوز لـ `refillEnergy` / `checkout`.
- `dashboard/page.tsx` → `prisma.child.findMany({ where: { parentId: session.user.id } })` + لكل طفل كارت فيه ⭐/⚡ ولينك `/${locale}/map/${child.id}`.

### `(child)`
- `layout.tsx` → زر Back → `/${locale}/dashboard`، `<div className="min-h-screen w-full bg-[#FAF8FF]">`، **بدون** Navbar.
- `map/[childId]/page.tsx` → `params` promise، `isLocale`، جلب الطفل، `child.parentId !== session.user.id → notFound()`، تمرير `childId/name/locale/labels` لـ `SteppingStonesMap`.
- `play/[childId]/page.tsx` → نفس الـ guard + `checkChildSession` (لو `!canPlay` → redirect للـ cooldown، لو `isNewSession` → `prisma.playSession.create`)،Bar لاصق بالتوكنز/الطاقة، وحالة الكروت:
  - Video: `!isVideoWatched → active` وإلا `done`
  - Story: `!isVideoWatched → locked`، `isStoryCompleted → done`، وإلا `active`
  - Game: `!isStoryCompleted → locked` وإلا `active`
  - الربط بـ `.bind(null, childId, islandName)` جوّه `<form action={...}>`؛ المقفول/المنتهي `<div>` ثابت.
- `play/[childId]/actions.ts` → كل action يبدأ بـ `requireOwnedChild(childId)`:
  - `markVideoWatched(childId, islandName)` → upsert `isVideoWatched: true`
  - `completeStory(childId, islandName)` → `$transaction`: upsert `isStoryCompleted: true` + `tokens += 10`
  - `consumeEnergy(childId)` → `child.updateMany({ where: { id, energy: { gt: 0 } }, data: { energy: { decrement: 1 } } })`
  - `refillEnergy(childId)` / `checkout(...)` → **مكان محجوز، محتاج باقي المواصفات** (شوف الملاحظات).
  - كلهم `revalidatePath` للـ play والـ dashboard.
- `cooldown/page.tsx` → شاشة ودودة فيها وقت الرجوع + لينك للـ dashboard.

### Components
- `SteppingStonesMap.tsx` → `"use client"`، مواقع `%` لـ 3 أحجار + الجزيرة، `currentStep` يبدأ 0، الخطوة التالية بس القابلة للضغط، حركة الأفاتار بـ `gsap.to(..., { ease: "elastic.out(1, 0.5)" })` من `lib/gsap.ts`، عند الوصول للجزيرة `setTimeout(..., 800)` ثم `router.push(\`/${locale}/play/${childId}\`)`.
- `SessionKickout.tsx` → `"use client"`، `setTimeout(timeLeftMs)` → push للـ cooldown، مع cleanup.
- `ParentCheckoutModal.tsx` → `"use client"`، modal داخل لوحة الـ parent / الـ hub ل تعبئة الطاقة.
- `AddChildForm.tsx` → `"use client"`، `useActionState` مع الـ server action +	public `pending` state.

## ملاحظات مهمة قبل ما تبدأ

1. **رسالة `create-next-app`:** الاسم `CCO` فيه حروف كبيرة و npm بيرفض ده. الاستراكتر ده اتعمل يدوياً فمش محتاج الأداة. لو عايز `create-next-app` اعمله في مجلد اسمه صغير (مثلاً `D:\lobly`) — ومتعملهوش بـ `.` فوق مجلد فيه `package.json`/`node_modules` موجودين.
2. **مهمة الـ checkout وصلت مقطوعة:** عندي بس `Action 1: consumeEnergy`. محتاج الخطوة 2 onwards (إيه اللي بيحصل بعدها: هل فيه payment؟ كام طاقة بترجع؟ الـ modal بيتربط بـ action إزاي؟) عشان تكتب `refillEnergy`/`checkout` صح.
3. **`package.json`** بقى هو الـ default بتاع `create-next-app@16.4.6` (scripts: dev/build/start/lint + next/react/react-dom + Tailwind 4.3 عبر Turbopack + TypeScript + ESLint) ومعاه حاجات Lobly: `next-auth`, `lucide-react`, و`prisma`/`@prisma/client` بإصدار متطابق `6.19.3`. الأنيميشن كله بـ `gsap` + `@gsap/react` (مفيش Framer Motion). مفيش `postinstall` ولا `prisma.config.ts`. الـ `npm install` اتعمل ✔ والـ lockfile بقى باسم `lobly`.
4. **الصور** في `public/explorer-kidz/` مش موجودة — انقلها من النسخة القديمة أو حط بدائل.
5. قواعد الـ brand: `#6441A4`، `#FAF8FF`، `rounded-2xl`، ظلال ناعمة، `shadow-card`، ألوان pastel بنفسجية.
6. **الـ env اتظبط ✔:** `.env` فيه connection strings حقيقية من Neon (pooled + unpooled) + `NEXTAUTH_SECRET` + `NEXTAUTH_URL` + `NEXT_PUBLIC_SITE_URL`. `.gitignore` فيه `.env*` مع استثناء `.env.example`.
7. **Prisma اتظبط ✔:** `npx prisma validate` و `prisma generate` و `prisma db push` نجحوا والداتابيز في sync.
8. **`lib/prisma.ts`:** بيصدّر `export default prisma` → كل الاستيرادات لازم تكون `import prisma from "@/lib/prisma"` مش `import { prisma }`.
9. **الخطوط واللغة ✔:** `@import "tailwindcss"` + tokens + `@theme inline` للخطوط من `next/font/google`. **مهم جداً في Tailwind 4:** الـ utilities جوّه `@layer utilities`، فأي قاعدة `body { font-family: … }` unlayered بتغلب كلاس `font-cairo`/`font-poppins` في الـ cascade — عشان كده `font-family` اتشال من قاعدة `body` في `globals.css` واتحط كـ **inline style** على `<body>` في `[locale]/layout.tsx` (بيشتغل لايف ويغلب أي CSS قديم). كمان فيه `html[lang="ar"] .font-poppins { font-family: var(--cairo)… }` كـ safety net لأي كود جديد. `Navbar` بيستخدم `fontClass` locale-aware. اتأكدنا بـ Chrome headless: `/ar` → `Cairo, "Cairo Fallback", …` و`/en` → `Poppins, "Poppins Fallback", …`.
10. **SEO اتعمل ✔:** `app/[locale]/layout.tsx` بيضبط `html lang/dir` + `generateMetadata` + `generateStaticParams` + JSON-LD. لأي صفحة عامة جديدة صدّر `generateMetadata` واستدعِ `buildMetadata({ locale, path })` من `lib/seo.ts`. `sitemap.ts` / `robots.ts` / `manifest.ts` / `opengraph-image.tsx` شغالين تلقائياً. غيّر `NEXT_PUBLIC_SITE_URL` وقت النشر. الصفحات الخاصة ممنوحة في `robots.txt`؛ لو عايز `noindex` صريح ضيف `export const metadata = { robots: { index: false } }` في layout بتاعها.
11. **الصفحات العامة اتكتبت ✔:** `page.tsx` (تصميم Figma: كارت المحتوى + 3 جزر + صورة البطل + footer)، `get-started/page.tsx` (3 خطوات)، `login/page.tsx` (نموذج placeholder لحد ما يتربط بـ NextAuth)، مع `Navbar.tsx` و`Footer.tsx` و`styles/globals.css` (Tailwind 4 + tokens `ink/card/shadow-card`). نصوص الـ home في `lib/content.ts` (`explorerContent`)، ونصوص باقي الصفحات في `lib/site-copy.ts`. الصور لسه placeholders لحد ما تضيف `public/explorer-kidz/*.png`. كل المسارات `/en` و `/ar` بترجع 200.
12. **الجذر `/`:** مفيش `app/page.tsx` (لأن الـ root layout جوّه `[locale]`)؛ بدل كده `next.config.ts` فيه `redirects()` تحوّل `/` → `/en`. متضيفش `app/page.tsx` وإلا هيطلب `app/layout.tsx` ويقع كل حاجة.
13. **ناف Menu-first ✔:** الناف بار `absolute` بارتفاع 68px على الموبايل و80px من `sm`، عرضه `min(1392px, 100%-...)`، ومثبّت `dir="ltr"` عشان ترتيب العناصر يبقى واحد في اللغتين (لوجو شمال / أكشنز يمين). دوره **هوية + أكشن أساسي + مدخل المنيو** مش تنقّل كامل: اللوجو (Poppins/LTR) + مساحة مرنة + [اللغة + Login + زرار المنيو]. **مفيش لينكات صفحات في الناف** (اتشالت Home/Islands/How/Help) — كلها جوه المنيو بس. **زرار المنيو بقى جوّه `<nav>` فعلاً** (مش عائم): بياخد الـ `registerTrigger` من `useRollingMenu()` عشان البانل يتكشف من مركزه، وشكله **secondary** (`bg-[#EEE8F8]` + نص بنفسجي) عشان «دخول» يفضل الـ primary الوحيد. الزرار فيه أيقونة burger بتتحوّل X وقت الفتح، ونفس ارتفاع/خط/حجم «دخول» بالظبط: `h-12`، `text-[16px]` موبايل و`text-[20px]` من `sm`، Cairo في العربي وPoppins في الإنجليزي، و`w-[84px] sm:w-[112px]`. **اللغة على الموبايل بقت زرار واحد 48px** بيعرض اللغة التانية (`ع` / `EN`) ويبدّل عليها، والسويتش الكامل (EN/عربي) ظاهر من `sm` بس — ده اللي خلّى الناف مفيش فيه overflow حتى عند 320px. اللوجو 18px على الموبايل، Login `w-[64px]` موبايل و`w-[112px]` من `sm`، وكل الأزرار عليها `focus-visible` outline بنفسجي. الناف `z-[110]` (فوق البانل `z-100`)، ولما المنيو يفتح: خلفية شفافة + `pointer-events-none` + اللوجو/اللغة/Login بـ `invisible`، والزرار بس `pointer-events-auto` عشان يقفل. مفيش `pe` محجوز خلاص. `(site)/layout` بيسلّم المحتوى لـ `SiteMenuShell` اللي بيضيف `pt-28`. الـ home: عنوان 30→38→44px، الجزر `grid-cols-3` على الموبايل و`flex` من `sm`، والفوتر بيتحول من static (mt-auto) لـ `absolute` من `sm`. **التنظيم:** الناف والفوتر بقوا في ملفين واحدين بس: `components/Navbar.tsx` و`components/Footer.tsx` — والنسخة القديمة المكررة (`components/explorer-kidz/GlobalNavbar.tsx` اللي كان فيها Radix dropdown ولينكات الناف) اتشالت.
14. **المنيو الطفولي + GSAP ✔:** `npx madeforaward add rolling-letters-menu` ضاف `components/mfa/RollingLettersMenu.tsx` (MIT). المنيو بقى **ملء الشاشة**: البانل بيتكشف بـ `clip-path: circle(0 → reach)` من مركز زرار المنيو بـ `expo.inOut`، وكل حرف في الكلمات بيدور كـ مكعب 3D بـ `rotationX` مع stagger، والبانل بيغيّر لونه حسب العنصر المُختار. `Navbar` اتشال منه Radix dropdown بالكامل (ودّع `forceMount` اللي كان بيخلي الضغطة تفتح وتقفل في نفس اللحظة). **`SiteMenuShell.tsx`** هو الـ client wrapper: بيمرّر items/ألوان بنفسجية/brand/navigate handler للمكوّن، والناف بار بيمرّره في prop جديد **`header`** — والـ `header` بيتّرسم **بره** الـ wrapper اللي عليه `inert`، فزرار المنيو يفضل قابل للضغط والبانل مفتوح. المكوّن بقى بيصدّر **`RollingMenuContext` + `useRollingMenu()`** (`{open, toggle, close, registerTrigger}`) عشان أي host يرسم الزرار بنفسه؛ لما يتسجّل زرار خارجي الزرار الداخلي بيختفي، والـ `clip-path` بيتحسب من **مركز الزرار الخارجي**، والـ focus بيرجع له عند الغلق. المنيو فيه **4 عناصر تنقّل بس** (Home/Islands/How It Works/Help) — **مفيش عنصر لغة جوه المنيو** (اللغة بقت في الناف فقط)، والـ `onNavigate` بيعمل `router.push` للتنقّل client-side بدل reload كامل. أضفنا للمكوّن props: `dir` للعربية، `triggerColor`/`triggerInk`/`triggerLabels` (للزرار الداخلي لو مستخدمش `header`)، و`header`. **مهم للعربي:** `RollWord` بيفصل الحروف لمكعبات للاتيني فقط؛ العربي (والخطوط المتصلة) بيتدحرج كلمة كاملة لأن تقسيمه حرف حرف بيكسّر وصل الحروف. الزرار في RTL بيشيل `uppercase`/`letter-spacing`. الكلمات اللاتينية جوه بانل RTL بتاخد `dir="ltr"` عشان متتقلبش، والحروف الزخرفية `select-none` عشان نسخ النص ميكرّرش الحروف (وشّين المكعب). تغيير اللغة بقى من أزرار الناف فقط (`coverScreen`). الأنيميشن كله GSAP — `lib/gsap.ts` بيصدّر `gsap`, `useGSAP`, `prefersReducedMotion`, `ScrollTrigger`؛ لأي أنيميشن جديد استورد منه.
15. **Scroll reveal ✔:** `lib/gsap.ts` سجّل كمان `ScrollTrigger`. المكوّن المشترك `components/animation/ScrollReveal.tsx` بيرسم عناصر `[data-reveal]` لما تدخل الـ viewport (`once: true`)، وبيستخدم `display: contents` عشان ميبّدلش الـ flex layout. Home بيستورده ويعلّم eyebrow/title/subtitle/buttons/الجزر/صورة البطل/الفوتر. `prefers-reduced-motion` بيوقف الحركة.
16. **Full-screen locale transition ✔:** `lib/locale-transition.ts` موديول مستقل (حالة `active` في الـ module عشان تنجو من إعادة الـ mount بتاعة `[locale]`) بيعمل overlay ثابت `#6441A4` بـ `z-index: 9999` وكلمة Lobly في النص. `coverScreen(cb, direction)` يغطي الشاشة بـ GSAP بـ sweep أفقي: العربي (RTL) بيدخل من اليمين (`xPercent 100 → 0`) والإنجليزي (LTR) من اليسار (`-100 → 0`)، والكشف بيكمل في نفس الاتجاه؛ ثم ينفّذ `router.push(switchUrl)`؛ و`useEffect` على `pathname` في `Navbar` بينادي `revealScreen()` بعد ما الراوتر يتغيّر. فيه `prefersReducedMotion` وfallback بعد 3 ثواني عشان الشاشة متفضلش مغطاة لو النافيجيشن فشل. الأزرار EN/عربي في الناف هي المكان الوحيد لتبديل اللغة دلوقتي.
